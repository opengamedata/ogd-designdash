// global imports
import { React, useState, useEffect, alert, useReducer } from 'react';
// local imports
import { vis_games } from '../config';
import LargeButton from '../components/buttons/LargeButton';
import LoadingBlur from '../components/LoadingBlur';

// model imports
import { ViewModes } from '../model/ViewModes';
import { InitialVisualizerModel } from '../model/visualizations/InitialVisualizerModel'
import { JobGraphModel } from '../model/visualizations/JobGraphModel';
import { PlayerTimelineModel } from '../model/visualizations/PlayerTimelineModel';
import { OGDPopulationAPI } from '../model/apis/OGDPopulationAPI';
import { OGDPlayerAPI } from '../model/apis/OGDPlayerAPI';
import { OGDSessionAPI } from '../model/apis/OGDSessionAPI';

// controller imports
import { PopulationSelectionOptions } from '../controller/SelectionOptions';
import { FilterOptions } from '../controller/FilterOptions';

// view imports
import DataFilter from './DataFilter/DataFilter';
import InitialVisualizer from './visualizations/InitialVisualizer';
import JobVisualizer from './visualizations/JobGraph/JobVisualizer';
import PlayerVisualizer from './visualizations/PlayerTimeline/PlayerVisualizer';

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
   const [filterOptions, setFilterOptions] = useState(new FilterOptions(0, null, null));
   const [selectionOptions, setSelectionOptions] = useState(
      new PopulationSelectionOptions(
         vis_games[0],
         null, null,
         null, null,
         new Date(), new Date()
      )
   );
   // data view vars
   const [viewMode, setViewMode] = useState(ViewModes.INITIAL);
   const [viewRenderer, setViewRenderer] = useState(() => {return (<InitialVisualizer/>)})
   const [viewModel, setViewModel] = useState(InitialVisualizerModel)
   const [viewAPI, setViewAPI] = useState(OGDPopulationAPI)

   useEffect(() => {
      retrieveData();
   }, [selectionOptions])

   // TODO: Whenever there's a change in filtering or underlying data, refresh the view data.
   useEffect(() => {
      console.warn("Filtering of data on client side is not yet implemented!");
      setViewData(rawData);
   }, [filterOptions, rawData]);

   useEffect(() => {
      updateView();
   }, [viewMode])

   const updateView = () => {
      switch (viewMode) {
         case ViewModes.POPULATION:
            setViewRenderer(() => {
               return (
                  <JobVisualizer
                     rawData={viewData}
                     setViewMode={setViewMode}
                  />
               )
            });
            setViewModel(JobGraphModel);
            setViewAPI(OGDPopulationAPI)
         break;
         case ViewModes.PLAYER:
            setViewRenderer(() => {
               return (
                     <PlayerVisualizer
                        rawData={viewData}
                        setViewMode={setViewMode}
                        selectedGame={selectionOptions.game_name}
                     />
                  )
            });
            setViewModel(PlayerTimelineModel);
            setViewAPI(OGDPlayerAPI)
         break;
         case ViewModes.SESSION:
            setViewRenderer(() => {
               return (
                     <div>No Viz for Session View</div>
                  )
            });
            setViewModel(InitialVisualizerModel);
            setViewAPI(OGDSessionAPI);
         break;
         case ViewModes.INITIAL:
         default:
            setViewRenderer(() => {
               return (
                     <InitialVisualizer/>
                  )
            });
            setViewModel(InitialVisualizerModel);
            setViewAPI(OGDPopulationAPI)
         break;
      }
   }

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

            viewAPI.fetch(selectionOptions, viewModel.RequiredExtractors())
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
      { viewRenderer() }
   </div>

   )
}