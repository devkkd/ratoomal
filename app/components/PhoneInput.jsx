"use client";
import { useState, useRef, useEffect } from "react";

const COUNTRY_CODES = [
  { code: "+91",  flag: "🇮🇳", name: "India" },
  { code: "+1",   flag: "🇺🇸", name: "USA" },
  { code: "+44",  flag: "🇬🇧", name: "UK" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+61",  flag: "🇦🇺", name: "Australia" },
  { code: "+49",  flag: "🇩🇪", name: "Germany" },
  { code: "+33",  flag: "🇫🇷", name: "France" },
  { code: "+81",  flag: "🇯🇵", name: "Japan" },
  { code: "+65",  flag: "🇸🇬", name: "Singapore" },
  { code: "+60",  flag: "🇲🇾", name: "Malaysia" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "+27",  flag: "🇿🇦", name: "South Africa" },
  { code: "+55",  flag: "🇧🇷", name: "Brazil" },
  { code: "+52",  flag: "🇲🇽", name: "Mexico" },
  { code: "+86",  flag: "🇨🇳", name: "China" },
  { code: "+82",  flag: "🇰🇷", name: "South Korea" },
  { code: "+31",  flag: "🇳🇱", name: "Netherlands" },
  { code: "+39",  flag: "🇮🇹", name: "Italy" },
  { code: "+34",  flag: "🇪🇸", name: "Spain" },
  { code: "+7",   flag: "🇷🇺", name: "Russia" },
  { code: "+90",  flag: "🇹🇷", name: "Turkey" },
  { code: "+92",  flag: "🇵🇰", name: "Pakistan" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+94",  flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+977", flag: "🇳🇵", name: "Nepal" },
  { code: "+1",   flag: "🇨🇦", name: "Canada" },
];

/**
 * PhoneInput — country code dropdown + number input
 *
 * Props:
 *   value       string  — full value like "+91 9876543210"
 *   onChange    fn(fullValue: string) — called with combined value
 *   name        string  — input name attribute
 *   placeholder string
 *   required    bool
 *   error       bool    — show red border on error
 *   className   string  — extra classes for the wrapper
 *   inputClass  string  — extra classes for the text input
 */
export default function PhoneInput({
  value = "",
  onChange,
  name = "phone",
  placeholder = "Enter phone number",
  required = false,
  error = false,
  className = "",
  inputClass = "",
}) {
  // Split stored value into countryCode + number
  const parseValue = (v) => {
    if (!v) return { countryCode: "+91", number: "" };
    const match = v.match(/^(\+\d{1,4})\s*(.*)/);
    if (match) return { countryCode: match[1], number: match[2] };
    return { countryCode: "+91", number: v };
  };

  const parsed = parseValue(value);
  const [countryCode, setCountryCode] = useState(parsed.countryCode);
  const [number, setNumber] = useState(parsed.number);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  // Sync external value changes
  useEffect(() => {
    const p = parseValue(value);
    setCountryCode(p.countryCode);
    setNumber(p.number);
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const emit = (code, num) => {
    onChange?.(`${code} ${num}`.trim());
  };

  const handleCodeSelect = (code) => {
    setCountryCode(code);
    setOpen(false);
    setSearch("");
    emit(code, number);
  };

  const handleNumberChange = (e) => {
    const num = e.target.value.replace(/[^\d\s\-()]/g, "");
    setNumber(num);
    emit(countryCode, num);
  };

  const filtered = COUNTRY_CODES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search)
  );

  const selected = COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

  return (
    <div className={`flex items-stretch ${className}`} ref={dropdownRef}>
      {/* Country code button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`h-full flex items-center gap-1.5 px-3 border border-r-0 rounded-l-lg bg-white hover:bg-gray-50 transition-colors text-sm whitespace-nowrap ${
            error ? "border-red-500" : "border-gray-200"
          }`}
        >
          <span className="text-base">{selected.flag}</span>
          <span className="text-gray-700 font-medium">{selected.code}</span>
          <svg className={`w-3 h-3 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute top-full left-0 z-50 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
            {/* Search */}
            <div className="p-2 border-b border-gray-100">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country..."
                className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#C08237]"
                autoFocus
              />
            </div>
            {/* List */}
            <div className="max-h-48 overflow-y-auto scrollbar-hide">
              {filtered.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleCodeSelect(c.code)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#FFF8F0] transition-colors text-left ${
                    c.code === countryCode ? "bg-[#FFF8F0] text-[#C08237] font-medium" : "text-gray-700"
                  }`}
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-gray-400 text-xs">{c.code}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-xs text-gray-400 py-4">No results</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Number input */}
      <input
        type="tel"
        name={name}
        value={number}
        onChange={handleNumberChange}
        placeholder={placeholder}
        required={required}
        className={`flex-1 px-4 py-3 border rounded-r-lg bg-white focus:outline-none focus:ring-1 text-sm ${
          error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-gray-200 focus:ring-[#C08237] focus:border-[#C08237]"
        } ${inputClass}`}
      />
    </div>
  );
}
