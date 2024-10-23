import { env } from "@/env";

type SchemaType = {
	data: {
		name: string;
		description: string;
		relativeUrl: string;
		imageUrl?: string;
		[key: string]: any;
	}
}

export function JsonLd({ data }: SchemaType) {
	const { imageUrl, relativeUrl } = data;
	const baseUrl = env.NEXT_PUBLIC_BASE_URL;
	const fullUrl = `${baseUrl}${relativeUrl}`;
	const jsonLd = {
		"@context": "http://schema.org",
		"@type": "WebPage",
		"url": fullUrl,
		"image": imageUrl,
		...data,
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	);
}