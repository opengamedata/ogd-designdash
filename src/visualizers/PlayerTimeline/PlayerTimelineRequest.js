import VisualizerRequest from "../BaseVisualizer/VisualizerRequest";
import { AvailableGames } from "../BaseVisualizer/AvailableGames";
import { FilterRequest, DropdownItem } from "../../requests/FilterRequest";
import { PopulationMetricsRequest } from "../../requests/apis/population/PopulationMetrics";
import ValueModes from "../../enums/ValueModes";
import { RESTTypes } from "../../enums/RESTTypes"
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
    * @returns {APIRequest | Promise<APIRequest>?} The API request that gets the visualizer's required data.
    */
   GetAPIRequest(requesterState) {
      const selected_dict = requesterState["GameSelected"];
      // const game = AllowedGames.FromDict(selected_dict) ?? AllowedGames.Default();
      const game = selected_dict;
      /** @type {Date} */
      let min_date = new Date(requesterState["DateRangeMin"]);
      min_date.setHours(0, 0, 0, 0);
      let max_date = new Date(requesterState["DateRangeMax"]);
      max_date.setHours(23, 59, 59, 0);
      return new PopulationMetricsRequest(
         PlayerTimelineRequest.RequiredExtractors()[game.asString],
         RESTTypes.POST,
         game,
         requesterState["AppVersionRangeMin"],
         requesterState["AppVersionRangeMax"],
         requesterState["LogVersionRangeMin"],
         requesterState["LogVersionRangeMax"],
         min_date,
         max_date
      );
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