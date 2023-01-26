// global imports
import React from 'react';
// local imports
//    model imports
import { InputModes } from '../../model/InputModes';
import RangePicker from '../../components/RangePicker';
import { ViewModes } from '../../model/ViewModes';
import Timedelta from '../../model/Timedelta';

/**
 * @typedef {import("../../typedefs").SetterMap} SetterMap
 * @typedef {import("../../typedefs").SetterCallback} SetterCallback
 */

/**
 * @typedef {object} FilterSetters
 * @property {SetterCallback} setMinJobs
 * @property {SetterCallback} setMinPlaytime
 * @property {SetterCallback} setMaxPlaytime
 */

/**
 * @typedef  {object} FilterOptionsProps
 * @property {boolean} adjustMode
 * @property {ViewModes} viewMode
 * @property {Timedelta} minPlaytime
 * @property {Timedelta} maxPlaytime
 * @property {number} minJobs
 * @property {FilterSetters} updateFunctions
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

   return (
         <div>
            <div id="PlaytimeRange">
               <RangePicker
                  adjustMode={adjustMode} inputMode={InputModes.TIME}
                  rangeName="Playtime"
                  minVal={minPlaytime || "Any"} setMin={updateFunctions.setMinPlaytime}
                  maxVal={maxPlaytime || "Any"} setMax={updateFunctions.setMaxPlaytime}
               />
            </div>
            <div id="JobRange">
               <RangePicker
                  adjustMode={adjustMode} inputMode={InputModes.NUMBER}
                  rangeName="Jobs"
                  minVal={minJobs || 0} setMin={updateFunctions.setMinJobs}
                  maxVal={undefined}    setMax={undefined}
               />
            </div>
         </div>
   )
}