'use client';

import ImageCarousel from "./ImageCarousel";
import React from "react";

/**
 * Wrapper component for ImageCarousel to allow passing props directly.
 */
export default function ImageCarouselWrapper(props: React.ComponentProps<typeof ImageCarousel>) {
    return <ImageCarousel {...props} />;
}
