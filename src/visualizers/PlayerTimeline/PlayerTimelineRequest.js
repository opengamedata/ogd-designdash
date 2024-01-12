import VisualizerRequest from "../BaseVisualizer/VisualizerRequest";
import { AvailableGames } from "../BaseVisualizer/AvailableGames";
import { FilterRequest, DropdownItem } from "../../requests/FilterRequest";
import ValueModes from "../../enums/ValueModes";
import { PlayerTimelineModel } from "./PlayerTimelineModel";

/**
 * @typedef {import("../BaseVisualizer/VisualizerModel").default} VisualizerModel
 * @typedef {import('../../typedefs').FeaturesMap} FeaturesMap
 * @typedef {import("../../typedefs").MapSetter} MapSetter
 * @typedef {import("../../requests/APIRequest").APIRequest} APIRequest
 */

export default class PlayerTimelineRequest extends VisualizerRequest {
   constructor() {
      super();
      this.filter_request = new FilterRequest("PlayerTimeline");
      this.filter_request.AddItem(
         new DropdownItem("Game", ValueModes.ENUM, AvailableGames)
      )
   }

   /**
    * @returns {FeaturesMap}
    */
   static RequiredExtractors() {
      return {
         "AQUALAB" : [
            'JobsCompleted',
            'SessionID',
            'SessionDuration'
         ],
         "SHIPWRECKS" : [
            'JobsCompleted',
            'SessionID',
            'SessionDuration'
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
    * @param {object} rawData
    * @returns {VisualizerModel} A model of the kind expected by the visualizer.
    */
   GetVisualizerModel(requesterState, rawData) {
      return new PlayerTimelineModel(requesterState['GameSelected'], rawData);
   }
}