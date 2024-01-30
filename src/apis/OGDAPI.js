import { API_ORIGIN, API_PATH } from '../config';
import APIResponse, { ResultStatus } from "../apis/APIResponse";

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
    * Getter for a default response when the cached API response did not have valid JSON data.
    * @returns {Response}
    */
   static get BadCache() {
      return new Response(
         JSON.stringify(
            {
               result: "Locally-cached data did not contain valid JSON.",
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
    * Getter for a default response when the API gave a response containing invalid JSON data.
    * @returns {Response}
    */
   static get BadResponse() {
      return new Response(
         JSON.stringify(
            {
               result: "API response did not contain valid JSON data",
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
   static get BadConversion() {
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
    * @param {APIRequest?} request
    * @returns {Promise<APIResponse>}
    */
   static fetch(request) {
      /*
         Overall how it works:
         First, we need to check if data is cached or not.
         If it isn't, we need to get data from server, cache it, and still pass that data on to return an APIResult.
         Because this is dealing with fetch API, we need to return a promise in order to avoid having to sort out await-async madness.
         Thus, if data was cached, we're still going to need to return a promise.
         Hence, in either case we generate a Response object, and then get the .json() to return.

         In uncached case, we have a .then(...) that uses the JSON to stick in the cache, and returns it.
         In the already-cached case, we just take the JSON string and use it to init the Response object, and still return the .json() result.

         Doing it this way, we always send back the JSON our APIResponse wants to init from,
         but don't need to (a) do async stuff, nor (b) read json() from API's fetch Response more than once.

         It's all pretty gross, but as straightforward as I can make it with JS's weird halfway, half-baked solutions to aynchronicity.
      */
      /** @type {Promise<any>} */
      let ret_val = OGDAPI.NoRequest.json();

      if (request != null) {
         const localData = localStorage.getItem(request.LocalStorageKey);
   // 1. If requested data is not already cached, retrieve from server and store in cache
         if (!localData) {
            const url = request.FetchURL(API_ORIGIN, API_PATH);
            const options = request.FetchOptions();
            console.log(`OGDAPI is making a request to ${url}`)
            console.log(`Fetching into ${request.LocalStorageKey}`);
            ret_val = fetch(url, options)
                     .catch(
                        (error) => {
                           console.warn(`Could not make API Request, got the following error:\n${error}`)
                           return OGDAPI.FailedRequest.json();
                     })
                     .then((response) => response.json())
                     .catch(
                        (error) => {
                           console.error(`Could not parse JSON from API response, got the following error:\n${error}`)
                           return OGDAPI.BadResponse.json();
                        })
                     .then((response_data) => {
                        localStorage.setItem(
                           request.LocalStorageKey,
                           JSON.stringify(response_data)
                        );
                        return response_data;
                     })
         }
         else {
   // 2. If data is in cache, place it into a Response and return the json.
            console.log(`Found ${request.LocalStorageKey} in the cache.`);
            // console.log(`Contents of cached data were: ${localData}`)
            ret_val = new Response(localData, {status:200})
                     .json()
                     .catch(
                        (error) => {
                           console.log(`Could not get JSON from cached response object, an error occurred!\n${error}`);
                           return OGDAPI.BadCache.json()
                     })
         }
      }
      // else { ret_val = OGDAPI.NoRequest.json() }, which is the default for ret_val
   // 3. Whether we got from fetch or cache, we take the JSON from the response and use it to populate an APIResult.
      return ret_val
            .then((response) => new APIResponse(response))
            .catch(
               (error) => {
                           console.log(`Could not convert Response JSON to an APIResult object, an error occurred!\n${error}`);
                           return OGDAPI.BadConversion.json()
            })
   }

}
