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

   const BadType = () => {
      return (
         <div>
            <span><code>typeof minVal</code> ({typeof minVal}) or <code>typeof maxVal</code> ({typeof maxVal}) did not match the input mode ({inputMode.asString})</span>
         </div>
      )
   }

   const RenderPicker = (value, setter) => {
      const classes = "block w-full font-base"
      switch (inputMode) {
         case InputModes.TEXT:
            if (typeof value == 'string') {
               return (
                  <div>
                     <input
                        type='text' className={classes} value={value || "Any"}
                        onChange={(e) => setter(e.target.value)}
                     />
                  </div>
               )
            }
            else {
               return BadType();
            }
         break;
         case InputModes.DATE:
            if (value instanceof Date) {
               return (
                  <input
                     type='date' className={`${classes}`} value={ISODateFormat(value)}
                     onChange={(e) => setter(new Date(e.target.value + 'T00:00'))}
                  />
               )
            }
            else {
               return BadType();
            }
         break;
         case InputModes.TIME:
            if (value instanceof Timedelta) {
               return (
                  <>
                     <div className={`${classes}`} >
                        <TimedeltaInput value={value} setValue={setter} />
                     </div>
                  </>
               )
            }
            else {
               return BadType();
            }
         break;
         case InputModes.NUMBER:
            if (typeof value == 'number') {
               return (
                  <div>
                     <input
                        type='number' className={`${classes}`} value={value || 0}
                        onChange={(e) => setter(parseInt(e.target.value))}
                     />
                  </div>
               )
            }
            else {
               return BadType();
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

   const RenderChoice = (value) => {
      const classes = "text-sm"
      switch (inputMode) {
         case InputModes.TEXT:
         case InputModes.NUMBER:
            if (typeof minVal == 'string' && typeof maxVal == 'string') {
               return(
                  <span className={`${classes}`}> {value || "Any"}</span>
               )
            }
            else {
               return BadType();
            }
         break;
         case InputModes.DATE:
            if (value instanceof Date) {
               return (
                  <span className={`${classes}`}>{USDateFormat(value)}</span>
               );
            }
            else {
               return BadType();
            }
         break;
         case InputModes.TIME:
            if (value instanceof Timedelta) {
               return (
                  <span className={`${classes}`}>{value.ToString}</span>
               )
            }
            else {
               return BadType();
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
      return (
         <>
            <div className="row"><h5 className='text-base font-semibold'>{rangeName}</h5></div>
            {/* TODO: add checkboxes so user can decide if they want this to be part of filter or not. */}
            <div className="mb-5">
               <div id="MinAppVersionInput" className="col mb-2">
                  <div className="input-group-prepend">
                     <h4 className="text-sm" >From</h4>
                  </div>
                  {RenderPicker(minVal, setMin)}
               </div>
               <div id="MaxAppVersionInput" className="col mb-2">
                  <div className="input-group-prepend">
                     <h4 className="text-sm" >To</h4>
                  </div>
                  {RenderPicker(maxVal, setMax)}
               </div>
            </div>
         </>
      )
   }
   else {
      return (
         <>
            <span className='text-sm'>{rangeName}: </span>
            {RenderChoice(minVal)}
            <span className='text-sm'> to </span>
            {RenderChoice(maxVal)}
         </>
      )
   }
}
