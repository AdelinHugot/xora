import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useContactSearch } from "../hooks/useContactSearch";
import { useDebounce } from "../hooks/useDebounce";

export default function Searchbar({ onNavigate }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef(null);

    // Use debounce to avoid search on every keystroke
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const { results: searchResults, loading, searchContacts } = useContactSearch();

    useEffect(() => {
        if (debouncedSearchTerm) {
            searchContacts(debouncedSearchTerm);
        }
    }, [debouncedSearchTerm, searchContacts]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    const handleSelectContact = (contact) => {
        if (onNavigate) {
            onNavigate(`contact-${contact.id}`);
        }
        setSearchTerm("");
        setIsOpen(false);
    };

    return (
        <div className="p-4 lg:p-6">
            <div className="relative" ref={searchRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                <input
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white/70 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="Rechercher un client (min. 2 caractères)"
                    type="search"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />

                {/* Dropdown with search results */}
                {isOpen && searchTerm.trim() !== "" && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="px-4 py-6 text-center text-sm text-neutral-500">
                                Recherche en cours...
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="py-1">
                                {searchResults.map((contact) => (
                                    <button
                                        key={contact.id}
                                        onClick={() => handleSelectContact(contact)}
                                        className="w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "#E4E4E7" }}>
                                                <span className="text-xs font-semibold text-neutral-600">
                                                    {contact.name?.charAt(0) || "?"}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm text-neutral-900 truncate">
                                                    {contact.name}
                                                </div>
                                                {contact.email && (
                                                    <div className="text-xs text-neutral-500 truncate">
                                                        {contact.email}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="px-4 py-6 text-center text-sm text-neutral-500">
                                {searchTerm.length < 2 ? "Continuez à écrire..." : `Aucun client trouvé pour "${searchTerm}"`}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
