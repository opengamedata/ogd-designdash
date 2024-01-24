import { API_ORIGIN } from '../config';
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
         let searchParams = null;
         if (Object.keys(request.HeaderParams()).length > 0) {
            searchParams = []
            let callback = (key) => searchParams.push(`${key}=${encodeURIComponent(request.HeaderParams()[key])}`);
            Object.keys(request.HeaderParams()).forEach( callback );
         }

         // fetch by url
         const _path = searchParams ? `${request.URLPath}?${searchParams.join("&")}` : request.URLPath()
         console.log(`OGDAPI is preparing a request to path ${_path}, at origin ${API_ORIGIN}`)
         const url = new URL(API_ORIGIN + _path, )
         console.log(`OGDAPI is making a request to ${url}`)
         let options = {
            method : "GET"
         };
         if (Object.keys(request.BodyParams()).length > 0) {
            options.body = JSON.stringify(request.BodyParams())
         }
         return fetch(url, options);
   }
   /**
    * @param {APIRequest} request 
    * @returns {Promise<Response>}
    */
   static fetchPOST(request) {
         let searchParams = null;
         if (Object.keys(request.HeaderParams()).length > 0) {
            searchParams = []
            let callback = (key) => searchParams.push(`${key}=${encodeURIComponent(request.HeaderParams()[key])}`);
            Object.keys(request.HeaderParams()).forEach( callback );
         }

         // fetch by url
         const _path = searchParams ? `${request.URLPath}?${searchParams.join("&")}` : request.URLPath()
         console.log(`OGDAPI is preparing a request to path ${_path}, at origin ${API_ORIGIN}`)
         const url = new URL(API_ORIGIN + _path, )
         console.log(`OGDAPI is making a request to ${url}`)
         let options = {
            method : "POST"
         };
         if (Object.keys(request.BodyParams()).length > 0) {
            options.body = JSON.stringify(request.BodyParams())
         }
         return fetch(url, options);
   }
   /**
    * @param {APIRequest} request 
    * @returns {Promise<Response>}
    */
   static fetchPUT(request) {
         let searchParams = null;
         if (Object.keys(request.HeaderParams()).length > 0) {
            searchParams = []
            let callback = (key) => searchParams.push(`${key}=${encodeURIComponent(request.HeaderParams()[key])}`);
            Object.keys(request.HeaderParams()).forEach( callback );
         }

         // fetch by url
         const _path = searchParams ? `${request.URLPath}?${searchParams.join("&")}` : request.URLPath()
         console.log(`OGDAPI is preparing a request to path ${_path}, at origin ${API_ORIGIN}`)
         const url = new URL(API_ORIGIN + _path, )
         console.log(`OGDAPI is making a request to ${url}`)
         let options = {
            method : "PUT"
         };
         if (Object.keys(request.BodyParams()).length > 0) {
            options.body = JSON.stringify(request.BodyParams())
         }
         return fetch(url, options);
   }
}
