// global imports
import React from 'react';
// local imports
import TimedeltaInput from '../../components/TimedeltaInput';
//    model imports
import { ViewModes } from "../../model/ViewModes"
import Timedelta from '../../model/Timedelta';

/**
 * @typedef {import("../../typedefs").SetterMap} SetterMap
 */

/**
 * @typedef  {object} FilterOptionsProps
 * @property {boolean} adjustMode
 * @property {ViewModes} viewMode
 * @property {Timedelta} minPlaytime
 * @property {Timedelta} maxPlaytime
 * @property {number} minJobs
 * @property {SetterMap} updateFunctions
 */

 /**
 * @param {FilterOptionsProps} props
 */
export default function FilterOptionsView({
   adjustMode, viewMode, 
   minPlaytime, maxPlaytime,
   minJobs,
   updateFunctions
}) {

   const renderFilterPickers = () => {
      return (
         <div>
            <div id="PlaytimeRange">
               <div className="row"><h5 className='text-md font-bold'>Playtime</h5></div>
               <div className="mb-5">
                  <div id="MinPlaytimeInput" className="col mb-2">
                     <div className="input-group-prepend">
                        <h4 className="text-sm" >From</h4>
                     </div>
                     {/* TODO: add checkboxes so user can decide if they want this to be part of filter or not. */}
                     <div className='block w-full' >
                        <TimedeltaInput value={minPlaytime} setValue={updateFunctions["setMinPlaytime"]} />
                     </div>
                  </div>
                  <div id="MaxPlaytimeInput" className="col">
                     <div className="input-group-prepend">
                        <h4 className="text-sm" >To</h4>
                     </div>
                     <div className='block w-full' >
                        <TimedeltaInput value={maxPlaytime} setValue={updateFunctions["setMaxPlaytime"]} />
                     </div>
                  </div>
               </div>
            </div>
            <div id="JobRange">
               <div className="row"><h5 className='text-md font-bold'>Jobs</h5></div>
               <div className="mb-5">
                  <div id="MinJobInput" className="col">
                     <div className="input-group-prepend">
                        <h4 className="text-sm" >To</h4>
                     </div>
                        <input type='number' className='block w-full' value={minJobs} onChange={(e) => updateFunctions["setMinJobs"](e.target.value)}></input>
                     </div>
               </div>
            </div>
         </div>
      )
   }

   const renderFilterChoices = () => {
      return (
         <div>
            <div>
               <div className='text-sm'>Playtime:</div>
               <span className='text-sm'>{minPlaytime.ToString}</span>
               <span className='text-sm'> to </span>
               <span className='text-sm'>{maxPlaytime.ToString}</span>
            </div>
            <div>
               <div className='text-sm'>Jobs:</div>
               <span className='text-sm'>Min.</span>
               <span className='text-sm'> {minJobs} </span>
            </div>
         </div>
      )
   }

   if (adjustMode) {
      return renderFilterPickers();
   }
   else {
      return renderFilterChoices();
   }
}