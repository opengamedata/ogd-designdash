// global imports
import React from 'react';
// local imports

/**
 * @typedef {import("../typedefs").SetterMap} SetterMap
 * @typedef {import("../typedefs").SetterCallback} SetterCallback
 * @typedef {import("../model/enums/EnumType").default} EnumType
 */

/**
 * @callback EnumList
 * @returns {EnumType[]}
 */

 /**
 * @param {object} props
 * @param {boolean} props.adjustMode
 * @param {object} props.enumType
 * @param {EnumList} props.enumType.EnumList
 * @param {string} props.selected
 * @param {SetterCallback} props.setSelected
 */
export default function EnumPicker({
   adjustMode,
   enumType,
   selected,
   setSelected
}) {
    const gameList = () => {
        const games = []
        enumType.EnumList().forEach((k) => {
            games.push(
                <option key={k.asString} value={k.asString}>{k.asDisplayString}</option>
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
                     value={selected}
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
            <span className='font-medium '>{selected}&nbsp;</span>
         </div>
      )
      // return <div>SelectionChoices</div>
   }
}
