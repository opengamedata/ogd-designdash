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
      /** @type {Promise<Response>} */
      let ret_val = Promise.resolve(OGDAPI.NoRequest);

      if (request != null) {
         const localData = localStorage.getItem(request.LocalStorageKey);
   // 1. If requested data is already cached, retrieve from cache
         if (localData) {
            // console.log(localData)
            console.log(`Found ${request.LocalStorageKey} in the cache`);
            try {
               ret_val = Promise.resolve(new Response(JSON.parse(localData), {status:200}))
            } catch (err) {
               console.error(`Local data (${localData}) was not valid JSON!\nResulted in error ${err}`);
               ret_val = Promise.resolve(OGDAPI.BadCache);
            }
         }
         else {
   // 2. If not in cache, perform a fetch
            const url = request.FetchURL(API_ORIGIN, API_PATH);
            const options = request.FetchOptions();
            console.log(`OGDAPI is making a request to ${url}`)
            console.log(`Fetching into ${request.LocalStorageKey}`);
            ret_val = fetch(url, options)
                     .then((response) => response.json())
                     .then((response_data) => {
                        localStorage.setItem(
                           request.LocalStorageKey,
                           JSON.stringify(response_data)
                        );
                        return Promise.resolve(new Response(response_data));
                     })
                     .catch(
                        (error) => {
                           console.warn(`Could not make API Request, got the following error:\n${error}`)
                           return Promise.resolve(OGDAPI.FailedRequest);
                     });
         }
      }
   // 3. Whether we got from fetch or cache, we set up as response object
      return ret_val
            .then((promise) => promise.json())
            .then((response) => new APIResult(response))
   }

}
