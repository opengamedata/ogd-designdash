
// global imports
import React, { useState, useEffect } from 'react';
// local imports
import Timedelta from '../model/Timedelta';

/**
 * @typedef {import('../typedefs').TimedeltaSetter} TimedeltaSetter
 */

/**
 * @typedef  {object} TimedeltaInputProps
 * @property {Timedelta} value
 * @property {TimedeltaSetter} setValue
 */

 /**
 * @param {TimedeltaInputProps} props
 */
export default function TimedeltaInput({value, setValue}) {
   const [hours, setHours] = useState(value.Hours);
   const [minutes, setMinutes] = useState(value.Minutes);
   const [seconds, setSeconds] = useState(value.Seconds);
   const [milliseconds, setMilliseconds] = useState(value.Milliseconds);

   useEffect(() => {
      setValue(new Timedelta(hours, minutes, seconds, milliseconds));
   }, [hours, minutes, seconds, milliseconds])

   return (
      <div>
         <div className="row mb-5">
            <input id="hours"        type='number' className='block w-full' value={value.Hours}        onChange={(e) => setHours(parseInt(e.target.value))}></input>
            :
            <input id="minutes"      type='number' className='block w-full' value={value.Minutes}      onChange={(e) => setMinutes(parseInt(e.target.value))}></input>
            :
            <input id="seconds"      type='number' className='block w-full' value={value.Seconds}      onChange={(e) => setSeconds(parseInt(e.target.value))}></input>
            .
            <input id="milliseconds" type='number' className='block w-full' value={value.Milliseconds} onChange={(e) => setMilliseconds(parseInt(e.target.value))}></input>
         </div>
      </div>
   )
}