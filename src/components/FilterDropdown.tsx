import {useState, useRef, useEffect} from 'react';
import {FaChevronDown, FaBroom, FaCheck} from 'react-icons/fa';

interface FilterDropdownProps {
    items: { name: string; count: number }[];
    selectedItems: string[];
    onToggle: (item: string) => void;
    onApply: () => void;
    onClear: () => void;
    placeholder: string;
    resultCount: number;
}

/**
 * FilterDropdown component that provides a dropdown for filtering items.
 * It allows users to select multiple items and apply or clear the filters.
 */
export default function FilterDropdown(
    {
        items,
        selectedItems,
        onToggle,
        onApply,
        onClear,
        placeholder,
        resultCount,
    }: FilterDropdownProps) {

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

    // Close the dropdown when filters are applied
    const handleApply = () => {
        onApply();
        setIsDropdownOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="cursor-pointer flex items-center justify-between border px-4 py-2 rounded bg-white dark:bg-gray-800
                dark:border-gray-600 w-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 relative"
            >
                <span className="truncate">
                    {selectedItems.length === 0 ? placeholder : `${selectedItems.length} Selected`}
                </span>
                <FaChevronDown className="ml-2 text-sm"/>
                {resultCount > 0 && (
                    <span
                        className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white
                        text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                        title={`${resultCount} results`}
                    >
                        {resultCount}
                    </span>
                )}
            </button>

            <div
                className={
                    "origin-top transition-all duration-200 ease-out transform absolute z-10 mt-2 w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg p-4 space-y-3" +
                    (isDropdownOpen
                        ? " scale-y-100 opacity-100"
                        : " scale-y-0 opacity-0 pointer-events-none")
                }
                style={{transformOrigin: 'top'}}
            >
                <div className="max-h-48 overflow-y-auto">
                    {items.map(({name, count}) => (
                        <label
                            key={name}
                            className="flex items-center space-x-3 cursor-pointer group py-1"
                        >
                            <span className="relative inline-block w-5 h-5">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(name)}
                                    onChange={() => onToggle(name)}
                                    className="peer absolute opacity-0 w-full h-full z-10 cursor-pointer"
                                />
                                <span
                                    className="block w-full h-full rounded border border-gray-400 dark:border-gray-500 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition duration-200"
                                ></span>
                                <FaCheck
                                    className="absolute top-0 left-0 w-full h-full p-1 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                />
                            </span>
                            <span
                                className="text-gray-800 dark:text-gray-200 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition"
                            >
                                {name} <span className="text-gray-500">({count})</span>
                            </span>
                        </label>
                    ))}
                </div>
                <div className="flex justify-between items-center pt-2">
                    <button
                        onClick={handleApply}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm cursor-pointer"
                    >
                        Apply
                    </button>
                    <button
                        onClick={onClear}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 cursor-pointer"
                        title="Clear filters"
                    >
                        <FaBroom className="mr-1"/>
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}
