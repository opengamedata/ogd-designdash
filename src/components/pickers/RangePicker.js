// global imports
import React, { useState } from 'react';
// local imports
import ValueModes from '../../model/enums/ValueModes';
import { ISODateFormat, USDateFormat } from '../../controller/TimeFormat';
import Timedelta from '../../model/Timedelta';
import TimedeltaPicker from '../pickers/TimedeltaPicker';

/**
 * @typedef {import("../../typedefs").SetterCallback} SetterCallback
 * @typedef {import("../../typedefs").MapSetter} MapSetter
 * @typedef {import("../../controller/requests/FilterRequest").FilterItem} FilterItem
 */

 /**
 * @param {object} props
 * @param {boolean} props.adjustMode
 * @param {FilterItem} props.filterItem
 * @param {MapSetter} props.mergeContainerState
 * @param {string} props.key
 * @returns {React.ReactElement}
 */
export default function RangePicker(props) {
   const { adjustMode, filterItem, mergeContainerState } = props;

   const getDefaultValue = () => {
      switch (filterItem.ValueMode) {
         case ValueModes.TEXT:
            return "*";
         // break;
         case ValueModes.DATE:
            return new Date();
         // break;
         case ValueModes.TIME:
            return new Timedelta(0)
         // break;
         case ValueModes.NUMBER:
         default:
            return 0;
         // break;
      }
   }

   const min_key = `${filterItem.Name}Min`;
   const max_key = `${filterItem.Name}Max`;

   const [localMin, setLocalMin] = useState(filterItem.InitialValues[min_key] || getDefaultValue());
   const [localMax, setLocalMax] = useState(filterItem.InitialValues[max_key] || getDefaultValue());

   const setMin = (value) => {
      try {
         if (filterItem.Validator({[min_key]:value, max_key:localMax})) {
            mergeContainerState({[min_key] : value});
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
         if (filterItem.Validator({[min_key]:localMin, [max_key]:value})) {
            mergeContainerState({[max_key] : value});
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
    * @returns {React.ReactElement}
    */
   const RenderPicker = (value, valueID, setter) => {
      let ret_val;

      const classes = "block w-full font-base"
      switch (filterItem.ValueMode) {
         case ValueModes.TEXT:
            if (typeof value == 'string') {
               ret_val = (
                  <div>
                     <input id={valueID.toString()}
                        type='text' className={classes} value={value || "Any"}
                        onChange={(e) => setter(e.target.value)}
                     />
                  </div>
               )
            }
            else {
               ret_val = BadType(value, valueID)
            }
         break;
         case ValueModes.DATE:
            if (value instanceof Date) {
               ret_val = (
                  <input id={valueID.toString()}
                     type='date' className={`${classes}`} value={ISODateFormat(value)}
                     onChange={(e) => setter(new Date(e.target.value + 'T00:00'))}
                  />
               )
            }
            else {
               ret_val = BadType(value, valueID);
            }
         break;
         case ValueModes.TIME:
            if (value instanceof Timedelta) {
               ret_val = (
                  <>
                     <div id={valueID.toString()} className={`${classes}`} >
                        <TimedeltaPicker value={value} setValue={setter} />
                     </div>
                  </>
               )
            }
            else {
               ret_val = BadType(value, valueID);
            }
         break;
         case ValueModes.NUMBER:
            if (typeof value == 'number') {
               ret_val = (
                  <div>
                     <input id={valueID.toString()}
                        type='number' className={`${classes}`} value={value || 0}
                        onChange={(e) => setter(parseInt(e.target.value))}
                     />
                  </div>
               )
            }
            else {
               ret_val = BadType(value, valueID);
            }
         break;
         default:
            ret_val = (
               <div className={`${classes}`}>
                  <span>Value Mode not supported for Range: {filterItem.ValueMode.asString}</span>
               </div>
            )
      }
      return ret_val;
   }

   const RenderChoice = (value, valueID) => {
      let ret_val;
      const classes = "text-sm"
      switch (filterItem.ValueMode) {
         case ValueModes.TEXT:
         case ValueModes.NUMBER:
            ret_val = (typeof value == 'string' || typeof value == 'number') ?
                      <span className={`${classes}`}> {value || "Any"}</span> :
                      <BadType value={value} valName={valueID}/>;
         break;
         case ValueModes.DATE:
            ret_val = (value instanceof Date) ?
                      <span className={`${classes}`}>{USDateFormat(value)}</span> :
                      <BadType value={value} valName={valueID}/>;
         break;
         case ValueModes.TIME:
            ret_val = (value instanceof Timedelta) ?
                      <span className={`${classes}`}>{value.asString}</span> :
                      <BadType value={value} valName={valueID}/>;
         break;
         default:
            ret_val = <span>Input Mode not supported: {filterItem.ValueMode.asString}</span>;
      }
      return ret_val;
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
