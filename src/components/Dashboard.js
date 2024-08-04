// global imports
import React, { useState } from 'react';
// local imports
import LargeButton from '../components/buttons/LargeButton';
import VizContainer from './VizContainer'
// import useState
export default function Dashboard() {
    const [row, setRow] = useState(1);
    const [col, setCol] = useState(1);
    const generateGrid = (row, col) => {
        const grid = [];
        
        for (let r = 1; r <= row; r++) {
            for (let c = 1; c <= col; c++) {
                grid.push(<VizContainer column={c} row={r} key={`row-${r}-col-${c}`} />);
            }
        }
    
        return grid;
    }
    return (
        <div className='container flex flex-col'>
            {/* For DEBUG purpose, remove in production */}
            <div className='fixed top-0 right-1/2 z-10'>
                <LargeButton
                    selected={false}
                    label='clear cache'
                    onClick={() => { localStorage.clear(); alert('localStorage reset') }}
                />
            </div>

            <div id="Description" className='h-fit max-w-xl m-4'>
                <p className='mb-3 text-4xl font-light'>Designer Dashboard</p>
                <p>
                    A visualization tool for you to intuitively interpret data collected from gameplays.
                    Pick a game and a time range to begin.
                </p>
            </div>
            <div className="flex ml-2 mr-2">
                <div className="input-group flex-1">
                    <div className='text-left font-semibold mb-2'>Row</div>
                    <select
                        className="form-select "
                        value={row}
                        onChange={(e) => setRow(Number(e.target.value))}>
                        <option> 1 </option>
                        <option> 2 </option>
                        <option> 3 </option>
                        <option> 4 </option>
                        <option> 5 </option>
                    </select>
                </div>

                <div className="input-group flex-1">
                    <div className='text-left font-semibold mb-2'>Column</div>
                    <select
                        className="form-select"
                        value={col}
                        onChange={(e) => setCol(Number(e.target.value))}>
                        <option> 1 </option>
                        <option> 2 </option>
                    </select>
                </div>
            </div>

            <div id="ContainerCollection" className='relative grid grid-flow-row-dense'>
                {generateGrid(row, col)}
            </div>
            {/* In the future, add controls to manage multiple visualizations, which each get own filtering options. */}
        </div>
    )
}