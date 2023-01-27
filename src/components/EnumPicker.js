// global imports
import React from 'react';
import { useEffect, useState } from 'react';
// local imports

/**
 * @typedef {import("../model/enums/EnumType").default} EnumType
 * @typedef {import("../typedefs").StateUpdater} StateUpdater
 * @typedef {import("../model/requests/FilterRequest").FilterItem} FilterItem
 */

/**
 * @callback EnumSetter
 * @param {EnumType} newVal
 */

/**
 * @callback EnumGetter
 * @param {string} name
 * @returns {EnumType}
 */

/**
 * @callback EnumList
 * @returns {EnumType[]}
 */

 /**
 * @param {object} props
 * @param {boolean} props.adjustMode
 * @param {FilterItem} props.filterItem
 * @param {object} props.filterState
 * @param {StateUpdater} props.updateFilterState
 * 
 */
export default function EnumPicker({
   adjustMode,
   filterItem,
   filterState,
   updateFilterState
}) {
   const enumType = filterItem.InitialValues['type']
   /** @type {[EnumType, any]} */
   const [localSelection, setLocalSelection] = useState(filterState[`${filterItem.Name}Selected`] || filterItem.InitialValues['selected'])

   useEffect(() => {
      try {
         if (filterItem.Validator({'selected':localSelection})) {
            updateFilterState(`${filterItem.Name}Selected`, localSelection);
         }
      }
      catch (error) {
         alert(error);
         return;
      }
   })

   const optionList = () => {
      const options = []
      enumType.EnumList().forEach((k) => {
         options.push(
               <option key={k.asString} value={k.asString}>{k.asDisplayString}</option>
         )
      })
      return options
   }

   if (adjustMode) {
      return(
         <div id={`${localSelection.constructor.name}Selector`} className="col">
            <div className="input-group">
                  <div className='text-base font-semibold mb-2'>Game</div>
                  <select
                     className="form-select block w-full"
                     value={localSelection.asString}
                     onChange={(e) => setLocalSelection(enumType.FromName(e.target.value))}>
                     <option> </option>
                     {optionList()}
                  </select>
            </div>
         </div>
      )
   }
   else {
      return(
         <div>
            <span className='font-medium '>{localSelection.asDisplayString}&nbsp;</span>
         </div>
      )
      // return <div>SelectionChoices</div>
   }
}
