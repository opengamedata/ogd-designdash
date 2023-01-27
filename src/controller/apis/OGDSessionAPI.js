import { API_ORIGIN } from '../../config';
import OGDAPIInterface from './OGDAPIInterface';
import { SessionAPIRequest } from '../../model/requests/APIRequest';

/**
 * @typedef {import('../../model/requests/APIRequest').APIRequest} APIRequest
 */

export class OGDSessionAPI extends OGDAPIInterface {
   /**
    * @param {APIRequest} request 
    * @returns {Promise<Response>}
    */
   static fetch(request) {
      if (request instanceof SessionAPIRequest) {
         // construct url path and params
         if (request.session_ids.length === 0) {
            throw RangeError("No values found in selection_options.session_ids")
         }
         // TODO: replace this with ability to call the SessionListAPI, not just SessionAPI
         if (request.session_ids.length > 1) {
            console.warn(`selection_options.session_ids had ${request.session_ids.length} ids, only retrieving the first in SessionAPI`);
         }
         const urlPath = `game/${request.Game}/session/${request.session_ids[0]}/metrics`;
         const searchParams = new URLSearchParams({
            metrics: `[${request.Extractors}]`
         });

         // fetch by url
         return fetch(new URL(`${urlPath}?${searchParams.toString()}`, API_ORIGIN));
      }
      else {
         throw new TypeError("Sent wrong type of selection options to Session API!");
      }
   }
}