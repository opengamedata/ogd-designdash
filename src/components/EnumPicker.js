// global imports
import React from 'react';
// local imports

/**
 * @typedef {import("../model/enums/EnumType").default} EnumType
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
 * @param {object} props.enumType
 * @param {EnumList} props.enumType.EnumList
 * @param {EnumGetter} props.enumType.FromName
 * @param {EnumType} props.selected
 * @param {EnumSetter} props.setSelected
 */
export default function EnumPicker({
   adjustMode,
   enumType,
   selected,
   setSelected
}) {
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
         <div id={`${selected.constructor.name}Selector`} className="col">
            <div className="input-group">
                  <div className='text-base font-semibold mb-2'>Game</div>
                  <select
                     className="form-select block w-full"
                     value={selected.asString}
                     onChange={(e) => setSelected(enumType.FromName(e.target.value))}>
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
            <span className='font-medium '>{selected.asDisplayString}&nbsp;</span>
         </div>
      )
      // return <div>SelectionChoices</div>
   }
}
