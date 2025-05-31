import ImageCarousel from "./ImageCarousel";
import React from "react";
import path from "path";
import fs from "fs";

/**
 * Props for the ImageCarouselWrapper component.
 */
interface Props {
    imageDir: string; // relative to /public
    altPrefix?: string;
}

/**
 * Utility function to get image names from a directory.
 * @param imageDir the directory where images are stored, relative to the public folder
 */
function getImageNamesFromDir(imageDir: string): string[] {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    try {
        const dirPath = path.join(process.cwd(), "public", imageDir);
        return fs.readdirSync(dirPath).filter(f => allowedExtensions.includes(path.extname(f).toLowerCase()));
    } catch {
        return [];
    }
}

/**
 * ImageCarouselWrapper component that wraps the ImageCarousel component.
 */
export default function ImageCarouselWrapper({imageDir, altPrefix}: Props) {
    const imageNames = getImageNamesFromDir(imageDir);
    if (!imageNames.length) return null;
    return <ImageCarousel imageDir={imageDir} imageNames={imageNames} altPrefix={altPrefix}/>;
}
