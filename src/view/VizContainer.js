// global imports
import React, { useState, useEffect, useReducer } from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
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
 * VizContainer holds two pieces: A `Data Filter` and a `Visualizer`.
 * To communicate between the two, the Data Filter places key-value pairs into a state object.
 * This object is then used to generate an API request, to retrieve raw data.
 * The raw data and state are then passed into the Visualizer, which may take filtering hints from the state,
 * and will take what is needed from the raw data.
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
   const updateVisualizerRequestState = (new_state) => { console.log(`Caller updated VizContainer's visualizerRequestState to ${JSON.stringify(new_state)}`); setVisualizerRequestState(new_state); };
   const [request, setRequest] = useState(new InitialVisualizerRequest(updateVisualizerRequestState));

   const updateVisualizer = (new_visualizer) => {
      // clear state from last viz.
      setVisualizerRequestState({});
      // update the request type.
      switch (new_visualizer) {
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
      setVisualizer(new_visualizer)
   }

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
               setLoading(false)
            }
         }
         // if not found in storage, request dataset
         else {
               console.log(`fetching into ${api_request.LocalStorageKey}`)
               OGDAPI.fetch(api_request)
               .then(res => res.json())
               .then(data => {
                  if (data.status !== 'SUCCESS') throw data.msg
                  console.log(data)
                  // store data locally and in the state variable
                  localStorage.setItem(api_request.LocalStorageKey, JSON.stringify(data.val))
                  setRawData(data.val)
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
      if (!loading) {
         switch (visualizer) {
            case Visualizers.JOB_GRAPH:
               return (
                  <ErrorBoundary childName={"JobVisualizer"}>
                     <JobGraph
                        model={request.GetVisualizerModel(visualizerRequestState, rawData)}
                        setVisualizer={updateVisualizer}
                     />
                  </ErrorBoundary>
               )
            case Visualizers.PLAYER_TIMELINE:
               return (
                  <ErrorBoundary childName={"PlayerVisualizer"}>
                     <PlayerTimeline
                        model={request.GetVisualizerModel(visualizerRequestState, rawData)}
                        setVisualizer={updateVisualizer}
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
      else {
         return (
            <div>
               <Cog6ToothIcon className='animate-spin h-8 w-8' /> &nbsp;Please wait...
            </div>
         )
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
      <LoadingBlur loading={loading} height={8} width={8}/>
      <div className='container relative flex'>
         <div className="absolute left-0 max-w-72 max-h-full overflow-y-auto">
            <EnumPicker
               adjustMode={true}
               filterItem={dropdownFilterItem}
               filterState={{"selected":visualizer}}
               updateContainerState={(key, val) => {updateVisualizer(val)}}
               key="VizTypeDropdown"
            />
            <ErrorBoundary childName={"DataFilter or LoadingBlur"}>
               <DataFilter
                  filterRequest={request.GetFilterRequest()}
                  loading={loading}
                  updateData={retrieveData}
               />
            </ErrorBoundary>
         </div>
         <div className='container relative left-72 border shadow-sm'>
            { renderVisualizer() }
         </div>
      </div>
   </div>

   )
}