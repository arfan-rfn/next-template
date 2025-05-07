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
    {
      title: "Blog",
      href: "/blog",
    }
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/arfan-rfn/next-template",
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
        {
          name: "Terms and Conditions",
          url: "/terms-conditions",
        },
        {
          name: "Privacy Policy",
          url: "/privacy-policy",
        }
      ],
      "Links": [
        {
          name: "Build by Arfan",
          url: "https://arfanu.com",
        },
        {
          name: "Connecto",
          url: "https://getconnecto.app",
        },
        {
          name: "NextJS Template",
          url: "https://nextjs.arfanu.com",
        }
      ],
    },
  }
}
