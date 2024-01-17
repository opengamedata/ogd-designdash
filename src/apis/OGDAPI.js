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
      const bad_request_type = {
         result: `Request to API Failed, invalid request type ${request ? request.RequestType.name : "(no request given)"}!`,
         status: "FAILURE",
         val: "{}"
      };
      const failed_request = {
         result: "Request to API Failed",
         status: "FAILURE",
         val: "{}"
      };
      const no_request = {
         result: "No Data Requested",
         status: "SUCCESS",
         val: "{}"
      };

      if (request != null) {
         try {
            switch (request.RequestType) {
               case RESTTypes.GET:
                  return OGDAPI.fetchGET(request);
               break;
               case RESTTypes.POST:
                  return OGDAPI.fetchPOST(request);
               break;
               case RESTTypes.PUT:
                  return OGDAPI.fetchPUT(request);
               break;
               default:
                  let dummy = new Response(JSON.stringify(bad_request_type), {status:405});
                  return Promise.resolve(dummy);
               break;
            }
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

   /**
    * @param {APIRequest} request 
    * @returns {Promise<Response>}
    */
   static fetchGET(request) {

   }
   /**
    * @param {APIRequest} request 
    * @returns {Promise<Response>}
    */
   static fetchPOST(request) {

   }
   /**
    * @param {APIRequest} request 
    * @returns {Promise<Response>}
    */
   static fetchPUT(request) {

   }

   /**
    * @param {APIRequest} request 
    * @returns {Promise<Response>}
    */
   static fetchMetrics(request) {
      if (request instanceof PopulationAPIRequest) {
         if (request.start_date === null) {
            console.warn("selection_options.start_date was null! Defaulting to today.")
         }
         if (request.end_date === null) {
            console.warn("selection_options.end_date was null! Defaulting to today.")
         }
         const urlPath = `populations/metrics`;
         let start_date = request.start_date ?? new Date();
         let end_date   = request.end_date   ?? new Date();
         const searchParams = new URLSearchParams({
            game_id        : encodeURIComponent(request.Game),
            start_datetime : encodeURIComponent(start_date.toISOString().split('T')[0]) + 'T00:00',
            end_datetime   : encodeURIComponent(end_date.toISOString().split('T')[0]) + 'T23:59',
            metrics        : encodeURIComponent(`[${request.Extractors}]`)
         });

         // fetch by url
         const url = new URL(`${urlPath}?${searchParams.toString()}`, API_ORIGIN)
         console.log(`OGDPopulationAPI is making a request to ${url}`)
         let options = {
            method : "POST"
         };
         return fetch(url, options);
      }
      else {
         throw new TypeError("Sent wrong type of selection options to Population API!");
      }
   }
}