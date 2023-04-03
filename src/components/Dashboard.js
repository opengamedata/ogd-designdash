// global imports
import React from 'react';
// local imports
import LargeButton from '../components/buttons/LargeButton';
import VizContainer from './VizContainer'

export default function Dashboard() {

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
            <div id="ContainerCollection" className='relative grid grid-flow-row-dense'>
                <VizContainer column={1} row={1}></VizContainer>
            </div>
            {/* In the future, add controls to manage multiple visualizations, which each get own filtering options. */}
        </div>
   )
}