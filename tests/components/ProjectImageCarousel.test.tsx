import { render, screen, fireEvent } from "@testing-library/react"
import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import ProjectImageCarousel from "@/components/ProjectImageCarousel"

// Embla mock-related functions and state
const mockScrollPrev = vi.fn()
const mockScrollNext = vi.fn()
const mockScrollTo = vi.fn()
const mockSelectedScrollSnap = vi.fn(() => 0)
const mockOn = vi.fn()
const mockOff = vi.fn()

const mockApi = {
  scrollPrev: mockScrollPrev,
  scrollNext: mockScrollNext,
  scrollTo: mockScrollTo,
  selectedScrollSnap: mockSelectedScrollSnap,
  canScrollPrev: vi.fn(() => false),
  canScrollNext: vi.fn(() => false),
  on: mockOn,
  off: mockOff,
}

vi.mock("embla-carousel-react", () => ({
  default: () => [vi.fn(), mockApi],
}))

// Fixture data
const ONE_IMAGE = [{ src: "/a.jpg", alt: "Alpha" }]
const TWO_IMAGES = [
  { src: "/a.jpg", alt: "Alpha" },
  { src: "/b.jpg", alt: "Beta" },
]
const EIGHT_IMAGES = Array.from({ length: 8 }, (_, i) => ({
  src: `/img${i + 1}.jpg`,
  alt: `Image ${i + 1}`,
}))
const NINE_IMAGES = Array.from({ length: 9 }, (_, i) => ({
  src: `/img${i + 1}.jpg`,
  alt: `Image ${i + 1}`,
}))

describe("ProjectImageCarousel", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSelectedScrollSnap.mockReturnValue(0)
  })

  it("renders nothing when the images array is empty", () => {
    const { container } = render(<ProjectImageCarousel images={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it("renders all images with their alt text", () => {
    render(<ProjectImageCarousel images={TWO_IMAGES} />)
    expect(screen.getByAltText("Alpha")).toBeDefined()
    expect(screen.getByAltText("Beta")).toBeDefined()
  })

  it("does not render navigation controls for a single image", () => {
    render(<ProjectImageCarousel images={ONE_IMAGE} />)
    expect(screen.queryByLabelText("Previous slide")).toBeNull()
    expect(screen.queryByLabelText("Next slide")).toBeNull()
  })

  it("renders prev/next buttons when there are multiple images", () => {
    render(<ProjectImageCarousel images={TWO_IMAGES} />)
    expect(screen.getByLabelText("Previous slide")).toBeDefined()
    expect(screen.getByLabelText("Next slide")).toBeDefined()
  })

  it("calls scrollPrev when the previous button is clicked", () => {
    render(<ProjectImageCarousel images={TWO_IMAGES} />)
    fireEvent.click(screen.getByLabelText("Previous slide"))
    expect(mockScrollPrev).toHaveBeenCalledOnce()
  })

  it("calls scrollNext when the next button is clicked", () => {
    render(<ProjectImageCarousel images={TWO_IMAGES} />)
    fireEvent.click(screen.getByLabelText("Next slide"))
    expect(mockScrollNext).toHaveBeenCalledOnce()
  })

  describe("pill indicators (≤ 8 images)", () => {
    it("renders one pill per image", () => {
      render(<ProjectImageCarousel images={EIGHT_IMAGES} />)
      EIGHT_IMAGES.forEach((_, i) => {
        expect(screen.getByLabelText(`Go to slide ${i + 1}`)).toBeDefined()
      })
    })

    it("calls scrollTo with the correct index when a pill is clicked", () => {
      render(<ProjectImageCarousel images={TWO_IMAGES} />)
      fireEvent.click(screen.getByLabelText("Go to slide 2"))
      expect(mockScrollTo).toHaveBeenCalledWith(1)
    })
  })

  describe("numeric counter (> 8 images)", () => {
    it("shows a counter instead of pills", () => {
      render(<ProjectImageCarousel images={NINE_IMAGES} />)
      expect(screen.queryByLabelText("Go to slide 1")).toBeNull()
      expect(screen.getByText(/1 \/ 9/)).toBeDefined()
    })
  })
})
