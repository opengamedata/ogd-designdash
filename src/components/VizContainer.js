// global imports
import React, { useState, useEffect, useReducer } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
// local imports
import { ErrorBoundary } from "../components/ErrorBoundary";
import LoadingBlur from "../components/LoadingBlur";
import EnumPicker from "../components/pickers/EnumPicker";
import ValueModes from "../enums/ValueModes";

// api imports
import { OGDAPI } from "../apis/OGDAPI";

// controller imports
import { Visualizers } from "../enums/Visualizers";
import InitialVisualizerRequest from "../visualizers/InitialVisualizer/InitialVisualizerRequest";
import JobGraphRequest from "../visualizers/JobGraph/JobGraphRequest";
import PlayerTimelineRequest from "../visualizers/PlayerTimeline/PlayerTimelineRequest";

// view imports
import DataFilter from "./DataFilter/DataFilter";
import InitialVisualizer from "../visualizers/InitialVisualizer/InitialVisualizer";
import JobGraph from "../visualizers/JobGraph/JobGraph";
import PlayerTimeline from "../visualizers/PlayerTimeline/PlayerTimeline";
import { DropdownItem } from "../requests/FilterRequest";
import APIResult, { ResultStatus } from "../apis/APIResult";
import HistogramRequest from "../visualizers/HistogramVisualizer/HistogramRequest";
import HistogramVisualizer from "../visualizers/HistogramVisualizer/HistogramVisualizer";
import ScatterplotVisualizer from "../visualizers/ScatterplotVisualizer/ScatterplotVisualizer";
import ScatterplotRequest from "../visualizers/ScatterplotVisualizer/ScatterplotRequest";
import BarplotVisualizer from "../visualizers/BarplotVisualizer/BarplotVisualizer";
import BarplotRequest from "../visualizers/BarplotVisualizer/BarplotRequest";
/**
 * @typedef {import('../typedefs').AnyMap} AnyMap
 * @typedef {import('../typedefs').MapSetter} MapSetter
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

  /** @type {[VisualizerRequest, any]} */
  const [request, _setRequest] = useState(new InitialVisualizerRequest());
  /** @type {[AnyMap, MapSetter]} */
  const [visualizerRequestState, setVisualizerRequestState] = useState(
    request.GetFilterRequest().InitialState
  );
  console.log(
    `In VizContainer, state is ${JSON.stringify(visualizerRequestState)}`
  );

  const setRequest = (request) => {
    // clear state from last viz.
    setVisualizerRequestState(request.GetFilterRequest().InitialState);
    // console.log(`Just attempted to set the viz request state, now it's ${JSON.stringify(visualizerRequestState)}`)
    _setRequest(request);
  };
  const mergeVisualizerRequestState = (new_state) => {
    const merged_state = Object.assign({}, visualizerRequestState, new_state);
    // console.log(`Caller updated VizContainer's visualizerRequestState to ${JSON.stringify(merged_state)}`);
    setVisualizerRequestState(merged_state);
  };

  /** @type {[Visualizers, VisualizerSetter]} */
  const [visualizer, _setVisualizer] = useState(Visualizers.INITIAL);
  const setVisualizer = (new_visualizer) => {
    // update the request type.
    switch (new_visualizer) {
      case Visualizers.JOB_GRAPH:
        setRequest(new JobGraphRequest());
        break;
      case Visualizers.HISTOGRAM:
        setRequest(new HistogramRequest());
        break;
      case Visualizers.SCATTERPLOT:
        setRequest(new ScatterplotRequest());
        break;
      case Visualizers.BARPLOT:
        setRequest(new BarplotRequest());
        break;
      case Visualizers.PLAYER_TIMELINE:
        setRequest(new PlayerTimelineRequest());
        break;
      case Visualizers.INITIAL:
      default:
        setRequest(new InitialVisualizerRequest());
        break;
    }
    _setVisualizer(new_visualizer);
  };

  // TODO: Whenever there's a change in filtering or underlying data, refresh the view data.
  // useEffect(() => {
  //    console.warn("Filtering of data on client side is not yet implemented!");
  //    setViewData(rawData);
  // }, [filterOptions, rawData]);

  const retrieveData = () => {
    // flush current dataset and start loading animation
    setRawData(null);

    const api_request = request.GetAPIRequest(visualizerRequestState);
    if (api_request != null) {
      setLoading(true);
      let api_result = OGDAPI.fetch(api_request);
      api_result.then((result) => setRawData(result.Values))
    } else {
      console.log(`No API request for ${request}`);
    }
    setLoading(false);
  };

  const renderVisualizer = () => {
    switch (visualizer) {
      case Visualizers.JOB_GRAPH:
        return (
          <ErrorBoundary childName={"JobVisualizer"}>
            {
              loading ?
                <LoadingBlur loading={loading} />
                :
                <JobGraph
                  model={request.GetVisualizerModel(
                    visualizerRequestState,
                    rawData
                  )}
                  setVisualizer={setVisualizer}
                />
            }


          </ErrorBoundary>
        );
      case Visualizers.HISTOGRAM:
        return (
          <ErrorBoundary childName={"HistogramVisualizer"}>
            <HistogramVisualizer
              model={request.GetVisualizerModel(
                visualizerRequestState,
                rawData
              )}
              setVisualizer={setVisualizer}
            />
          </ErrorBoundary>
        )
      case Visualizers.SCATTERPLOT:
        return (
          <ErrorBoundary childName={"ScatterplotVisualizer"}>
            <ScatterplotVisualizer
              model={request.GetVisualizerModel(
                visualizerRequestState,
                rawData
              )}
              setVisualizer={setVisualizer}
            />
          </ErrorBoundary>
        )
      case Visualizers.BARPLOT:
        return (
          <ErrorBoundary childName={"BarplotVisualizer"}>
            <BarplotVisualizer
              model={request.GetVisualizerModel(
                visualizerRequestState,
                rawData
              )}
              setVisualizer={setVisualizer}
            />
          </ErrorBoundary>
        )
      case Visualizers.PLAYER_TIMELINE:
        return (
          <ErrorBoundary childName={"PlayerVisualizer"}>
            <PlayerTimeline
              model={request.GetVisualizerModel(
                visualizerRequestState,
                rawData
              )}
              setVisualizer={setVisualizer}
            />
          </ErrorBoundary>
        );
      case Visualizers.INITIAL:
      default:
        return (
          <ErrorBoundary childName={"InitialVisualizer"}>
            <InitialVisualizer />
          </ErrorBoundary>
        );
    }
  };

  const dropdownFilterItem = new DropdownItem(
    "VizPicker",
    ValueModes.ENUM,
    Visualizers,
    visualizer
  );
  const styling = {
    gridColumn: props.column,
    gridRow: props.row,
  };
  return (
    <div className="flex-auto border-4 border-red-700" style={styling}>
      {/* <LoadingBlur loading={loading} height={8} width={8} /> */}
      <div className="container relative flex">
        <div className="left-0 max-w-72 max-h-full overflow-y-auto">
          <EnumPicker
            adjustMode={true}
            filterItem={dropdownFilterItem}
            mergeContainerState={(new_state) => {
              setVisualizer(new_state[`${dropdownFilterItem.Name}Selected`]);
            }}
            key="VizTypeDropdown"
          />
          <ErrorBoundary childName={"DataFilter or LoadingBlur"}>
            <DataFilter
              filterRequest={request.GetFilterRequest()}
              loading={loading}
              mergeContainerState={mergeVisualizerRequestState}
              updateData={retrieveData}
            />
          </ErrorBoundary>
        </div>
        <div className="container left-72 border shadow-sm">
          {renderVisualizer()}
        </div>
      </div>
    </div>
  );
}
