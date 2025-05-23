"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { useRouter } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"

export function MobileNav() {
	const [open, setOpen] = React.useState(false)

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					size="icon"
					variant="ghost"
					className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
				>
					<Icons.Menu className="size-5" />
					<span className="sr-only">Toggle Menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="pr-0">
			<SheetTitle className="sr-only">Navigation Menu</SheetTitle>
				<MobileLink
					href="/"
					className="flex items-center"
					onOpenChange={setOpen}
				>
					<Icons.Logo className="mr-2 size-4" />
					<span className="font-bold">{siteConfig.name}</span>
				</MobileLink>
				<ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
					<div className="flex flex-col space-y-3">
						{siteConfig.mainNav?.map(
							(item) =>
								item.href && (
									<MobileLink
										key={item.href}
										href={item.href}
										onOpenChange={setOpen}
									>
										{item.title}
									</MobileLink>
								)
						)}
					</div>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	)
}

interface MobileLinkProps extends LinkProps {
	onOpenChange?: (open: boolean) => void
	children: React.ReactNode
	className?: string
}

function MobileLink({
	href,
	onOpenChange,
	className,
	children,
	...props
}: MobileLinkProps) {
	const router = useRouter()
	return (
		<Link
			href={href}
			onClick={() => {
				router.push(href.toString())
				onOpenChange?.(false)
			}}
			className={cn(className)}
			{...props}
		>
			{children}
		</Link>
	)
}