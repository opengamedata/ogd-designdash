/**
 * @typedef {import("../../typedefs").AnyMap} AnyMap
 * @typedef {import("./APIRequest").APIRequest} APIRequest
 * @typedef {import("./FilterRequest").FilterRequest} FilterRequest
 */

export default class VisualizerRequest {
   /**
    * @returns {APIRequest} The API request that gets the visualizer's required data.
    */
   get APIRequest() {
      throw new Error(`Request subclass ${this.constructor.name} failed to implement APIRequest getter!`);
   }

   /**
    * @returns {FilterRequest}
    */
   get FilterRequest() {
      throw new Error(`Request subclass ${this.constructor.name} failed to implement FilterRequest getter!`);
   }
}