import { API_ORIGIN, API_PATH } from '../config';
import APIResult, { ResultStatus } from "../apis/APIResult";

/**
 * @typedef {import('../requests/APIRequest').APIRequest} APIRequest
 */

export class OGDAPI {
   /**
    * Getter for a default response when the API interface received a null request.
    * @returns {Response}
    */
   static get NoRequest() {
      return new Response(
         JSON.stringify(
            {
               result: "No Data Requested",
               status: "SUCCESS",
               val: "{}"
            }),
         {status:400}
      );
   } 
   /**
    * Getter for a default response when the API interface had an error sending the request to the server.
    * @returns {Response}
    */
   static get FailedRequest() {
      return new Response(
         JSON.stringify(
            {
               result: "Sending request to API Failed",
               status: "FAILURE",
               val: "{}"
         }),
         {status:500}
      );
   }

   /**
    * @param {APIRequest?} request
    * @returns {Promise<APIResult>}
    */
   static fetch(request) {
      let ret_val = null;

      if (request != null) {
         try {
            const url = request.FetchURL(API_ORIGIN, API_PATH);
            const options = request.FetchOptions();
            console.log(`OGDAPI is making a request to ${url}`)
            ret_val = fetch(url, options)
         }
         catch (err) {
            console.warn(`Could not make API Request, got the following error:\n${err}`)
            ret_val = Promise.resolve(OGDAPI.FailedRequest);
         }
      }
      else {
         ret_val = Promise.resolve(OGDAPI.NoRequest);
      }
      return ret_val
            .then((response) => response.json())
            .then((response) => new APIResult(response));
   }

}
