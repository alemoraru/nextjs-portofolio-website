"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface ImageCarouselProps {
  imageDir: string; // relative to /public
  imageNames: string[]; // list of image filenames in the directory
  altPrefix?: string;
}

const FIXED_WIDTH = 640; // px
const FIXED_HEIGHT = 384; // px (16:9 ratio)

const ImageCarousel: React.FC<ImageCarouselProps> = ({ imageDir, imageNames, altPrefix = 'Project image' }) => {
  const [current, setCurrent] = useState(0);
  const total = imageNames.length;

  if (total === 0) return null;

  const goPrev = () => setCurrent((prev) => (prev - 1 + total) % total);
  const goNext = () => setCurrent((prev) => (prev + 1) % total);

  return (
    <div className="w-full flex flex-col items-center mb-8">
      <div
        className="relative flex items-center justify-center"
        style={{ width: FIXED_WIDTH, height: FIXED_HEIGHT, maxWidth: '100%' }}
      >
        {/* Left Arrow */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 rounded-full p-2 shadow hover:bg-blue-100 dark:hover:bg-blue-900 transition z-10"
          onClick={goPrev}
          aria-label="Previous image"
          disabled={total <= 1}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        {/* Image */}
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
          <Image
            src={`/${imageDir}/${imageNames[current]}`}
            alt={`${altPrefix} ${current + 1}`}
            width={FIXED_WIDTH}
            height={FIXED_HEIGHT}
            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
            className="select-none"
            priority
          />
        </div>
        {/* Right Arrow */}
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 rounded-full p-2 shadow hover:bg-blue-100 dark:hover:bg-blue-900 transition z-10"
          onClick={goNext}
          aria-label="Next image"
          disabled={total <= 1}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
      {/* Circles */}
      <div className="flex gap-2 mt-4">
        {imageNames.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full border-2 ${idx === current ? 'bg-blue-500 border-blue-500' : 'bg-gray-300 dark:bg-gray-700 border-gray-400 dark:border-gray-600'}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
