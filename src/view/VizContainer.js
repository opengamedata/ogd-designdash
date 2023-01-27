// global imports
import React, { useState, useEffect, useReducer } from 'react';
// local imports
import { ErrorBoundary } from '../components/ErrorBoundary';
import LoadingBlur from '../components/LoadingBlur';

// model imports
import { Visualizers } from '../model/enums/Visualizers';
import InitialVisualizerRequest from '../model/requests/InitialVisualizerRequest';

// controller imports
import { OGDAPI } from '../controller/apis/OGDAPI';

// view imports
import DataFilter from './DataFilter/DataFilter';
import InitialVisualizer from './visualizations/InitialVisualizer';
import JobVisualizer from './visualizations/JobGraph/JobVisualizer';
import PlayerVisualizer from './visualizations/PlayerTimeline/PlayerVisualizer';

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

   useEffect(() => {
      console.log(`Viz request state changed to ${visualizerRequestState}, calling retrieveData...`)
      retrieveData();
   }, [visualizerRequestState])

   // TODO: Whenever there's a change in filtering or underlying data, refresh the view data.
   // useEffect(() => {
   //    console.warn("Filtering of data on client side is not yet implemented!");
   //    setViewData(rawData);
   // }, [filterOptions, rawData]);

   const retrieveData = () => {
      console.log("Retrieving data...")
      // flush current dataset and start loading animation
      setRawData(null)
      setLoading(true)

      const api_request = request.GetAPIRequest();
      if (api_request != null) {
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
                  <JobVisualizer
                     rawData={rawData}
                     setViewMode={setViewMode}
                  />
               </ErrorBoundary>
            )
         case Visualizers.PLAYER_TIMELINE:
            return (
               <ErrorBoundary childName={"PlayerVisualizer"}>
                  <PlayerVisualizer
                     rawData={rawData}
                     setViewMode={setViewMode}
                     selectedGame={selectionOptions.game_name}
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

   const styling = {
      gridColumn: props.column,
      gridRow: props.row
   }
   return (
   <div className='flex-auto border-4 border-red-700' style={styling}>
      <div className='container relative flex'>
         <div className="absolute left-0 max-w-96 max-h-full overflow-y-auto">
            <ErrorBoundary childName={"DataFilter or LoadingBlur"}>
               <DataFilter
                  loading={loading}
                  viewMode={viewMode}
                  containerSelection={selectionOptions}
                  setContainerSelection={(opts) => { console.log("DataFilter called setSelectionOptions"); setSelectionOptions(opts)}}
                  containerFilter={filterOptions}
                  setContainerFilter={(opts) => { console.log("DataFilter called setFilterOptions"); setFilterOptions(opts)}}
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