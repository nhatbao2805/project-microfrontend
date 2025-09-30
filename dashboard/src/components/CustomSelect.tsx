import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface CustomSelectProps {
  label?: string;
  options: string[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select option",
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Selected */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex justify-between items-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <span>{value || placeholder}</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <motion.div
            key="ai-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto animate-fadeIn"
          >
            {options.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition transaction-all duration-300  ${
                  value === option ? "bg-blue-100 text-blue-600" : ""
                }`}
              >
                {option}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
