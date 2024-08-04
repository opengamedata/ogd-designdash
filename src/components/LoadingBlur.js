import React from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/solid'

export default function LoadingBlur({ loading }) {

    return loading ?
        // <div className="absolute left-0 top-0 w-full h-full z-10 backdrop-blur-md flex justify-center items-center space-x-3">
        <div className="relative min-height-20rem right-0 backdrop-blur-md flex justify-center items-center space-x-3">
            <Cog6ToothIcon className={`animate-spin h-8 w-8`} />
            <p className="text-3xl font-light">Loading...</p>
        </div>
        :
        <></>

}