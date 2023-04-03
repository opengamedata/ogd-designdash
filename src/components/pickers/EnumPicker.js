// global imports
import React, { useState } from 'react';

/**
 * @typedef {import("../../enums/EnumType").default} EnumType
 * @typedef {import("../../requests/FilterRequest").FilterItem} FilterItem
 * @typedef {import("../../typedefs").MapSetter} MapSetter
 */

 /**
 * @param {object}     props
 * @param {boolean}    props.adjustMode
 * @param {FilterItem} props.filterItem
 * @param {MapSetter}  props.mergeContainerState
 * @returns {React.ReactElement}
 */
export default function EnumPicker(props) {
   const { adjustMode, filterItem, mergeContainerState } = props;

   const select_key = `${filterItem.Name}Selected`;
   const type_key = `${filterItem.Name}Type`

   const enumType         = filterItem.InitialValues[type_key]
   const initialSelection = filterItem.InitialValues[select_key]
                         || (enumType != null ? enumType.Default() : "Empty");

   /** @type {[EnumType, any]} */
   const [localSelection, setLocalSelection] = useState(initialSelection)
   const setSelection = (value) => {
      /** @type {EnumType} */
      const newSelection = enumType.FromName(value)
      // console.log(`In EnumPicker, the new selection is ${newSelection}, derived from value ${JSON.stringify(value)}`)
      if (filterItem.Validator({'selected':newSelection})) {
         setLocalSelection(newSelection);
         mergeContainerState({ [`${filterItem.Name}Selected`] : newSelection });
      }
   }

   const _renderPicker = () => {
         /**
          * @callback genOption
          * @param {EnumType} enum_item 
          * @returns 
          */
         const genOption = (enum_item) => {
            return (
               <option key={`${filterItem.Name}${enum_item.asString}`} value={enum_item.asString}>
                  {enum_item.asDisplayString}
               </option>)
         }
         return(
            <div id={`${localSelection.constructor.name}Selector`} className="col">
               <div className="input-group">
                     <div className='text-base font-semibold mb-2'>{filterItem.Name}</div>
                     <select
                        className="form-select block w-full"
                        value={`${localSelection.asString}`}
                        onChange={(e) => {setSelection(e.target.value)}}>
                        {enumType.EnumList().map(genOption)}
                     </select>
               </div>
            </div>
         )
   }

   const _renderChoice = () => {
      return (
         <div id={`${localSelection.constructor.name}Choice`} className="col">
            <span className='font-medium '>{localSelection.asDisplayString}&nbsp;</span>
         </div>
   )}

   if (enumType != undefined) {
      if (adjustMode) {
         return _renderPicker();
      }
      else {
         return _renderChoice();
      }
   }
   else {
      return(
         <div>Invalid EnumPicker, <code>enumType</code> is <code>{enumType}</code>!</div>
      )
   }
}
