import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Footer from "@/components/Footer"
import { footerConfig } from "@/data/content"
import { appVersion } from "@/lib/constants"

describe("Footer", () => {
  it("renders the footer element with the correct id", () => {
    render(<Footer />)
    const footer = document.getElementById("footerPortfolio")
    expect(footer).not.toBeNull()
    expect(footer?.tagName).toBe("FOOTER")
  })

  it("renders the copyright text with the current year", () => {
    render(<Footer />)
    const year = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`© ${year}`))).toBeDefined()
  })

  it("renders the copyright name", () => {
    render(<Footer />)
    expect(screen.getByText(new RegExp(footerConfig.copyrightName))).toBeDefined()
  })

  it("renders social links with correct aria-labels", () => {
    render(<Footer />)
    expect(screen.getByLabelText("GitHub")).toBeDefined()
    expect(screen.getByLabelText("LinkedIn")).toBeDefined()
    expect(screen.getByLabelText("Email")).toBeDefined()
  })

  it("renders the email link with a mailto: prefix", () => {
    render(<Footer />)
    const emailLink = screen.getByLabelText("Email")
    const expectedEmail = footerConfig.socialLinks.email.startsWith("mailto:")
      ? footerConfig.socialLinks.email
      : `mailto:${footerConfig.socialLinks.email}`
    expect(emailLink.getAttribute("href")).toBe(expectedEmail)
  })

  it("renders the version number", () => {
    render(<Footer />)
    expect(screen.getByText(appVersion)).toBeDefined()
  })

  it("renders social links as anchor elements", () => {
    render(<Footer />)
    const githubLink = screen.getByLabelText("GitHub")
    expect(githubLink.tagName).toBe("A")
  })
})
