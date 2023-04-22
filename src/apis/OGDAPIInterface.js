/**
 * @typedef {import('../requests/APIRequest').APIRequest} APIRequest
 */

export default class OGDAPIInterface {
   /**
    * @param {APIRequest} request 
    */
   static fetch(request) {
      throw new Error("API must implement the fetch function!");
   }
}