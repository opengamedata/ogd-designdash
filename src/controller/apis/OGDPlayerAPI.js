import { API_ORIGIN } from '../../config';
import OGDAPIInterface from './OGDAPIInterface';
import { APIRequest, PlayerAPIRequest } from '../../model/requests/APIRequest';

export class OGDPlayerAPI extends OGDAPIInterface {
   /**
    * @param {APIRequest} request 
    * @returns {Promise<Response>}
    */
   static fetch(request) {
      if (request instanceof PlayerAPIRequest) {
         // construct url path and params
         if (request.player_ids.length === 0) {
            throw RangeError("No values found in selection_options.player_ids")
         }
         // TODO: replace this with ability to call the PlayerListAPI, not just PlayerAPI
         if (request.player_ids.length > 1) {
            console.warn(`selection_options.player_ids had ${request.player_ids.length} ids, only retrieving the first in PlayerAPI`);
         }
         const urlPath = `game/${request.Game}/player/${request.player_ids[0]}/metrics`;
         const searchParams = new URLSearchParams({
            metrics: `[${request.Extractors}]`
         });

         // fetch by url
         return fetch(new URL(`${urlPath}?${searchParams.toString()}`, API_ORIGIN))
      }
      else {
         throw new TypeError("Sent wrong type of selection options to Player API!");
      }
   }
}