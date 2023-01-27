import VisualizerRequest from "./VisualizerRequest";
import { AvailableGames } from "../enums/AvailableGames";
import { FilterRequest, FilterItem, InputModes, ValueModes } from "./FilterRequest";
import { JobGraphModel } from "../visualizations/JobGraphModel";

/**
 * @typedef {import("../visualizations/VisualizerModel").default} VisualizerModel
 * @typedef {import('../../typedefs').FeaturesMap} FeaturesMap
 * @typedef {import("../../typedefs").MapSetter} MapSetter
 * @typedef {import("./APIRequest").APIRequest} APIRequest
 */

export default class JobGraphRequest extends VisualizerRequest {
   /**
    * @param {MapSetter} updateRequesterState
    */
   constructor(updateRequesterState) {
      super(updateRequesterState);
      this.filter_request = new FilterRequest(this.updateRequesterState);
      this.filter_request.AddItem(
         new FilterItem("Game", InputModes.DROPDOWN, ValueModes.ENUM, {"enum":AvailableGames})
      )
   }

   /**
    * @returns {FeaturesMap}
    */
   static RequiredExtractors() {
      return {
         "AQUALAB": [
            'ActiveJobs',
            'JobsAttempted-avg-time-per-attempt',
            'JobsAttempted-job-name',
            'JobsAttempted-job-difficulties',
            'TopJobCompletionDestinations',
            'TopJobSwitchDestinations',
            'PlayerSummary',
            'PopulationSummary',
         ],
         "SHIPWRECKS": [
            'ActiveJobs',
            'JobsAttempted',
            'PlayerSummary',
            'PopulationSummary'
         ]
      };
   }

   /**
    * @param {object} requesterState
    * @returns {APIRequest?} The API request that gets the visualizer's required data.
    */
   GetAPIRequest(requesterState) {
      return null;
   }

   /**
    * @returns {FilterRequest}
    */
   GetFilterRequest() {
      return this.filter_request;
   }

   /**
    * @param {object} requesterState
    * @returns {VisualizerModel?} The API request that gets the visualizer's required data.
    */
   GetVisualizerModel(requesterState) {
      return new JobGraphModel();
   }
}