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

   // If adjustMode changes, reset selections from current container selection
   useEffect(() => {
      filterRequest.updateRequesterState(localState)
      console.log(`In DataFilter, adjustMode changed, updated requester's state to ${localState}`)
   }, [adjustMode])

   // If loading changes to false, we are not adjusting and should return to false (resetting selections/filters)
   useEffect(() => {
      if (!loading) setAdjustMode(false)
   }, [loading])

   // const adjust = () => {
   //    // if empty fields, prompt user to fill in the blanks & return
   //    // if (!(game && version && startDate && endDate && minPlaytime >= 0 && maxPlaytime)) {
   //    if (!gameSelected) {
   //          // prompt user
   //          alert('make sure a game has been selected!');
   //          return;
   //    }
   //    if (startDate > endDate) {
   //       alert("The start date must not be later than the end date!")
   //       return;
   //    }
   //    // if end date later than yesterday, raise warnings & return
   //    const today = new Date();
   //    const queryEnd = new Date(endDate)
   //    // console.log(today, queryEnd)
   //    // console.log(today - queryEnd)
   //    if (today.getTime() - queryEnd.getTime() <= 1000 * 60 * 60 * 24) {
   //          alert('select an end date that\'s prior to yesterday')
   //          return
   //    }
   //    if (minAppVersion !== null && maxAppVersion !== null && minAppVersion > maxAppVersion) {
   //       alert('The minimum App version must be less than the maximum!')
   //       return
   //    }
   //    if (minLogVersion !== null && maxLogVersion !== null && minLogVersion > maxLogVersion) {
   //       alert('The minimum log version must be less than the maximum!')
   //       return
   //    }
   //    if (minPlaytime !== null && maxPlaytime !== null && minPlaytime > maxPlaytime) {
   //       alert('The minimum play time must be less than the maximum!')
   //       return
   //    }
   // }
   
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
   const RenderDropdown = (item) => {
      switch (item.ValueMode) {
         case ValueModes.ENUM:
            return (
               <EnumPicker
                  adjustMode={adjustMode}
                  filterItem={item}
                  filterState={localState}
                  updateFilterState={updateFilterState}
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
      switch (item.ValueMode) {
         case ValueModes.ENUM:
         case ValueModes.DATE:
         case ValueModes.NUMBER:
         case ValueModes.TEXT:
         case ValueModes.TIME:
         default:
            return (<div>Value Mode not supported for Input: {item.ValueMode.asString}</div>)
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
            return (
               <div id="DateRange">
                  <RangePicker
                     adjustMode={adjustMode}
                     filterItem={item}
                     filterState={localState}
                     updateFilterState={updateFilterState}
                  />
               </div>
            )
         break;
         case InputModes.SEPARATOR:
            return ( <hr style={{margin: "10px 0px"}}/> )
         break;
         default:
            return ( <div>Invalid Input Mode: {item.InputMode.asString}</div> );
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
            return (<XMarkIcon className="cursor-pointer h-5 w-5" onClick={() => setAdjustMode(false)} />);
         }
         else {
            return (<></>);
         }
      }
      else {
         // If not in adjustment mode, show "adjustments" button to expand the filter.
         return (<AdjustmentsVerticalIcon className="cursor-pointer h-5 w-5" onClick={() => setAdjustMode(true)} />);
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
