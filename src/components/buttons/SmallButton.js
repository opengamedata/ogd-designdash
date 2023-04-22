import React from 'react';

/**
 * @param {object}  props 
 * @param {boolean} props.selected
 * @param {React.MouseEventHandler} props.onClick
 * @param {string}  props.label
 * @returns 
 */
export default function SmallButton(props) {
    const { selected, onClick, label } = props;

    const spacing      = "px-2 py-1 mr-2 my-1";
    const border       = "border border-stone-300 shadow-sm rounded-sm";
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