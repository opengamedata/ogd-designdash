import React from 'react';

export default function LongButton({ selected, onClick, label }) {
    const spacing      = "w-full px-2 py-1 mr-2 my-1";
    const border       = "border border-stone-300 rounded-sm shadow-sm";
    const font         = "font-medium text-sm";
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