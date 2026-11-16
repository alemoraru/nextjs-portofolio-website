import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import React, { useState } from "react"
import { describe, expect, it } from "vitest"
import ImageLightbox, { LightboxImage } from "@/components/ImageLightbox"

const ONE_IMAGE: LightboxImage[] = [{ src: "/a.jpg", alt: "Alpha" }]
const THREE_IMAGES: LightboxImage[] = [
  { src: "/a.jpg", alt: "Alpha" },
  { src: "/b.jpg", alt: "Beta" },
  { src: "/c.jpg", alt: "Gamma" },
]

/** Renders the lightbox with real open/index state and a labelled trigger button. */
function Harness({ images, browsable = true }: { images: LightboxImage[]; browsable?: boolean }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  return (
    <>
      <button type="button">Before</button>
      <ImageLightbox
        images={images}
        index={index}
        onIndexChange={browsable ? setIndex : undefined}
        open={open}
        onOpenChange={setOpen}
        trigger={<button type="button">Expand</button>}
      />
    </>
  )
}

const openLightbox = () => fireEvent.click(screen.getByRole("button", { name: "Expand" }))

describe("ImageLightbox", () => {
  it("is closed until the trigger is pressed", () => {
    render(<Harness images={ONE_IMAGE} />)
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("opens a dialog named after the image and hides the page behind it", () => {
    render(<Harness images={ONE_IMAGE} />)
    expect(screen.getByRole("button", { name: "Before" })).toBeDefined()
    openLightbox()

    expect(screen.getByRole("dialog", { name: "Image preview: Alpha" })).toBeDefined()
    // Radix marks everything outside the dialog aria-hidden, so it drops out of the a11y tree.
    expect(screen.queryByRole("button", { name: "Before" })).toBeNull()
    expect(screen.getByRole("img", { name: "Alpha" })).toBeDefined()
    expect(screen.getByRole("link", { name: "Download image" }).getAttribute("href")).toBe("/a.jpg")
  })

  it("moves focus into the dialog, onto the close button", async () => {
    render(<Harness images={ONE_IMAGE} />)
    openLightbox()

    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Close image preview" })
      )
    )
  })

  it("closes on Escape and returns focus to the trigger", async () => {
    render(<Harness images={ONE_IMAGE} />)
    const trigger = screen.getByRole("button", { name: "Expand" })
    openLightbox()
    await waitFor(() => expect(screen.getByRole("dialog")).toBeDefined())

    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" })

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    expect(document.activeElement).toBe(trigger)
  })

  it("closes from the close button and returns focus to the trigger", async () => {
    render(<Harness images={ONE_IMAGE} />)
    const trigger = screen.getByRole("button", { name: "Expand" })
    openLightbox()

    fireEvent.click(screen.getByRole("button", { name: "Close image preview" }))

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    expect(document.activeElement).toBe(trigger)
  })

  it("closes when the backdrop is clicked, but not when the image is", async () => {
    render(<Harness images={ONE_IMAGE} />)
    openLightbox()

    fireEvent.click(screen.getByRole("img", { name: "Alpha" }))
    expect(screen.getByRole("dialog")).toBeDefined()

    fireEvent.click(screen.getByRole("dialog"))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })

  it("has no browsing controls or description for a single image", () => {
    render(<Harness images={ONE_IMAGE} />)
    openLightbox()

    expect(screen.queryByRole("button", { name: "Next image" })).toBeNull()
    expect(screen.getByRole("dialog").hasAttribute("aria-describedby")).toBe(false)
  })

  it("has no browsing controls when no index handler is given", () => {
    render(<Harness images={THREE_IMAGES} browsable={false} />)
    openLightbox()

    expect(screen.queryByRole("button", { name: "Next image" })).toBeNull()
  })

  describe("with several images", () => {
    it("describes the position and steps with the buttons, wrapping around", () => {
      render(<Harness images={THREE_IMAGES} />)
      openLightbox()

      const dialog = screen.getByRole("dialog")
      expect(dialog.getAttribute("aria-describedby")).toBeTruthy()
      expect(screen.getByText("Image 1 of 3")).toBeDefined()

      fireEvent.click(screen.getByRole("button", { name: "Next image" }))
      expect(screen.getByRole("dialog", { name: "Image preview: Beta" })).toBeDefined()
      expect(screen.getByText("Image 2 of 3")).toBeDefined()

      fireEvent.click(screen.getByRole("button", { name: "Previous image" }))
      fireEvent.click(screen.getByRole("button", { name: "Previous image" }))
      expect(screen.getByRole("img", { name: "Gamma" })).toBeDefined()
    })

    it("steps with the arrow keys", () => {
      render(<Harness images={THREE_IMAGES} />)
      openLightbox()
      const dialog = screen.getByRole("dialog")

      fireEvent.keyDown(dialog, { key: "ArrowRight" })
      expect(screen.getByRole("img", { name: "Beta" })).toBeDefined()

      fireEvent.keyDown(dialog, { key: "ArrowLeft" })
      expect(screen.getByRole("img", { name: "Alpha" })).toBeDefined()
    })

    it("announces position changes politely", () => {
      render(<Harness images={THREE_IMAGES} />)
      openLightbox()
      expect(screen.getByText("Image 1 of 3").getAttribute("aria-live")).toBe("polite")
    })
  })
})
