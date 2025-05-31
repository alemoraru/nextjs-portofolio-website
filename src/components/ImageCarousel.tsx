'use client';

import React, {useState} from 'react';
import Image from 'next/image';
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';

/**
 * Props for the ImageCarousel component.
 */
interface ImageCarouselProps {
    imageDir: string;
    imageNames: string[];
    altPrefix?: string;
}

/**
 * ImageCarousel component that displays a carousel of images with navigation arrows and dots.
 * @param imageDir the directory where images are stored, relative to the public folder
 * @param imageNames an array of image file names to display in the carousel
 * @param altPrefix optional prefix for the alt text of images, defaults to 'Project image'
 */
const ImageCarousel: React.FC<ImageCarouselProps> = (
    {
        imageDir,
        imageNames,
        altPrefix = 'Project image',
    }) => {
    const [current, setCurrent] = useState(0);
    const total = imageNames.length;

    if (total === 0) return null;

    // Navigation functions (circular navigation)
    const goPrev = () => setCurrent((prev) => (prev - 1 + total) % total);
    const goNext = () => setCurrent((prev) => (prev + 1) % total);

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center mb-8">
            {/* Image container with arrows */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                {/* Left Arrow */}
                <button
                    onClick={goPrev}
                    disabled={total <= 1}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-gray-900/70
                    hover:bg-blue-100 dark:hover:bg-blue-900 p-2 rounded-full text-xl text-gray-800 dark:text-gray-100
                    shadow transition cursor-pointer z-10"
                    aria-label="Previous image"
                >
                    <FaChevronLeft/>
                </button>

                {/* Image */}
                <Image
                    src={`/${imageDir}/${imageNames[current]}`}
                    alt={`${altPrefix} ${current + 1}`}
                    fill
                    className="object-contain select-none"
                    priority
                />

                {/* Right Arrow */}
                <button
                    onClick={goNext}
                    disabled={total <= 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-gray-900/70
                    hover:bg-blue-100 dark:hover:bg-blue-900 p-2 rounded-full text-xl text-gray-800
                    dark:text-gray-100 shadow transition cursor-pointer z-10"
                    aria-label="Next image"
                >
                    <FaChevronRight/>
                </button>
            </div>

            {/* Navigation dots */}
            <div className="flex gap-2 mt-4">
                {imageNames.map((_, idx) => (
                    <button
                        key={idx}
                        className={`w-3 h-3 rounded-full border-2 transition
                        ${idx === current
                            ? 'bg-blue-500 border-blue-500'
                            : 'bg-gray-300 dark:bg-gray-600 border-gray-400 dark:border-gray-700'}
                        `}
                        onClick={() => setCurrent(idx)}
                        aria-label={`Go to image ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;
