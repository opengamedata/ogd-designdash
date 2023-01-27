/**
 * @typedef {import("../../typedefs").MapSetter} MapSetter
 * @typedef {import("./APIRequest").APIRequest} APIRequest
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
    * @returns {APIRequest?} The API request that gets the visualizer's required data.
    */
   GetAPIRequest() {
      throw new Error(`Request subclass ${this.constructor.name} failed to implement APIRequest getter!`);
   }

   /**
    * @returns {FilterRequest}
    */
   GetFilterRequest() {
      throw new Error(`Request subclass ${this.constructor.name} failed to implement FilterRequest getter!`);
   }
}