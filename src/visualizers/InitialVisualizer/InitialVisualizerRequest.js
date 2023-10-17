// Local imports
//    controller imports
import VisualizerRequest from "../BaseVisualizer/VisualizerRequest";
import { AvailableGames } from "../../enums/AvailableGames";
import ValueModes from "../../enums/ValueModes";
import { FilterRequest, DropdownItem } from "../../requests/FilterRequest";
import { InitialVisualizerModel } from "./InitialVisualizerModel";

/**
 * @typedef {import("../BaseVisualizer/VisualizerModel").default} VisualizerModel
 * @typedef {import("../../requests/APIRequest").APIRequest} APIRequest
 */

export default class InitialVisualizerRequest extends VisualizerRequest {
   constructor() {
      super();
      this.filter_request = new FilterRequest("InitialVisualizer");
      this.filter_request.AddItem(
         new DropdownItem("Game", ValueModes.ENUM, AvailableGames, AvailableGames.EnumList()[0])
      )
   }

   /**
    * @returns {FilterRequest}
    */
   GetFilterRequest() {
      return this.filter_request;
   }

   /**
    * @param {object} requesterState
    * @returns {APIRequest?} The API request that gets the visualizer's required data.
    */
   GetAPIRequest(requesterState) {
      return null;
   }

   /**
    * @param {object} requesterState
    * @param {object} rawData
    * @returns {VisualizerModel} A model of the kind expected by the visualizer.
    */
   GetVisualizerModel(requesterState, rawData) {
      return new InitialVisualizerModel();
   }
}