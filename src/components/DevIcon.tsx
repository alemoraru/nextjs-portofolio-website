"use client"

import Image from "next/image"
import { useState } from "react"
import { FiCpu } from "react-icons/fi"

interface DevIconProps {
  name: string
  text?: string
  className?: string
  iconClassName?: string
}

/**
 * DevIcon component to display a development technology icon with optional text.
 * If the SVG at `/dev/{name}.svg` fails to load, it falls back to rendering the FiCpu icon.
 * @param name - Name of the technology (used to fetch the corresponding SVG icon).
 * @param text - Optional text to display alongside the icon.
 * @param className - Optional additional CSS classes for the container.
 * @param iconClassName - Optional additional CSS classes for the icon.
 */
export default function DevIcon({ name, text, className, iconClassName }: DevIconProps) {
  const [imgError, setImgError] = useState(false)

  // If the image failed to load, show the CPU icon instead (with same sizing classes)
  if (imgError) {
    if (text) {
      return (
        <div className={`flex items-center space-x-2 ${className ? className : ""}`}>
          <FiCpu className={`h-6 w-6 ${iconClassName ? iconClassName : ""}`} />
          <span className={"font-semibold text-lg"}>{text}</span>
        </div>
      )
    }

    return (
      <FiCpu
        className={`h-6 w-6 ${iconClassName ? iconClassName : ""} ${className ? className : ""}`}
      />
    )
  }

  // Attempt to load the image from the public/dev folder. If it errors, onError will set imgError.
  if (text) {
    return (
      <div className={`flex items-center space-x-2 ${className ? className : ""}`}>
        <Image
          src={`/dev/${name}.svg`}
          alt={`${name} icon`}
          width={24}
          height={24}
          className={`h-6 w-6 ${iconClassName ? iconClassName : ""}`}
          onError={() => setImgError(true)}
        />
        <span className={"font-semibold text-lg"}>{text}</span>
      </div>
    )
  } else {
    return (
      <Image
        src={`/dev/${name}.svg`}
        alt={`${name} icon`}
        width={24}
        height={24}
        className={`h-6 w-6 ${iconClassName ? iconClassName : ""} ${className ? className : ""}`}
        onError={() => setImgError(true)}
      />
    )
  }
}
