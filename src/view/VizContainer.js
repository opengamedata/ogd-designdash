// global imports
import React, { useState, useEffect, useReducer } from 'react';
// local imports
import { ErrorBoundary } from '../components/ErrorBoundary';
import LoadingBlur from '../components/LoadingBlur';
import EnumPicker from '../components/EnumPicker';

// model imports
import { Visualizers } from '../model/enums/Visualizers';
import InitialVisualizerRequest from '../model/requests/InitialVisualizerRequest';
import JobGraphRequest from '../model/requests/JobGraphRequest';
import PlayerTimelineRequest from '../model/requests/PlayerTimelineRequest';

// controller imports
import { OGDAPI } from '../controller/apis/OGDAPI';

// view imports
import DataFilter from './DataFilter/DataFilter';
import InitialVisualizer from './visualizations/InitialVisualizer';
import JobGraph from './visualizations/JobGraph/JobGraph';
import PlayerTimeline from './visualizations/PlayerTimeline/PlayerTimeline';
import { FilterItem, InputModes, ValueModes } from '../model/requests/FilterRequest';

/**
 * @typedef {import('../typedefs').VisualizerSetter} VisualizerSetter
 * @typedef {import('../typedefs').FeaturesMap} FeaturesMap
 * @typedef {import('../typedefs').FeatureMapSetter} FeatureMapSetter
 * @typedef {import('../typedefs').ElementRenderer} ElementRenderer
 * @typedef {import('../typedefs').ElementSetter} ElementSetter
 */

/**
 * 
 * @param {object} props 
 * @param {number} props.column
 * @param {number} props.row
 * @returns 
 */
export default function VizContainer(props) {
   // data loading vars
   const [loading, setLoading] = useState(false);
   const [rawData, setRawData] = useState(null);
   // data view vars
   /** @type {[Visualizers, VisualizerSetter]} */
   const [visualizer, setVisualizer] = useState(Visualizers.INITIAL);
   const [visualizerRequestState, setVisualizerRequestState] = useState({});
   const [request, setRequest] = useState(new InitialVisualizerRequest(setVisualizerRequestState));
   const [pickerState, setPickerState] = useState({})

   const updateVisualizerRequestState = (value) => {
      setVisualizerRequestState(value);
      console.log(`Viz request state changed to ${visualizerRequestState}, calling retrieveData...`)
      retrieveData();
   }

   const updatePickerState = (value) => {
      setPickerState(value);
      console.log(`pickerState changed to ${pickerState}, setting up new request...`)
      // update the request type.
      const selection = pickerState['selected']
      switch (selection) {
         case Visualizers.JOB_GRAPH:
            setVisualizer(selection);
         break;
         case Visualizers.PLAYER_TIMELINE:
            setVisualizer(selection);
         break;
         case Visualizers.INITIAL:
         default:
            setVisualizer(selection);
         break;
      }
   }

   useEffect(() => {
      console.log(`visualizer changed to ${visualizer.asDisplayString}, setting up new request...`)
      // clear state from last viz.
      setVisualizerRequestState({});
      // update the request type.
      const selection = pickerState['selected']
      switch (selection) {
         case Visualizers.JOB_GRAPH:
            setRequest(new JobGraphRequest(updateVisualizerRequestState))
         break;
         case Visualizers.PLAYER_TIMELINE:
            setRequest(new PlayerTimelineRequest(updateVisualizerRequestState))
         break;
         case Visualizers.INITIAL:
         default:
            setRequest(new InitialVisualizerRequest(updateVisualizerRequestState));
         break;
      }
   }, [visualizer]);

   // TODO: Whenever there's a change in filtering or underlying data, refresh the view data.
   // useEffect(() => {
   //    console.warn("Filtering of data on client side is not yet implemented!");
   //    setViewData(rawData);
   // }, [filterOptions, rawData]);

   const retrieveData = () => {
      console.log("Retrieving data...")
      // flush current dataset and start loading animation
      setRawData(null)

      const api_request = request.GetAPIRequest(visualizerRequestState);
      if (api_request != null) {
         setLoading(true)
         const localData = localStorage.getItem(api_request.LocalStorageKey)
         // console.log(localData)
         if (localData) {
            try {
               console.log(`Found ${api_request.LocalStorageKey} in the cache`)
               // if query found in storage, retreive JSON
               setRawData(JSON.parse(localData)) 
            }
            catch (err) {
               console.error(`Local data (${localData}) was not valid JSON!\nResulted in error ${err}`)
            }
            finally {
               // stop loading animation
               setLoading(false)
            }
         }
         // if not found in storage, request dataset
         else {
               console.log('fetching:', api_request.LocalStorageKey)

               OGDAPI.fetch(api_request)
               .then(res => res.json())
               .then(data => {
                  if (data.status !== 'SUCCESS') throw data.msg
                  console.log(data)
                  // store data locally and in the state variable
                  localStorage.setItem(api_request.LocalStorageKey, JSON.stringify(data.val))
                  setRawData(data.val)
                  // stop loading animation
                  setLoading(false)
               })
               .catch(error => {
                  console.error(error)
                  setLoading(false)
                  alert(error)
               })
         }
      }
      else {
         console.log(`No API request for ${request}`)
      }
   }

   const renderVisualizer = () => {
      switch (visualizer) {
         case Visualizers.JOB_GRAPH:
            return (
               <ErrorBoundary childName={"JobVisualizer"}>
                  <JobGraph
                     model={request.GetVisualizerModel(visualizerRequestState, rawData)}
                     setVisualizer={setVisualizer}
                  />
               </ErrorBoundary>
            )
         case Visualizers.PLAYER_TIMELINE:
            return (
               <ErrorBoundary childName={"PlayerVisualizer"}>
                  <PlayerTimeline
                     model={request.GetVisualizerModel(visualizerRequestState, rawData)}
                     setVisualizer={setVisualizer}
                  />
               </ErrorBoundary>
            )
         case Visualizers.INITIAL:
         default:
            return (
               <ErrorBoundary childName={"InitialVisualizer"}>
                  <InitialVisualizer/>
               </ErrorBoundary>
            );
      }
   }

   const dropdownFilterItem = new FilterItem(
      "VizPicker",
      InputModes.DROPDOWN,
      ValueModes.ENUM,
      {'type':Visualizers, 'selected':visualizer}
   )
   const styling = {
      gridColumn: props.column,
      gridRow: props.row
   }
   return (
   <div className='flex-auto border-4 border-red-700' style={styling}>
      <div className='container relative flex'>
         <div className="absolute left-0 max-w-96 max-h-full overflow-y-auto">
            <EnumPicker
               adjustMode={true}
               filterItem={dropdownFilterItem}
               filterState={pickerState}
               updateFilterState={updatePickerState}
               key="VizTypeDropdown"
            />
            <ErrorBoundary childName={"DataFilter or LoadingBlur"}>
               <DataFilter
                  filterRequest={request.GetFilterRequest()}
                  loading={loading}
                  updateData={retrieveData}
               />
               <LoadingBlur loading={loading} height={10} width={10}/>
            </ErrorBoundary>
         </div>
         <div className='container relative left-72 border shadow-sm'>
            { renderVisualizer() }
         </div>
      </div>
   </div>

   )
}