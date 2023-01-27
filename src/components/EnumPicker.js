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
   const defaultSelection = enumType != null ? filterState[`${filterItem.Name}Selected`]
                         || filterItem.InitialValues['selected']
                         || enumType.EnumList()[0]
                         : "None";
   /** @type {[EnumType, any]} */
   const [localSelection, setLocalSelection] = useState(defaultSelection)
   console.log(`To start off, EnumPicker for filterItem ${filterItem.Name} has localSelection of ${localSelection}`)

   const optionList = () => {
      console.log(`In EnumPicker, the EnumList is: ${enumType.EnumList()}`)
      const options = enumType.EnumList().map((k) => {
         let next_key = `${filterItem.Name}${k.asString}`;
         return (<option key={next_key} value={k.asString}>{k.asDisplayString}</option>)
      })
      return options
   }

   const updateSelection = (e) => {
      setLocalSelection(enumType.FromName(e.target.value));
      try {
         if (filterItem.Validator({'selected':localSelection})) {
            updateFilterState(`${filterItem.Name}Selected`, localSelection);
         }
      }
      catch (error) {
         alert(error);
         return;
      }
   }

   if (adjustMode) {
      return(
         <div id={`${localSelection.constructor.name}Selector`} className="col">
            <div className="input-group">
                  <div className='text-base font-semibold mb-2'>Game</div>
                  <select
                     className="form-select block w-full"
                     value={localSelection.asString}
                     onChange={updateSelection}>
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
