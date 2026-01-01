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
} from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

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
   * Social media links
   * Update the href values with your actual social media URLs
   */
  socialLinks: [
    { href: "/", icon: FaGithub, label: "GitHub" },
    { href: "/", icon: FaLinkedin, label: "LinkedIn" },
    { href: "/", icon: FaGoodreads, label: "GoodReads" },
    { href: "/", icon: FaInstagram, label: "Instagram" },
    { href: "/", icon: FaXTwitter, label: "X" },
    { href: "/", icon: FaReddit, label: "Reddit" },
    { href: "/", icon: FaDribbble, label: "Dribbble" },
    { href: "/", icon: FaYoutube, label: "YouTube" },
    { href: "mailto:contact@example.com", icon: FaEnvelope, label: "Email" },
  ] as Array<{ href: string; icon: IconType; label: string }>,
}
