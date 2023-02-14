
// global imports
import React, { useState, useEffect } from 'react';
// local imports
import Timedelta from '../model/Timedelta';

/**
 * @typedef {import('../typedefs').TimedeltaSetter} TimedeltaSetter
 */

 /**
 * @param {object}          props
 * @param {Timedelta}       props.value
 * @param {TimedeltaSetter} props.setValue
 */
export default function TimedeltaInput(props) {
   const {value, setValue} = props;

   const [hours, setHours] = useState(value.Hours);
   const [minutes, setMinutes] = useState(value.Minutes);
   const [seconds, setSeconds] = useState(value.Seconds);
   const [milliseconds, setMilliseconds] = useState(value.Milliseconds);

   useEffect(() => {
      setValue(new Timedelta(hours, minutes, seconds, milliseconds));
   }, [hours, minutes, seconds, milliseconds])

   // const ms = (<input id="milliseconds" type='number' className='inline w-16 col-span-1' value={value.Milliseconds} onChange={(e) => setMilliseconds(parseInt(e.target.value))}></input>)
   return (
      <div className="row mb-5">
         <div className="flex flex-row">
            <input id="hours"        type='number' className='inline w-16 col-span-1' value={value.Hours}         onChange={(e) => setHours(parseInt(e.target.value))}/> hr
            <input id="minutes"      type='number' className='inline w-16 col-span-1' value={value.Minutes}       onChange={(e) => setMinutes(parseInt(e.target.value))}/> min
            <input id="seconds"      type='number' className='inline w-16 col-span-1' value={value.Seconds}       onChange={(e) => setSeconds(parseInt(e.target.value))}/> s
         </div>
      </div>
   )
}