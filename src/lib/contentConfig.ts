import { IconType } from "react-icons"
import {
  FaMapMarkerAlt,
  FaBook,
  FaLanguage,
  FaGamepad,
  FaUniversity,
  FaSkiing,
  FaBuilding,
  FaTools,
  FaGithub,
  FaLinkedin,
  FaGoodreads,
  FaEnvelope,
  FaInstagram,
  FaReddit,
  FaDribbble,
  FaYoutube,
  FaStackOverflow,
} from "react-icons/fa"
import { FaBluesky, FaXTwitter } from "react-icons/fa6"

/**
 * Configuration for the home page intro section
 */
export const homeIntroConfig = {
  /**
   * Your name (displayed in the heading)
   */
  name: "John Doe",

  /**
   * Introduction paragraphs (can be multiple)
   */
  introParagraphs: [
    "I'm a software engineer passionate about solving problems, building things, and reading sci-fi. Whenever I'm not coding, you can find me exploring the world, playing tennis or skating. I love to share my knowledge and experiences through my blog, where I write about tech, books, and life lessons.",
    "I am currently working at Hypernova Labs as a software engineer, where I focus on building scalable applications and improving user experiences. I have a keen interest in full-stack development, particularly in React and Node.js. I enjoy collaborating with cross-functional teams to deliver high-quality software solutions.",
  ],

  /**
   * Quick facts displayed as chips
   * Each fact has an icon and a label
   */
  quickFacts: [
    { icon: FaBuilding, label: "Hypernova Labs" },
    { icon: FaUniversity, label: "Computer Science Grad @ VuA" },
    { icon: FaMapMarkerAlt, label: "Lille, France" },
    { icon: FaBook, label: "Book Reviewer" },
    { icon: FaLanguage, label: "EN / ES / DE" },
    { icon: FaTools, label: "Full-Stack Dev" },
    { icon: FaGamepad, label: "Sci-fi Fan" },
    { icon: FaSkiing, label: "Skiing Enthusiast" },
  ] as Array<{ icon: IconType; label: string }>,
}

/**
 * Configuration for the footer
 */
export const footerConfig = {
  /**
   * Name displayed in the copyright notice
   */
  copyrightName: "John Doe",

  /**
   * Show version and attribution section
   * Set to true if you want to hide the "built by @alemoraru" attribution and version number.
   * By default, this is true to give credit to the template creator, but you can disable it if desired.
   */
  showVersionAndAttribution: false,

  /**
   * Social media links
   * Simply add your URLs below. Leave empty ("") to hide a social link.
   */
  socialLinks: {
    github: "/",
    linkedin: "/",
    goodreads: "/",
    instagram: "/",
    twitter: "/",
    reddit: "/",
    dribbble: "/",
    youtube: "/",
    bluesky: "/",
    stackoverflow: "/",
    email: "contact@example.com",
  },
}

/**
 * Internal mapping of social platforms to their icons and labels
 * This is used internally by the Footer component - users don't need to modify this
 */
export const socialIconMap: Record<
  keyof typeof footerConfig.socialLinks,
  { icon: IconType; label: string }
> = {
  github: { icon: FaGithub, label: "GitHub" },
  linkedin: { icon: FaLinkedin, label: "LinkedIn" },
  goodreads: { icon: FaGoodreads, label: "GoodReads" },
  instagram: { icon: FaInstagram, label: "Instagram" },
  twitter: { icon: FaXTwitter, label: "X" },
  reddit: { icon: FaReddit, label: "Reddit" },
  dribbble: { icon: FaDribbble, label: "Dribbble" },
  youtube: { icon: FaYoutube, label: "YouTube" },
  bluesky: { icon: FaBluesky, label: "Bluesky" },
  stackoverflow: { icon: FaStackOverflow, label: "Stack Overflow" },
  email: { icon: FaEnvelope, label: "Email" },
}
