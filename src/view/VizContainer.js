// global imports
import React, { useState, useEffect, useReducer } from 'react';
// local imports
import { vis_games } from '../config';
import LargeButton from '../components/buttons/LargeButton';
import LoadingBlur from '../components/LoadingBlur';

// model imports
import { ViewModes } from '../model/ViewModes';
import { InitialVisualizerModel } from '../model/visualizations/InitialVisualizerModel'
import { JobGraphModel } from '../model/visualizations/JobGraphModel';
import { PlayerTimelineModel } from '../model/visualizations/PlayerTimelineModel';
import Timedelta from '../model/Timedelta';

// controller imports
import { PopulationSelectionOptions } from '../controller/SelectionOptions';
import { FilterOptions } from '../controller/FilterOptions';
import { OGDAPI } from '../controller/apis/OGDAPI';

// view imports
import DataFilter from './DataFilter/DataFilter';
import InitialVisualizer from './visualizations/InitialVisualizer';
import JobVisualizer from './visualizations/JobGraph/JobVisualizer';
import PlayerVisualizer from './visualizations/PlayerTimeline/PlayerVisualizer';

/**
 * @typedef {import('../typedefs').ViewModeSetter} ViewModeSetter
 * @typedef {import('../typedefs').FeaturesMap} FeaturesMap
 * @typedef {import('../typedefs').FeatureMapSetter} FeatureMapSetter
 * @typedef {import('../typedefs').ElementRenderer} ElementRenderer
 * @typedef {import('../typedefs').ElementSetter} ElementSetter
 */

/**
 * 
 * @param {*} props 
 * @returns 
 */
export default function VizContainer(props) {
   // data loading vars
   const [loading, setLoading] = useState(false);
   const [viewData, setViewData] = useState(null);
   const [rawData, setRawData] = useState(null);
   const [filterOptions, setFilterOptions] = useState(new FilterOptions(0, new Timedelta(), new Timedelta(24)));
   const [selectionOptions, setSelectionOptions] = useState(
      new PopulationSelectionOptions(
         vis_games[0],
         null, null,
         null, null,
         new Date(), new Date()
      )
   );
   // data view vars
   /** @type {[ViewModes, ViewModeSetter]} */
   const [viewMode, setViewMode] = useState(ViewModes.INITIAL);
   /** @type {[FeaturesMap, FeatureMapSetter]} */
   const [viewFeatures, setViewFeatures] = useState(InitialVisualizerModel.RequiredExtractors())

   useEffect(() => {
      retrieveData();
   }, [selectionOptions])

   // TODO: Whenever there's a change in filtering or underlying data, refresh the view data.
   useEffect(() => {
      console.warn("Filtering of data on client side is not yet implemented!");
      setViewData(rawData);
   }, [filterOptions, rawData]);

   // When view mode changes, update the list of features to request.
   useEffect(() => {
      switch (viewMode) {
         case ViewModes.POPULATION:
            setViewFeatures(JobGraphModel.RequiredExtractors());
         break;
         case ViewModes.PLAYER:
            setViewFeatures(PlayerTimelineModel.RequiredExtractors());
         break;
         case ViewModes.SESSION:
            // TODO: once there's something above, need corresponding class here.
            setViewFeatures(InitialVisualizerModel.RequiredExtractors());
         break;
         case ViewModes.INITIAL:
         default:
            setViewFeatures(InitialVisualizerModel.RequiredExtractors());
         break;
      }
   }, [viewMode])

   const retrieveData = () => {
        // flush current dataset and start loading animation
        setRawData(null)
        setViewData(null)
        setLoading(true)

        const localData = localStorage.getItem(selectionOptions.ToLocalStorageKey())
        // console.log(localData)
        if (localData) {
         // if query found in storage, retreive JSON
            setRawData(JSON.parse(localData)) 
            // stop loading animation
            setLoading(false)
        }
        // if not found in storage, request dataset
        else {
            console.log('fetching:', selectionOptions.ToLocalStorageKey())

            OGDAPI.fetch(viewMode, selectionOptions, viewFeatures)
            .then(res => res.json())
            .then(data => {
               if (data.status !== 'SUCCESS') throw data.msg
               console.log(data)
               // store data locally and in the state variable
               localStorage.setItem(selectionOptions.ToLocalStorageKey(), JSON.stringify(data.val))
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

   const renderVisualizer = () => {
      switch (viewMode) {
         case ViewModes.POPULATION:
            return (
               <JobVisualizer
                  rawData={viewData}
                  setViewMode={setViewMode}
               />
            )
         case ViewModes.PLAYER:
            return (
                  <PlayerVisualizer
                     rawData={viewData}
                     setViewMode={setViewMode}
                     selectedGame={selectionOptions.game_name}
                  />
               )
         case ViewModes.SESSION:
         // TODO: put in something here, maybe it's even the timeline...?
            return (
                  <div>No Viz for Session View</div>
               );
         case ViewModes.INITIAL:
         default:
            return (
                  <InitialVisualizer/>
               );
      }
   }

   return (
   <div className='w-screen'>
      {/* For DEBUG purpose, remove in production */}
      <div className='fixed top-0 right-1/2 z-10'>
         <LargeButton
            selected={false}
            label='clear cache'
            onClick={() => {
               localStorage.clear()
               alert('localStorage reset')
            }}
         />
      </div>
      <DataFilter
         loading={loading}
         viewMode={viewMode}
         containerSelection={selectionOptions}
         setContainerSelection={setSelectionOptions}
         containerFilter={filterOptions}
         setContainerFilter={setFilterOptions}
      />
      <LoadingBlur loading={loading} height={10} width={10}/>
      { renderVisualizer() }
   </div>

   )
}