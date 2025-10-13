"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { apiClient } from "@/lib/api";
import type {
  AuditSearchResult,
  CategoryResults,
  FeedbackSearchResult,
  FileSearchResult,
  SearchCategory,
  SearchResponse,
  UserSearchResult,
} from "@/lib/types/search";

// Navigation URL mapper for each category
const CATEGORY_URL_MAPPERS = {
  users: (item: UserSearchResult) => `/admin/users/${item.id}`,
  feedback: (item: FeedbackSearchResult) => `/admin/feedback/${item.id}`,
  files: (item: FileSearchResult) => `/files/${item.id}`,
  audit: (item: AuditSearchResult) => `/admin/audit/${item.id}`,
} as const;

// Process search results - add URL field to each item
function processSearchResults(response: SearchResponse): SearchResponse {
  return {
    ...response,
    results: {
      users: response.results.users
        ? {
            ...response.results.users,
            items: response.results.users.items.map((item) => ({
              ...item,
              url: CATEGORY_URL_MAPPERS.users(item),
            })),
          }
        : undefined,
      feedback: response.results.feedback
        ? {
            ...response.results.feedback,
            items: response.results.feedback.items.map((item) => ({
              ...item,
              url: CATEGORY_URL_MAPPERS.feedback(item),
            })),
          }
        : undefined,
      files: response.results.files
        ? {
            ...response.results.files,
            items: response.results.files.items.map((item) => ({
              ...item,
              navigationUrl: CATEGORY_URL_MAPPERS.files(item),
            })),
          }
        : undefined,
      audit: response.results.audit
        ? {
            ...response.results.audit,
            items: response.results.audit.items.map((item) => ({
              ...item,
              url: CATEGORY_URL_MAPPERS.audit(item),
            })),
          }
        : undefined,
    },
  };
}

// Single search hook - API returns all categories (or filtered by category)
export function useSearch(
  query: string,
  options?: {
    enabled?: boolean;
    category?: SearchCategory | "all";
    limit?: number;
  }
) {
  const [debouncedQuery] = useDebounce(query, 400);
  const category = options?.category || "all";
  const limit = options?.limit || 5;

  return useQuery({
    queryKey: ["search", debouncedQuery, category, limit],
    queryFn: async () => {
      // API returns all categories by default, or filtered by category
      const response = await apiClient.get<SearchResponse>(
        `/search?q=${encodeURIComponent(debouncedQuery)}&category=${category}&limit=${limit}`
      );

      // Post-process: Add navigation URLs to each result
      return processSearchResults(response);
    },
    enabled: debouncedQuery.length >= 2 && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Load more for specific category
export function useLoadMore(
  query: string,
  category: SearchCategory,
  page: number
) {
  return useQuery({
    queryKey: ["search", category, query, "page", page],
    queryFn: async () => {
      const response = await apiClient.get<SearchResponse>(
        `/search?q=${encodeURIComponent(query)}&category=${category}&page=${page}&limit=10`
      );
      // Post-process pagination results
      return processSearchResults(response);
    },
    enabled: false, // Manual trigger only
    staleTime: 5 * 60 * 1000,
  });
}

// Type for category state management
export interface CategoryState<T> {
  items: T[];
  page: number;
  hasMore: boolean;
  isLoadingMore: boolean;
}

// Helper to get category results safely
export function getCategoryResults<T extends SearchCategory>(
  response: SearchResponse | undefined,
  category: T
): CategoryResults<any> | undefined {
  if (!response) return undefined;
  return response.results[category];
}
