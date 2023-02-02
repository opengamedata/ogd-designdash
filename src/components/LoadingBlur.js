import React from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/solid'

export default function LoadingBlur({ loading, height, width }) {

    return loading ?
        <div className="absolute left-0 top-0 w-full h-full z-10 backdrop-blur-md flex justify-center items-center space-x-3">
            <Cog6ToothIcon className={`'animate-spin h-${height} w-${width}'`} />
            <p className="text-3xl font-light">Loading...</p>
        </div>
        :
        <></>

}