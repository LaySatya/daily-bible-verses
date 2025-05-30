import React from 'react';

export default function BookSelect({ options, value, onChange, label }) {
    // Default options if none are provided
    const defaultOptions = [
        { value: "", label: "All" }, // "All" in Khmer
        { value: "Genesis", label: "លោកុប្បត្តិ" },
        { value: "Exodus", label: "និក្ខមនំ" },
        // Add more Bible books here as needed
    ];

    // Use provided options or default ones
    const selectOptions = options && options.length > 0 ? options : defaultOptions;

    return(
        // The label acts as the container, applying the focus styles
        // w-full ensures it takes full width of its parent (the drawer)
        <label className="select select-bordered bg-slate-600 text-white w-full rounded-lg
                          focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-300 focus-within:border-transparent">
            {/* The span for the label text */}
            <span className="label-text text-slate-400 mb-1 w-16 block">Book</span> {/* Added block and margin for spacing */}

            {/* The actual select dropdown */}
            <select
                className="bg-transparent outline-none border-none text-white w-full" // Ensure transparency and remove default borders
                value={value} // Controlled component: current value
                onChange={onChange} // Controlled component: handle change
            >
                {selectOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}