// global imports
import React from 'react';
// local imports
import { InputModes } from '../model/InputModes';

/**
 * @typedef {import("../typedefs").SetterCallback} SetterCallback
 */

/**
 * @typedef  {object} RangePickerProps
 * @property {boolean} adjustMode
 * @property {InputModes} inputMode
 * @property {string} rangeName
 * @property {string | Date} minVal
 * @property {string | Date} maxVal
 * @property {SetterCallback} setMin
 * @property {SetterCallback} setMax
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
            <span>Type of minVal ({typeof minVal}) or type of maxVal ({typeof maxVal}) did not match the input mode ({inputMode.asString})</span>
         </div>
      )
   }

   const RenderPicker = () => {
      switch (inputMode) {
         case InputModes.TEXT:
            if (typeof minVal == 'string' && typeof maxVal == 'string') {
               return (
                  <div>
                     <div className="row"><h5 className='text-md font-bold'>{rangeName}</h5></div>
                     <div className="mb-5">
                        <div id="MinAppVersionInput" className="col mb-2">
                           <div className="input-group-prepend">
                              <h4 className="text-sm" >From</h4>
                           </div>
                           <div>
                              <input type='text' className='block w-half' value={minVal || "Any"} onChange={(e) => setMin(e.target.value)}></input>
                           </div>
                        </div>
                        <div id="MaxAppVersionInput" className="col mb-2">
                           <div className="input-group-prepend">
                              <h4 className="text-sm" >To</h4>
                           </div>
                           <input type='text' className='block w-half' value={maxVal || "Any"} onChange={(e) => setMax(e.target.value)}></input>
                        </div>
                     </div>
                  </div>
               )
            }
            else {
               return BadType();
            }
         break;
         case InputModes.DATE:
            if (minVal instanceof Date && maxVal instanceof Date) {
               return (
                  <div>
                     <div className="row"><h5 className='text-md font-bold'>{rangeName}</h5></div>
                     <div className="mb-5">
                        <div id="MinDateInput" className="col mb-2">
                           <div className="input-group-prepend"><h4 className="text-sm" >From</h4></div>
                           <input type='date' className='block w-full' value={minVal.toISOString().split('T')[0]} onChange={(e) => setMin(new Date(e.target.value + 'T00:00'))}></input>
                        </div>
                        <div id="MaxDateInput" className="col">
                           <div className="input-group-prepend"><h4 className="text-sm" >To</h4></div>
                           <input type='date' className='block w-full' value={maxVal.toISOString().split('T')[0]} onChange={(e) => setMax(new Date(e.target.value + 'T00:00'))}></input>
                        </div>
                     </div>
                  </div>
               )
            }
            else {
               return BadType();
            }
         break;
         case InputModes.NUMBER:
         case InputModes.TIME:
         default:
            return (
               <div>
                  <span>Input Mode not supported: {inputMode.asString}</span>
               </div>
            )
      }
   }

   const RenderChoice = () => {
      switch (inputMode) {
         case InputModes.TEXT:
            if (typeof minVal == 'string' && typeof maxVal == 'string') {
               return(
                  <div>
                     <div>
                        <span className='text-sm'>App Version: </span>
                        <span className='text-sm'> {minVal || "Any"}</span>
                        <span className='text-sm'> to </span>
                        <span className='text-sm'>{maxVal || "Any"}</span>
                     </div>
                  </div>
               )
            }
            else {
               return BadType();
            }
         break;
         case InputModes.DATE:
            if (minVal instanceof Date && maxVal instanceof Date) {
               return (
                  <div>
                     <span>Date: </span>
                     <span className='text-sm'>{minVal.toISOString().split('T')[0]}</span>
                     <span className='text-sm'> to </span>
                     <span className='text-sm'>{maxVal.toISOString().split('T')[0]}</span>
                  </div>
               );
            }
            else {
               return BadType();
            }
         break;
         case InputModes.NUMBER:
         case InputModes.TIME:
         default:
            return (
               <div>
                  <span>Input Mode not supported: {inputMode.asString}</span>
               </div>
            )
      }
   }

   if (adjustMode) {
      return RenderPicker()
   }
   else {
      return RenderChoice()
   }
}
