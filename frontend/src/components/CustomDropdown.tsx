import { useState, useRef, useEffect } from "react";

type CustomDropdownProps = {
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
    placeholder?: string;
};

export default function CustomDropdown({ options, selected, onSelect, placeholder = "Bitte Watchlist Typ wählen!" }: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className={"modal-dropdown"}>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className={"modal-dropdown"}>
                {selected || <span style={{ color: "gray" }}>{placeholder}</span>}
            </button>

            {isOpen && (
                <ul className={"modal-dropdown"}>
                    {options.map((opt) => (
                        <li className={"modal-dropdown"} key={opt}
                            onClick={() => {
                                onSelect(opt);
                                setIsOpen(false);
                            }}>
                            {opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}