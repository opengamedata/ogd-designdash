
// global imports
import React from 'react';
// local imports
import Timedelta from '../../model/Timedelta';

/**
 * @typedef {import('../../typedefs').TimedeltaSetter} TimedeltaSetter
 */

 /**
 * @param {object}          props
 * @param {Timedelta}       props.value
 * @param {TimedeltaSetter} props.setValue
 */
export default function TimedeltaPicker(props) {
   const {value, setValue} = props;

   /**
    * @param {React.ChangeEvent<HTMLInputElement>} e 
    */
   const updateHour = (e) => {
      const component_val = parseInt(e.target.value);
      setValue(new Timedelta(component_val, value.Minutes, value.Seconds, value.Milliseconds));
   }
   /**
    * @param {React.ChangeEvent<HTMLInputElement>} e 
    */
   const updateMinute = (e) => {
      const component_val = parseInt(e.target.value);
      setValue(new Timedelta(value.Hours, component_val, value.Seconds, value.Milliseconds));
   }
   /**
    * @param {React.ChangeEvent<HTMLInputElement>} e 
    */
   const updateSecond = (e) => {
      const component_val = parseInt(e.target.value);
      setValue(new Timedelta(value.Hours, value.Minutes, component_val, value.Milliseconds));
   }
   /**
    * @param {React.ChangeEvent<HTMLInputElement>} e 
    */
   const updateMillisecond = (e) => {
      const component_val = parseInt(e.target.value);
      setValue(new Timedelta(value.Hours, value.Minutes, value.Seconds, component_val));
   }

   // const ms = (<input id="milliseconds" type='number' className='inline w-16 col-span-1' value={value.Milliseconds} onChange={(e) => setMilliseconds(parseInt(e.target.value))}></input>)
   return (
      <div className="row mb-5">
         <div className="flex flex-row">
            <input id="hours"        type='number' className='inline w-16 col-span-1' value={value.Hours}         onChange={updateHour}/> hr
            <input id="minutes"      type='number' className='inline w-16 col-span-1' value={value.Minutes}       onChange={updateMinute}/> min
            <input id="seconds"      type='number' className='inline w-16 col-span-1' value={value.Seconds}       onChange={updateSecond}/> s
         </div>
      </div>
   )
}