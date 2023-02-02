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
 * @callback EnumList
 * @returns {EnumType[]}
 */

 /**
 * @param {object} props
 * @param {boolean} props.adjustMode
 * @param {FilterItem} props.filterItem
 * @param {object} props.filterState
 * @param {StateUpdater} props.updateContainerState
 * @param {string} props.key
 */
export default function EnumPicker(props) {
   let {
      adjustMode,
      filterItem,
      filterState,
      updateContainerState
   } = props;
   const enumType = filterItem.InitialValues['type']
   const defaultSelection = enumType != null ? filterState[`${filterItem.Name}Selected`]
                         || filterItem.InitialValues['selected']
                         || enumType.EnumList()[0]
                         : "Empty";
   /** @type {[EnumType, any]} */
   const [localSelection, setLocalSelection] = useState(defaultSelection)

   // console.log(`To start off, EnumPicker for filterItem ${filterItem.Name} has localSelection of ${localSelection}`)
   const updateSelection = (value) => {
      const newSelection = enumType.FromName(value)
      setLocalSelection(newSelection);
      if (filterItem.Validator({'selected':newSelection})) {
         console.log(`Validated new selection for ${filterItem.Name}, about to call the updateContainerState with ${newSelection}`)
         updateContainerState(`${filterItem.Name}Selected`, newSelection);
      }
   }

   if (enumType != undefined) {
      if (adjustMode) {
         const optionList = enumType.EnumList().map((k) => {
            return (
               <option key={`${filterItem.Name}${k.asString}`} value={k.asString}>
                  {k.asDisplayString}
               </option>)
         })

         return(
            <div id={`${localSelection.constructor.name}Selector`} className="col">
               <div className="input-group">
                     <div className='text-base font-semibold mb-2'>{filterItem.Name}</div>
                     <select
                        className="form-select block w-full"
                        value={`${localSelection.asString}`}
                        onChange={(e) => {updateSelection(e.target.value)}}>
                        {/* <option key="Empty"> </option> */}
                        {optionList}
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
   else {
      return(
         <div>Invalid EnumPicker, <code>enumType</code> is <code>{enumType}</code>!</div>
      )
   }
}
