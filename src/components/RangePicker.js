// global imports
import React from 'react';
import { useEffect, useState } from 'react';
// local imports
import { ValueModes } from '../controller/requests/FilterRequest';
import { ISODateFormat, USDateFormat } from '../controller/TimeFormat';
import Timedelta from '../model/Timedelta';
import TimedeltaInput from './TimedeltaInput';

/**
 * @typedef {import("../typedefs").SetterCallback} SetterCallback
 * @typedef {import("../typedefs").MapSetter} MapSetter
 * @typedef {import("../controller/requests/FilterRequest").FilterItem} FilterItem
 */

 /**
 * @param {object} props
 * @param {boolean} props.adjustMode
 * @param {FilterItem} props.filterItem
 * @param {MapSetter} props.mergeContainerState
 * @param {string} props.key
 */
export default function RangePicker(props) {
   let {
      adjustMode,
      filterItem,
      mergeContainerState
   } = props;

   const initialMin = filterItem.InitialValues['min'];
   const initialMax = filterItem.InitialValues['max'];

   const [localMin, setLocalMin] = useState(initialMin);
   const [localMax, setLocalMax] = useState(initialMax);
   mergeContainerState({[`${filterItem.Name}Min`] : initialMin});
   mergeContainerState({[`${filterItem.Name}Max`] : initialMax});

   const setMin = (value) => {
      try {
         if (filterItem.Validator({'min':value, 'max':localMax})) {
            mergeContainerState({[`${filterItem.Name}Min`] : value});
            setLocalMin(value);
         }
      }
      catch (error) {
         alert(error);
         return;
      }
   }
   const setMax = (value) => {
      try {
         if (filterItem.Validator({'min':localMin, 'max':value})) {
            mergeContainerState({[`${filterItem.Name}Max`] : value});
            setLocalMax(value);
         }
      }
      catch (error) {
         alert(error);
         return;
      }
   }

   const BadType = (value, valName) => {
      return (
         <div>
            <span><code>typeof {valName}</code> ({value} : {typeof value}) did not match the value mode ({filterItem.ValueMode.asString})</span>
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
      switch (filterItem.ValueMode) {
         case ValueModes.TEXT:
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
         case ValueModes.DATE:
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
         case ValueModes.TIME:
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
         case ValueModes.NUMBER:
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
                  <span>Value Mode not supported for Range: {filterItem.ValueMode.asString}</span>
               </div>
            )
      }
   }

   const RenderChoice = (value, valueID) => {
      const classes = "text-sm"
      switch (filterItem.ValueMode) {
         case ValueModes.TEXT:
         case ValueModes.NUMBER:
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
         case ValueModes.DATE:
            if (value instanceof Date) {
               return (
                  <span className={`${classes}`}>{USDateFormat(value)}</span>
               );
            }
            else {
               return BadType(value, valueID);
            }
         break;
         case ValueModes.TIME:
            if (value instanceof Timedelta) {
               return (
                  <span className={`${classes}`}>{value.asString}</span>
               )
            }
            else {
               return BadType(value, valueID);
            }
         default:
            return (
               <>
                  <span>Input Mode not supported: {filterItem.ValueMode.asString}</span>
               </>
            )
      }
   }


   const useMin = (localMin != null)
   const useMax = (localMax != null)
   if (adjustMode) {
      const from = useMin &&
                 (
                     <div className="col mb-2">
                        <div className="input-group-prepend">
                           <h4 className="text-sm" >{useMax ? "From" : "Min"}: </h4>
                        </div>
                        {RenderPicker(localMin, "minValue", setMin)}
                     </div>
                 );
      const to   = useMax &&
                 (
                     <div className="col mb-2">
                        <div className="input-group-prepend">
                           <h4 className="text-sm" >{useMin ? "To" : "Max"}: </h4>
                        </div>
                        {RenderPicker(localMax, "maxValue", setMax)}
                     </div>
                 );
      return (
         <>
            <div className="row"><h5 className='text-base font-semibold'>{filterItem.Name}</h5></div>
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
                        {RenderChoice(localMin, "minValue")}
                     </>
                 );
      const to   = useMax &&
                 (
                     <>
                        <span className='text-sm'>{useMin ? " to " : "Max: "}</span>
                        {RenderChoice(localMax, "maxValue")}
                     </>
                 );
      return (
         <>
            <div className="col mb-2">
            <div className='text-sm'>{filterItem.Name}: </div>
            {from}
            {to}
            </div>
         </>
      )
   }
}
