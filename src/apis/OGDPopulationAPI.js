import { API_ORIGIN } from '../config';
import OGDAPIInterface from './OGDAPIInterface';
import { PopulationAPIRequest } from '../requests/APIRequest';

/**
 * @typedef {import('../requests/APIRequest').APIRequest} APIRequest
 */

export class OGDPopulationAPI extends OGDAPIInterface {
   /**
    * @param {APIRequest} request 
    * @returns {Promise<Response>}
    */
   static fetch(request) {
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