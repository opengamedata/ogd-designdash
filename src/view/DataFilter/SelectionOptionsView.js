// global imports
import React from 'react';
// local imports
import { ViewModes } from "../../model/ViewModes"
import GamePicker from './GamePicker';
import RangePicker from '../../components/RangePicker';
import { InputModes } from '../../model/InputModes';

/**
 * @typedef {import("../../typedefs").SetterCallback} SetterCallback
 */

/**
 * @typedef {object} SelectionSetters
 * @property {SetterCallback} setGameSelected
 * @property {SetterCallback} setMinAppVersion
 * @property {SetterCallback} setMaxAppVersion
 * @property {SetterCallback} setMinLogVersion
 * @property {SetterCallback} setMaxLogVersion
 * @property {SetterCallback} setStartDate
 * @property {SetterCallback} setEndDate
 * @property {SetterCallback} setIDs
 */

/**
 * @typedef  {object} SelectionOptionsProps
 * @property {boolean} adjustMode
 * @property {ViewModes} viewMode
 * @property {string} gameSelected
 * @property {string?} minAppVersion
 * @property {string?} maxAppVersion
 * @property {string?} minLogVersion
 * @property {string?} maxLogVersion
 * @property {Date} startDate
 * @property {Date} endDate
 * @property {string[]} ids
 * @property {SelectionSetters} updateFunctions
 */

 /**
 * @param {SelectionOptionsProps} props
 */
export default function SelectionOptionsView({
   adjustMode, viewMode, 
   gameSelected,
   minAppVersion, maxAppVersion,
   minLogVersion, maxLogVersion,
   startDate, endDate,
   ids,
   updateFunctions
}) {

   const renderModeSpecificPickers = () => {
      switch (viewMode) {
         case ViewModes.POPULATION:
         case ViewModes.INITIAL:
            return (
               <div id="DateRange">
                  <RangePicker
                     adjustMode={adjustMode} inputMode={InputModes.DATE}
                     rangeName="Dates"
                     minVal={startDate} setMin={updateFunctions.setStartDate}
                     maxVal={endDate} setMax={updateFunctions.setEndDate}
                  />
               </div>
            )
         case ViewModes.PLAYER:
            // TODO: render ID selector
            return (<></>);
         case ViewModes.SESSION:
            // TODO: render ID selector
            return (<></>);
         default:
            return (
               <div>Invalid ViewMode selected: "{viewMode.asString}"</div>
            )
      }
   }

   return (
      <div>
         <GamePicker
            adjustMode={adjustMode}
            gameSelected={gameSelected} setGameSelected={updateFunctions['setGameSelected']}
         />
         <div id="AppVersionRange">
            <RangePicker
               adjustMode={adjustMode} inputMode={InputModes.TEXT}
               rangeName="App Version"
               minVal={minAppVersion || "Any"} setMin={updateFunctions.setMinAppVersion}
               maxVal={maxAppVersion || "Any"} setMax={updateFunctions.setMaxAppVersion}
            />
         </div>
         <div id="LogVersionRange">
            <RangePicker
               adjustMode={adjustMode} inputMode={InputModes.TEXT}
               rangeName="Log Version"
               minVal={minLogVersion || "Any"} setMin={updateFunctions.setMinLogVersion}
               maxVal={maxLogVersion || "Any"} setMax={updateFunctions.setMaxLogVersion}
            />
         </div>
         <div id="ModeSpecificPickers">
            {renderModeSpecificPickers()}
         </div>
      </div>
   )
}