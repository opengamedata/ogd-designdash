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
    * Getter for a default response when the API interface had an error sending the request to the server.
    * @returns {Response}
    */
   static get ErroredRequest() {
      return new Response(
         JSON.stringify(
            {
               result: "Error converting API server response to APIResponse class.",
               status: "FAILURE",
               val: "{}"
         }),
         {status:500}
      );
   }
   /**
    * Getter for a default response when the API interface had an error sending the request to the server.
    * @returns {Response}
    */
   static get BadCache() {
      return new Response(
         JSON.stringify(
            {
               result: "Locally-cached data was not valid JSON.",
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
      /** @type {Promise<any>} */
      let ret_val = OGDAPI.NoRequest.json();

      if (request != null) {
         const localData = localStorage.getItem(request.LocalStorageKey);
   // 1. If requested data is already cached, retrieve from cache
         if (!localData) {
            const url = request.FetchURL(API_ORIGIN, API_PATH);
            const options = request.FetchOptions();
            console.log(`OGDAPI is making a request to ${url}`)
            console.log(`Fetching into ${request.LocalStorageKey}`);
            ret_val = fetch(url, options)
                     .then((response) => response.json())
                     .catch((error) => console.error(`Could not parse JSON for response: ${error}`))
                     .then((response_data) => {
                        localStorage.setItem(
                           request.LocalStorageKey,
                           JSON.stringify(response_data)
                        );
                        return response_data;
                     })
                     .catch(
                        (error) => {
                           console.warn(`Could not make API Request, got the following error:\n${error}`)
                           return OGDAPI.FailedRequest.json();
                     });
         }
         else {
   // 2. If in cache, retrieve it to return.
            // console.log(localData)
            console.log(`Found ${request.LocalStorageKey} in the cache`);
            try {
               const parsed_data = JSON.parse(localData)
               ret_val = new Response(parsed_data, {status:200}).json()
            } catch (err) {
               console.error(`Local data (${localData}) was not valid JSON!\nResulted in error ${err}`);
               ret_val = OGDAPI.BadCache.json();
            }
         }
      }
   // 3. Whether we got from fetch or cache, we set up as response object
      return ret_val
            .then((response) => new APIResult(response))
   }

}
