// global imports
import * as d3 from "d3";
import React, { useEffect, useState } from "react";
// local imports
import { useD3 } from "../../../controller/hooks/useD3";
import { JobGraphModel } from "../../../model/visualizations/JobGraphModel";
import PlayersList from "./PlayersList";
import ForceGraph from './forceGraph'
import JobGraphLegend from "./JobGraphLegend";
import { Visualizers } from "../../../model/enums/Visualizers";

/**
 * @typedef {import("../../../model/visualizations/VisualizerModel").default} VisualizerModel
 * @typedef {import("../../../typedefs").JobGraphSetter} JobGraphSetter
 * @typedef {import("../../../typedefs").StringSetter} StringSetter
 * @typedef {import("../../../typedefs").StringListSetter} StringListSetter
 * @typedef {import("../../../typedefs").SetterCallback} SetterCallback
 */

/**
 * force directed graph component for job/mission level data
 * @param {object} props raw data JSON object 
 * @param {object[]} props.items
 * @param {string} props.linkMode
 * @param {StringSetter} props.updateLinkMode
 * @returns 
 */
export default function ModePicker({ items, linkMode, updateLinkMode }) {

   /* manipulate raw data to a format to be used by the vis views */
   const radioList = items.map((item) => {
      return (
         <div>
            <label className="inline-flex items-center">
               <input
                     className="form-radio"
                     type="radio"
                     name="radio-direct"
                     checked={linkMode === item['name']}
                     onChange={(e) => { updateLinkMode(e.currentTarget.value) }}
                     value={item['name']} />
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