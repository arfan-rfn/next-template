export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Next Template",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
  // Icon must be exist in the component/icons.tsx file
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/arfan-rfn/next-template",
      icon: "GitHub",
    },
  ],
  footer: {
    links: {
      Features: [
        {
          name: "Home",
          url: "/",
        },
      ],
      Resources: [
        {
          name: "FAQ",
          url: "/",
        },
      ],
      About: [
        {
          name: "Contact",
          url: "/",
        },
      ],
    },
  }
}
