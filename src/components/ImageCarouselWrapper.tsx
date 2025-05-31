import ImageCarousel from "./ImageCarousel";
import React from "react";
import path from "path";
import fs from "fs";

interface Props {
    imageDir: string; // relative to /public
    altPrefix?: string;
}

function getImageNamesFromDir(imageDir: string): string[] {
    // Only allow jpg, jpeg, png, webp, gif
    const exts = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    try {
        const dirPath = path.join(process.cwd(), "public", imageDir);
        return fs.readdirSync(dirPath).filter(f => exts.includes(path.extname(f).toLowerCase()));
    } catch {
        return [];
    }
}

export default function ImageCarouselWrapper({imageDir, altPrefix}: Props) {
    const imageNames = getImageNamesFromDir(imageDir);
    if (!imageNames.length) return null;
    return <ImageCarousel imageDir={imageDir} imageNames={imageNames} altPrefix={altPrefix}/>;
}
