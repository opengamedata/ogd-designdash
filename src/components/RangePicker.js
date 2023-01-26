// global imports
import React from 'react';
// local imports
import { InputModes } from '../model/InputModes';
import { ISODateFormat, USDateFormat } from '../controller/TimeFormat';
import Timedelta from '../model/Timedelta';
import TimedeltaInput from './TimedeltaInput';

/**
 * @typedef {import("../typedefs").SetterCallback} SetterCallback
 */

/**
 * @typedef  {object} RangePickerProps
 * @property {boolean} adjustMode
 * @property {InputModes} inputMode
 * @property {string} rangeName
 * @property {string | number | Date | Timedelta | undefined} minVal
 * @property {string | number | Date | Timedelta | undefined} maxVal
 * @property {SetterCallback | undefined} setMin
 * @property {SetterCallback | undefined} setMax
 */

 /**
 * @param {RangePickerProps} props
 */
export default function RangePicker({
      adjustMode, inputMode, rangeName,
      minVal, maxVal, setMin, setMax
   }) {

   const useMin = (minVal != null && setMin != null)
   const useMax = (maxVal != null && setMax != null)

   const BadType = (value, valName) => {
      return (
         <div>
            <span><code>typeof {valName}</code> ({value} : {typeof value}) did not match the input mode ({inputMode.asString})</span>
         </div>
      )
   }

   /**
    * 
    * @param {*} value 
    * @param {string} valueID 
    * @param {SetterCallback} setter 
    * @returns 
    */
   const RenderPicker = (value, valueID, setter) => {
      const classes = "block w-full font-base"
      switch (inputMode) {
         case InputModes.TEXT:
            if (typeof value == 'string') {
               return (
                  <div>
                     <input id={valueID.toString()}
                        type='text' className={classes} value={value || "Any"}
                        onChange={(e) => setter(e.target.value)}
                     />
                  </div>
               )
            }
            else {
               return BadType(value, valueID);
            }
         break;
         case InputModes.DATE:
            if (value instanceof Date) {
               return (
                  <input id={valueID.toString()}
                     type='date' className={`${classes}`} value={ISODateFormat(value)}
                     onChange={(e) => setter(new Date(e.target.value + 'T00:00'))}
                  />
               )
            }
            else {
               return BadType(value, valueID);
            }
         break;
         case InputModes.TIME:
            if (value instanceof Timedelta) {
               return (
                  <>
                     <div id={valueID.toString()} className={`${classes}`} >
                        <TimedeltaInput value={value} setValue={setter} />
                     </div>
                  </>
               )
            }
            else {
               return BadType(value, valueID);
            }
         break;
         case InputModes.NUMBER:
            if (typeof value == 'number') {
               return (
                  <div>
                     <input id={valueID.toString()}
                        type='number' className={`${classes}`} value={value || 0}
                        onChange={(e) => setter(parseInt(e.target.value))}
                     />
                  </div>
               )
            }
            else {
               return BadType(value, valueID);
            }
         break;
         default:
            return (
               <div className={`${classes}`}>
                  <span>Input Mode not supported: {inputMode.asString}</span>
               </div>
            )
      }
   }

   const RenderChoice = (value, valueID) => {
      const classes = "text-sm"
      switch (inputMode) {
         case InputModes.TEXT:
         case InputModes.NUMBER:
            if (typeof value == 'string' || typeof value == 'number')
            {
               return(
                  <span className={`${classes}`}> {value || "Any"}</span>
               )
            }
            else {
               return BadType(value, valueID);
            }
         break;
         case InputModes.DATE:
            if (value instanceof Date) {
               return (
                  <span className={`${classes}`}>{USDateFormat(value)}</span>
               );
            }
            else {
               return BadType(value, valueID);
            }
         break;
         case InputModes.TIME:
            if (value instanceof Timedelta) {
               return (
                  <span className={`${classes}`}>{value.ToString}</span>
               )
            }
            else {
               return BadType(value, valueID);
            }
         default:
            return (
               <>
                  <span>Input Mode not supported: {inputMode.asString}</span>
               </>
            )
      }
   }

   if (adjustMode) {
      const from = useMin &&
                 (
                     <div className="col mb-2">
                        <div className="input-group-prepend">
                           <h4 className="text-sm" >{useMax ? "From" : "Min"}: </h4>
                        </div>
                        {RenderPicker(minVal, "minValue", setMin)}
                     </div>
                 );
      const to   = useMax &&
                 (
                     <div className="col mb-2">
                        <div className="input-group-prepend">
                           <h4 className="text-sm" >{useMin ? "To" : "Max"}: </h4>
                        </div>
                        {RenderPicker(maxVal, "maxValue", setMax)}
                     </div>
                 );
      return (
         <>
            <div className="row"><h5 className='text-base font-semibold'>{rangeName}</h5></div>
            {/* TODO: add checkboxes so user can decide if they want this to be part of filter or not. */}
            <div className="mb-5">
                  {from}
                  {to}
            </div>
         </>
      )
   }
   else {
      const from = useMin &&
                 (
                     <>
                        {useMax ? <></> : <span>Min: </span>}
                        {RenderChoice(minVal, "minValue")}
                     </>
                 );
      const to   = useMax &&
                 (
                     <>
                        <span className='text-sm'>{useMin ? " to " : "Max: "}</span>
                        {RenderChoice(maxVal, "maxValue")}
                     </>
                 );
      return (
         <>
            <div className="col mb-2">
            <div className='text-sm'>{rangeName}: </div>
            {from}
            {to}
            </div>
         </>
      )
   }
}
