"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertDialogProps } from "@radix-ui/react-alert-dialog"
import { useTheme } from "next-themes"
import { Icons } from "./icons"

import { cn } from "@/lib/utils"
import { searchSuggestion } from "@/config/search-suggestion"

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "./ui/command"
import { Button } from "./ui/button"
import { Kbd, KbdGroup } from "./ui/kbd"

export function Search({ ...props }: AlertDialogProps) {
	const router = useRouter()
	const [open, setOpen] = React.useState(false)
	const { setTheme } = useTheme()
	const [isMac, setIsMac] = React.useState(false)

	React.useEffect(() => {
		// Detect OS
		setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform))
	}, [])

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
				if (
					(e.target instanceof HTMLElement && e.target.isContentEditable) ||
					e.target instanceof HTMLInputElement ||
					e.target instanceof HTMLTextAreaElement ||
					e.target instanceof HTMLSelectElement
				) {
					return
				}

				e.preventDefault()
				setOpen((open) => !open)
			}
		}

		document.addEventListener("keydown", down)
		return () => document.removeEventListener("keydown", down)
	}, [])

	const runCommand = React.useCallback((command: () => unknown) => {
		setOpen(false)
		command()
	}, [])

	return (
		<>
			<Button
				variant="outline"
				className={cn(
					"relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
				)}
				onClick={() => setOpen(true)}
				{...props}
			>
				<Icons.Search className="mr-2 size-4" />
				<span className="inline-flex">Search...</span>
				<KbdGroup className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden sm:inline-flex">
					<Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
					<Kbd>K</Kbd>
				</KbdGroup>
			</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>

					{searchSuggestion.map((group) => (
						<CommandGroup key={group.title} heading={group.title}>
							{group.items && group.items.map((navItem) => (
								<CommandItem
									key={navItem.href}
									value={navItem.title}
									onSelect={() => {
										runCommand(() => router.push(navItem.href as string))
									}}
								>
									<div className="mr-2 flex size-4 items-center justify-center">
										<Icons.Circle className="size-3" />
									</div>
									{navItem.title}
								</CommandItem>
							))}
						</CommandGroup>
					))}
					<CommandSeparator />
					<CommandGroup heading="Theme">
						<CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
							<Icons.Sun className="mr-2 size-4" />
							Light
						</CommandItem>
						<CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
							<Icons.Moon className="mr-2 size-4" />
							Dark
						</CommandItem>
						<CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
							<Icons.System className="mr-2 size-4" />
							System
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	)
}