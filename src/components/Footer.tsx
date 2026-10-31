import Link from "next/link"
import { FaCodeBranch } from "react-icons/fa"
import { footerConfig, socialIconMap } from "@/data/content"
import { appVersion } from "@/lib/constants"
import { SocialPlatform } from "@/lib/types"
import { cn } from "@/lib/utils"

/**
 * The social links to display, ready to render as `{ icon, label, href }` objects.
 *
 * `footerConfig.socialLinks` only holds each platform's URL, while its icon and label live in
 * `socialIconMap`, so this list combines the two:
 * 1. Takes the configured `[platform, url]` pairs, keeping their order so that reordering the
 *    config also reorders the footer. The cast is needed because `Object.entries` types keys as
 *    plain strings.
 * 2. Drops platforms whose URL is empty or blank, which is how a link is hidden.
 * 3. Merges each platform's icon and label with its final `href`.
 */
const socialLinks = (Object.entries(footerConfig.socialLinks) as [SocialPlatform, string][])
  .filter(([, url]) => url?.trim())
  .map(([platform, url]) => ({
    ...socialIconMap[platform],
    // Add mailto: prefix for email if not already present
    href: platform === SocialPlatform.Email && !url.startsWith("mailto:") ? `mailto:${url}` : url,
  }))

/**
 * Internal component to render social media links
 */
function SocialLinks() {
  return (
    <>
      {socialLinks.map(({ icon: Icon, label, href }) => (
        <Link
          key={label}
          href={href}
          aria-label={label}
          target={href.startsWith("mailto") ? "_blank" : undefined}
          className={cn(
            "flex items-center justify-center size-11 rounded-lg",
            "text-gray-600 dark:text-gray-400",
            "hover:bg-gray-200 dark:hover:bg-gray-800",
            "hover:text-accent-600 dark:hover:text-accent-400",
            "transition-colors duration-200",
            "active:scale-95",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
            "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black"
          )}
        >
          <Icon className="size-[24px] md:size-[22px]" />
        </Link>
      ))}
    </>
  )
}

/**
 * Site-wide footer, rendered from `footerConfig`. It shows the owner's name, the copyright notice
 * and the social links, in a row on desktop and centered and stacked on phones. Below them, a
 * status strip shows the app version and attribution, unless `showVersionAndAttribution` is off.
 */
export default function Footer() {
  return (
    <footer className="mt-6" id="footerPortfolio">
      <div className="border-t border-gray-100 dark:border-transparent bg-zinc-50 dark:bg-zinc-950">
        {/* Name, Copyright & Social Links */}
        <div
          className={cn(
            "max-w-4xl mx-auto w-full px-5 py-6",
            "flex flex-col items-center md:flex-row md:justify-between gap-4"
          )}
        >
          <div className="text-center md:text-left">
            <p className="text-lg font-bold text-black dark:text-white">
              {footerConfig.copyrightName}
            </p>
            <p className="text-[13px] mt-0.5 text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          <div className="max-w-72 flex flex-wrap justify-center md:max-w-none md:-mr-2 md:flex-nowrap md:gap-0.5">
            <SocialLinks />
          </div>
        </div>
      </div>

      {/* Version & Attribution - Terminal style status strip, one quiet step from the band above */}
      {footerConfig.showVersionAndAttribution && (
        <div
          className={cn(
            "py-2 bg-zinc-100 dark:bg-[#050506]",
            "text-xs font-mono text-gray-500 dark:text-gray-400"
          )}
        >
          <div className="max-w-4xl mx-auto w-full px-5 flex items-center justify-between gap-4">
            <Link
              href={`https://github.com/alemoraru/nextjs-portofolio-website/releases/tag/v${appVersion}`}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:underline"
            >
              <FaCodeBranch className="w-3 h-3" />
              <span className="font-semibold text-accent-600 dark:text-accent-400">
                {appVersion}
              </span>
            </Link>

            <span>
              built by{" "}
              <Link
                href="https://github.com/alemoraru"
                rel="noopener noreferrer"
                className="font-semibold hover:text-accent-500 dark:hover:text-accent-400 transition-colors duration-200"
              >
                @alemoraru
              </Link>
            </span>
          </div>
        </div>
      )}
    </footer>
  )
}
