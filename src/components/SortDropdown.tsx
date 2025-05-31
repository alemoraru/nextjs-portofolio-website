import {useState, useRef, useEffect} from 'react';
import {FaChevronDown} from 'react-icons/fa';

interface SortDropdownProps {
    sortOrder: 'newest' | 'oldest' | 'asc' | 'desc';
    onChange: (order: 'newest' | 'oldest' | 'asc' | 'desc') => void;
    options: { label: string; value: 'newest' | 'oldest' | 'asc' | 'desc' }[];
}

/**
 * SortDropdown component that provides a dropdown for selecting sorting options (e.g., newest, oldest).
 */
export default function SortDropdown({sortOrder, onChange, options}: SortDropdownProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="cursor-pointer flex items-center justify-between border px-4 py-2 rounded bg-white dark:bg-gray-800
                dark:border-gray-600 w-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-gray-200"
            >
                <span>
                    {options.find((option) => option.value === sortOrder)?.label || 'Sort'}
                </span>
                <FaChevronDown className="ml-2 text-sm"/>
            </button>

            <div
                className={
                    "origin-top-right absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg text-sm z-50" +
                    (isDropdownOpen
                        ? " scale-y-100 opacity-100"
                        : " scale-y-0 opacity-0 pointer-events-none")
                }
                style={{transformOrigin: 'top right'}}
            >
                {options.map(({label, value}) => (
                    <button
                        key={value}
                        onClick={() => {
                            onChange(value);
                            setIsDropdownOpen(false);
                        }}
                        className="cursor-pointer block w-full text-left px-4 py-2 hover:bg-gray-100
                        dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}
