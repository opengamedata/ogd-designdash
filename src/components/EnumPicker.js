// global imports
import React from 'react';
import { useEffect, useState } from 'react';
// local imports

/**
 * @typedef {import("../model/enums/EnumType").default} EnumType
 * @typedef {import("../typedefs").MapSetter} MapSetter
 * @typedef {import("../controller/requests/FilterRequest").FilterItem} FilterItem
 */

/**
 * @callback EnumList
 * @returns {EnumType[]}
 */

 /**
 * @param {object} props
 * @param {boolean} props.adjustMode
 * @param {FilterItem} props.filterItem
 * @param {MapSetter} props.mergeContainerState
 * @param {string} props.key
 */
export default function EnumPicker(props) {
   const {
      adjustMode,
      filterItem,
      mergeContainerState
   } = props;
   const select_key = `${filterItem.Name}Selected`;
   const type_key = `${filterItem.Name}Type`

   const enumType = filterItem.InitialValues[type_key]
   console.log(`In EnumPicker, initial values are: ${JSON.stringify(filterItem.InitialValues)}`)

   const initialSelection = filterItem.InitialValues[select_key]
                         || (enumType != null ? enumType.EnumList()[0] : "Empty");

   /** @type {[EnumType, any]} */
   const [localSelection, setLocalSelection] = useState(initialSelection)
   const setSelection = (value) => {
      const newSelection = enumType.FromName(value)
      setLocalSelection(newSelection);
      if (filterItem.Validator({'selected':newSelection})) {
         console.log(`Validated new selection for ${filterItem.Name}, about to call the updateContainerState with ${newSelection}`)
         mergeContainerState({ [`${filterItem.Name}Selected`] : newSelection });
      }
   }
   // console.log(`To start off, EnumPicker for filterItem ${filterItem.Name} has localSelection of ${localSelection}`)

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
                        onChange={(e) => {setSelection(e.target.value)}}>
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
