/**
 * @typedef {import("../../typedefs").MapSetter} MapSetter
 * @typedef {import("./APIRequest").APIRequest} APIRequest
 * @typedef {import("../visualizations/VisualizerModel").default} VisualizerModel
 * @typedef {import("./FilterRequest").FilterRequest} FilterRequest
 */

export default class VisualizerRequest {
   /**
    * @param {MapSetter} updateRequesterState
    */
   constructor(updateRequesterState) {
      this.updateRequesterState = updateRequesterState;
   }

   toString() {
      return `${this.constructor.name} Instance`;
   }

   /**
    * @returns {FilterRequest}
    */
   GetFilterRequest() {
      throw new Error(`Request subclass ${this.constructor.name} failed to implement FilterRequest getter!`);
   }

   /**
    * @param {object} requesterState
    * @returns {APIRequest?} The API request that gets the visualizer's required data.
    */
   GetAPIRequest(requesterState) {
      throw new Error(`Request subclass ${this.constructor.name} failed to implement APIRequest getter!`);
   }

   /**
    * @param {object} requesterState
    * @returns {VisualizerModel?} The API request that gets the visualizer's required data.
    */
   GetVisualizerModel(requesterState) {
      throw new Error(`Request subclass ${this.constructor.name} failed to implement VisualizerModel getter!`);
   }
}