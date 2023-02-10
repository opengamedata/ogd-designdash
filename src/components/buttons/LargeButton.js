import React from 'react';

export default function LargeButton({ selected, onClick, label }) {
    const spacing      = "px-7 py-2 my-3";
    const border       = "border border-slate-800 rounded-md";
    const font         = "font-medium text-xl text-sm";
    const color        = selected ? 'text-yellow-300 bg-slate-800' : 'bg-white';
    const animation    = "transition-colors ease-in-out duration-300";
    const interactions = "hover:text-yellow-300 hover:bg-slate-800";
    const styling = `${spacing} ${border} ${font} ${color} ${interactions} ${animation}`

    return (
        <button className={styling} onClick={onClick}>
            {label}
        </button>
    )
}