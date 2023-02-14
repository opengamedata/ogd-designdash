// global imports
import React from "react";
// local imports

/**
 * @typedef {import("../../typedefs").StringSetter} StringSetter
 */

/**
 * Item picker that displays all options as radio buttons.
 * @param {object}       props raw data JSON object 
 * @param {object[]}     props.items
 * @param {string}       props.linkMode
 * @param {StringSetter} props.updateLinkMode
 * @returns {React.ReactElement}
 */
export default function RadioPicker(props) {
   const { items, linkMode, updateLinkMode } = props;

   /* manipulate raw data to a format to be used by the vis views */
   const radioList = items.map((item) => {
      return (
         <div key={`'${item['name']}Radio'`}>
            <label className="inline-flex items-center">
               <input
                     className="form-radio"
                     type="radio"
                     name="radio-direct"
                     checked={linkMode === item['name']}
                     onChange={(e) => { updateLinkMode(e.currentTarget.value) }}
                     value={item['name']}
               />
               <span className="ml-2">{item['readable']}</span>
            </label>
         </div>
      )
   })
   // render component
   return (
      <>
         {/* path type 3-way selection */}
         <div className="mt-2">
            {radioList}
         </div>
      </>
   );
}