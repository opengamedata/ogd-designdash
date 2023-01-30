// global imports
import React from 'react';
import { AdjustmentsVerticalIcon, XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
// local imports
import LargeButton from '../../components/buttons/LargeButton';
import RangePicker from '../../components/RangePicker';
import EnumPicker from '../../components/EnumPicker';
//    model imports
import { InputModes, ValueModes } from '../../model/requests/FilterRequest';

/**
 * @typedef {import("../../typedefs").SetterCallback} SetterCallback
 * @typedef {import("../../model/requests/FilterRequest").FilterRequest} FilterRequest
 * @typedef {import("../../model/requests/FilterRequest").FilterItem} FilterItem
 */

 /**
 * @param {object} props
 * @param {FilterRequest} props.filterRequest
 * @param {boolean} props.loading
 * @param {function} props.updateData
 */
export default function DataFilter({ filterRequest, loading, updateData }) {
   let yesterday = new Date();
   yesterday.setDate(yesterday.getDate() - 1);

   const [localState, setLocalState] = useState({});

   // adjustMode indicates whether the filtering box is expanded to make selections, or not.
   const [adjustMode, setAdjustMode] = useState(false);
   const updateAdjustMode = (value) => {
      setAdjustMode(value);
      filterRequest.updateRequesterState(localState)
      console.log(`In DataFilter, adjustMode changed, updated requester's state to ${JSON.stringify(localState)}`)
   }

   // Follow dumb-looking approach from react docs for doing something when a prop changes,
   // by keeping previous value as a state variable. Seems hacky and dumb, but whatever.
   const [wasLoading, setWasLoading] = useState(loading);
   if (loading !== wasLoading) {
      if (!loading) {
         setAdjustMode(false);
      }
      setWasLoading(loading);
   }
   // If loading changes to false, we are not adjusting and should return to false (resetting selections/filters)
   // useEffect(() => {
   //    if (!loading) setAdjustMode(false)
   // }, [loading])
   
   /**
    * 
    * @param {string} key 
    * @param {any} val 
    */
   const updateFilterState = (key, val) => {
      let localCopy = localState; localCopy[key] = val; setLocalState(localCopy);
   }

   /**
    * 
    * @param {FilterItem} item 
    */
   const RenderRange = (item) => {
      const key = `${item.Name}Range`;
      return (
         <div id={key}>
            <RangePicker
               adjustMode={adjustMode}
               filterItem={item}
               filterState={localState}
               updateFilterState={updateFilterState}
               key={key}
            />
         </div>
      )
   }

   /**
    * 
    * @param {FilterItem} item 
    */
   const RenderDropdown = (item) => {
      const key = `${item.Name}Dropdown`
      switch (item.ValueMode) {
         case ValueModes.ENUM:
            return (
               <EnumPicker
                  adjustMode={adjustMode}
                  filterItem={item}
                  filterState={localState}
                  updateContainerState={updateFilterState}
                  key={key}
               />
            )
         break;
         case ValueModes.DATE:
         case ValueModes.NUMBER:
         case ValueModes.TEXT:
         case ValueModes.TIME:
         default:
            return (<div>Value Mode not supported for Dropdown: {item.ValueMode.asString}</div>)
         break;
      }
   }

   /**
    * 
    * @param {FilterItem} item 
    */
   const RenderInput = (item) => {
      const key = `${item.Name}Input`;
      switch (item.ValueMode) {
         case ValueModes.ENUM:
         case ValueModes.DATE:
         case ValueModes.NUMBER:
         case ValueModes.TEXT:
         case ValueModes.TIME:
         default:
            return (<div key={key}>Value Mode not supported for Input: {item.ValueMode.asString}</div>)
         break;
      }
   }

   /**
    * 
    * @param {FilterItem} item 
    */
   const RenderItem = (item) => {
      switch (item.InputMode) {
         case InputModes.DROPDOWN:
            return RenderDropdown(item);
         break;
         case InputModes.INPUT:
            return RenderInput(item);
         break;
         case InputModes.RANGE:
            return RenderRange(item)
         break;
         case InputModes.SEPARATOR:
            return ( <hr style={{margin: "10px 0px"}}/> )
         break;
         default:
            const key = `${item.Name}Invalid`;
            return ( <div key={key}>Invalid Input Mode: {item.InputMode.asString}</div> );
         break;
      }
   }


   const filterElements = filterRequest.Items.map(
      (item) => RenderItem(item)
   )

   const renderToggleButton = () => {
      if (adjustMode) {
         if (!loading) {
            // If in adjustment mode, and not currently loading, then we'll have expanded view so show an X.
            return (<XMarkIcon className="cursor-pointer h-5 w-5" onClick={() => updateAdjustMode(false)} />);
         }
         else {
            return (<></>);
         }
      }
      else {
         // If not in adjustment mode, show "adjustments" button to expand the filter.
         return (<AdjustmentsVerticalIcon className="cursor-pointer h-5 w-5" onClick={() => updateAdjustMode(true)} />);
      }
   }

   // console.log(`In DataFilter, just before returning, viewMode is ${viewMode.asString}`)
   return (
      <div className='bg-white border shadow-sm px-4'>
         <div className='flex justify-between mb-2'>
            { renderToggleButton() }
         </div>
         {filterElements}
         <div className='flex space-x-2 items-center'>
            {loading ?
               <><Cog6ToothIcon className='animate-spin h-8 w-8' /> &nbsp;Please wait...</>
               :
               <LargeButton label='visualize' onClick={updateData} selected="false"/>
            }
         </div>
      </div>
   )
}
