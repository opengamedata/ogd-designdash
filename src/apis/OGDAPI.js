import { API_ORIGIN, API_PATH } from '../config';
import { RESTTypes } from '../enums/RESTTypes';

/**
 * @typedef {import('../requests/APIRequest').APIRequest} APIRequest
 */

export class OGDAPI {
   /**
    * @param {APIRequest?} request
    * @returns {Promise<Response>}
    */
   static fetch(request) {
      const no_request = {
         result: "No Data Requested",
         status: "SUCCESS",
         val: "{}"
      };

      if (request != null) {
         const bad_request_type = {
            result: `Request to API Failed, invalid request type ${request.RequestType ? request.RequestType.asString : "(no request type given)"}!`,
            status: "FAILURE",
            val: "{}"
         };
         const failed_request = {
            result: "Request to API Failed",
            status: "FAILURE",
            val: "{}"
         };
         try {
            const url = request.FetchURL(API_ORIGIN, API_PATH);
            const options = request.FetchOptions();
            console.log(`OGDAPI is making a request to ${url}`)
            return fetch(url, options);
         }
         catch (err) {
            console.warn(`Could not make API Request, got the following error:\n${err}`)
            let dummy = new Response(JSON.stringify(failed_request), {status:200});
            return Promise.resolve(dummy);
         }
      }
      else {
         let dummy = new Response(JSON.stringify(no_request), {status:400});
         return Promise.resolve(dummy);
      }
   }

}
