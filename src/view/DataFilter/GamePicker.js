// global imports
import React from 'react';
// local imports
import { vis_games } from '../../config';
import { ViewModes } from "../../model/ViewModes"

/**
 * @typedef {import("../../typedefs").SetterMap} SetterMap
 * @typedef {import("../../typedefs").SetterCallback} SetterCallback
 */

/**
 * @typedef  {object} GamePickerProps
 * @property {boolean} adjustMode
 * @property {string} gameSelected
 * @property {SetterCallback} setGameSelected
 */

 /**
 * @param {GamePickerProps} props
 */
export default function GamePicker({
   adjustMode,
   gameSelected,
   setGameSelected
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

   if (adjustMode) {
      return(
         <div id="GameSelector" className="col">
            <div className="input-group">
                  <div className='text-base font-semibold mb-2'>Game</div>
                  <select
                     className="form-select block w-full"
                     value={gameSelected}
                     onChange={(e) => setGameSelected(e.target.value)}>
                     <option> </option>
                     {gameList()}
                  </select>
            </div>
         </div>
      )
   }
   else {
      return(
         <div>
            <span className='font-medium '>{gameSelected}&nbsp;</span>
         </div>
      )
      // return <div>SelectionChoices</div>
   }
}