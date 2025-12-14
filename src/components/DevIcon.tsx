import Image from "next/image";

interface DevIconProps {
  name: string;
  text?: string;
  className?: string;
  iconClassName?: string;
}

/**
 * DevIcon component to display a development technology icon with optional text.
 * @param name - Name of the technology (used to fetch the corresponding SVG icon).
 * @param text - Optional text to display alongside the icon.
 * @param className - Optional additional CSS classes for the container.
 * @param iconClassName - Optional additional CSS classes for the icon.
 */
export default function DevIcon({name, text, className, iconClassName}: DevIconProps) {
    if (text) {
        return (
            <div className={`flex items-center space-x-2 ${className ? className : ''}`}>
                <Image src={`/dev/${name}.svg`}
                       alt={`${name} icon`}
                       width={24}
                      height={24}
                      className={`h-6 w-6 ${iconClassName ? iconClassName : ''}`} />
                <span className={"font-semibold text-lg"}>{text}</span>
            </div>
        )
    } else {
        return (
            <Image src={`/dev/${name}.svg`}
                   alt={`${name} icon`}
                   width={24}
                  height={24}
                  className={`h-6 w-6 ${iconClassName ? iconClassName : ''} ${className ? className : ''}`} />
        )
    }
}
