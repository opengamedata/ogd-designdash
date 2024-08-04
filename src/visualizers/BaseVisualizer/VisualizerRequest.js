/**
 * @typedef {import("../../typedefs").MapSetter} MapSetter
 * @typedef {import("../../requests/APIRequest").APIRequest} APIRequest
 * @typedef {import("../../requests/FilterRequest").FilterRequest} FilterRequest
 * @typedef {import("./VisualizerModel").default} VisualizerModel
 */

export default class VisualizerRequest {
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
    * @returns {APIRequest | Promise<APIRequest>?} The API request that gets the visualizer's required data.
    */
   GetAPIRequest(requesterState) {
      throw new Error(`Request subclass ${this.constructor.name} failed to implement APIRequest getter!`);
   }

   /**
    * @param {object} requesterState
    * @param {object} rawData
    * @returns {VisualizerModel} A model of the kind expected by the visualizer.
    */
   GetVisualizerModel(requesterState, rawData) {
      throw new Error(`Request subclass ${this.constructor.name} failed to implement VisualizerModel getter!`);
   }
}