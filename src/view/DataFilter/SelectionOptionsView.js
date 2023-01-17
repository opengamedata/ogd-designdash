// global imports
import React from 'react';
// local imports
import { vis_games } from '../../config';
import { ViewModes } from "../../model/ViewModes"

/**
 * @typedef {import("../../typedefs").SetterMap} SetterMap
 */

/**
 * @typedef  {object} FilterOptionsProps
 * @property {boolean} adjustMode
 * @property {ViewModes} viewMode
 * @property {string} gameSelected
 * @property {string | null} minAppVersion
 * @property {string | null} maxAppVersion
 * @property {string | null} minLogVersion
 * @property {string | null} maxLogVersion
 * @property {Date} startDate
 * @property {Date} endDate
 * @property {string[]} ids
 * @property {SetterMap} updateFunctions
 */

 /**
 * @param {FilterOptionsProps} props
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
    const gameList = () => {
        const games = []
        vis_games.forEach((k) => {
            games.push(
                <option key={k} value={k}>{k}</option>
            )
        })
        return games
    }

   const renderSelectionPickers = () => {
      return (
         <div>
            <div id="GameSelector" className="col">
               <div className="input-group">
                     <div className="mb-2">
                        <span className='text-xl font-light' >Game</span>
                     </div>
                     <select
                        className="form-select block w-full"
                        value={gameSelected}
                        onChange={(e) => updateFunctions["setGameSelected"](e.target.value)}>
                        <option> </option>
                        {gameList()}
                     </select>
               </div>
            </div>
            <div id="AppVersionRange">
               <div className="row"><h5 className='text-md font-bold'>App Version</h5></div>
               <div className="mb-5">
                  <div id="MinAppVersionInput" className="col mb-2">
                     <div className="input-group-prepend">
                        <h4 className="text-sm" >From</h4>
                     </div>
                     <div>
                        <input type='text' className='block w-full' value={minAppVersion} onChange={(e) => updateFunctions["setMinAppVersion"](e.target.value)}></input>
                     </div>
                  </div>
                  <div id="MaxAppVersionInput" className="col">
                     <div className="input-group-prepend">
                        <h4 className="text-sm" >To</h4>
                     </div>
                     <input type='text' className='block w-full' value={maxAppVersion} onChange={(e) => updateFunctions["setMaxAppVersion"](e.target.value)}></input>
                  </div>
               </div>
            </div>
            <div id="LogVersionRange">
               <div className="row"><h5 className='text-md font-bold'>Log Version</h5></div>
               <div className="mb-5">
                  <div id="MinLogVersionInput" className="col mb-2">
                     <div className="input-group-prepend">
                        <h4 className="text-sm" >From</h4>
                     </div>
                     <div>
                        <input type='text' className='block w-full' value={minLogVersion} onChange={(e) => updateFunctions["setMinLogVersion"](e.target.value)}></input>
                     </div>
                  </div>
                  <div id="MaxLogVersionInput" className="col">
                     <div className="input-group-prepend">
                        <h4 className="text-sm" >To</h4>
                     </div>
                     <input type='text' className='block w-full' value={maxLogVersion} onChange={(e) => updateFunctions["setMaxLogVersion"](e.target.value)}></input>
                  </div>
               </div>
            </div>
            <div id="ModeSpecificPickers">
               {/* {renderModeSpecificPickers()} */}
            </div>
         </div>
      )
   }

   const renderModeSpecificPickers = () => {
      switch (viewMode) {
         case ViewModes.POPULATION:
            return (
            <div>
               <div className="row"><h5 className='text-md font-bold'>Date</h5></div>
               <div className="mb-5">
                  <div id="MinDateInput" className="col mb-2">
                     <div className="input-group-prepend"><h4 className="text-sm" >From</h4></div>
                     <input type='date' className='block w-full' value={startDate} onChange={(e) => updateFunctions["setStartDate"](e.target.value)}></input>
                  </div>
                  <div id="MaxDateInput" className="col">
                     <div className="input-group-prepend"><h4 className="text-sm" >To</h4></div>
                     <input type='date' className='block w-full' value={endDate} onChange={(e) => updateFunctions["setEndDate"](e.target.value)}></input>
                  </div>
               </div>
            </div>
            )
         case ViewModes.PLAYER:
            // TODO: render ID selector
            return (<></>);
         case ViewModes.SESSION:
            // TODO: render ID selector
            return (<></>);
         case ViewModes.INITIAL:
            return (<></>);
         default:
            return (
               <div>Invalid ViewMode selected: "{viewMode.toString()}"</div>
            )
      }
   }

   const renderModeSpecificChoices = () => {
      switch (viewMode) {
         case ViewModes.POPULATION:
            return (
               <div>
                  <div className='text-sm'>{startDate.toDateString().replace('T', ' ')}</div>
                  <div className='text-sm'>to</div>
                  <div className='text-sm'>{endDate.toDateString().replace('T', ' ')}</div>
               </div>
            );
         case ViewModes.PLAYER:
            return (
               <div className='text-sm'>{ids.join(", ")}</div>
            );
         case ViewModes.SESSION:
            return (
               <div className='text-sm'>{ids.join(", ")}</div>
            );
         case ViewModes.INITIAL:
            return (<></>);
         default:
            return (
               <div>Invalid ViewMode selected: {viewMode.toString}</div>
            )
      }
   }

   if (adjustMode) {
      // return renderSelectionPickers();
      return <div>SelectionPickers</div>
   }
   else {
      return(
         <div>
            <div>
               <span className='font-medium '>{gameSelected}&nbsp;</span>
               {/* <span>version</span> */}
            </div>
            <div>
               <span className='text-sm'>App Version: </span>
               <span className='text-sm'> {minAppVersion || "-"}</span>
               <span className='text-sm'> to </span>
               <span className='text-sm'>{maxAppVersion || "-"}</span>
            </div>
            <div>
               <span className='text-sm'>Log Version: </span>
               <span className='text-sm'> {minLogVersion || "-"}</span>
               <span className='text-sm'> to </span>
               <span className='text-sm'>{maxLogVersion || "-"}</span>
            </div>
            {renderModeSpecificChoices()}
         </div>
      )
      // return <div>SelectionChoices</div>
   }
}