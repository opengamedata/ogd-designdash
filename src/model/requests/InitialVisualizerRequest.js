import VisualizerRequest from "./VisualizerRequest";
import { AvailableGames } from "../enums/AvailableGames";
import { FilterRequest, FilterItem, InputModes, ValueModes } from "./FilterRequest";

/**
 * @typedef {import("../../typedefs").MapSetter} MapSetter
 * @typedef {import("./APIRequest").APIRequest} APIRequest
 */

export default class InitialVisualizerRequest extends VisualizerRequest {
   /**
    * @param {object} requesterState
    * @param {MapSetter} updateRequesterState
    */
   constructor(requesterState, updateRequesterState) {
      super(requesterState, updateRequesterState);
      this.filter_request = new FilterRequest(this.updateRequesterState);
      this.filter_request.AddItem(
         new FilterItem("Game", InputModes.DROPDOWN, ValueModes.ENUM, {"enum":AvailableGames})
      )
   }

   /**
    * @returns {APIRequest?} The API request that gets the visualizer's required data.
    */
   GetAPIRequest() {
      return null;
   }

   /**
    * @returns {FilterRequest}
    */
   GetFilterRequest() {
      return this.filter_request;
   }
}