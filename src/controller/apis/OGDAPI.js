import { OGDPopulationAPI } from './OGDPopulationAPI';
import { OGDPlayerAPI } from './OGDPlayerAPI';
import { OGDSessionAPI } from './OGDSessionAPI';
import RequestModes from '../../model/enums/RequestModes';

/**
 * @typedef {import('../../model/requests/APIRequest').APIRequest} APIRequest
 */

/**
 * @param {APIRequest?} request
 * @returns {Promise<Response>}
 */
export class OGDAPI {
   static fetch(request) {
      const no_request = {
         result: "No Data Requested",
         status: "SUCCESS",
         val: "{}"
      };

      if (request != null) {
         switch (request.RequestMode) {
            case RequestModes.POPULATION:
               return OGDPopulationAPI.fetch(request);
            break;
            case RequestModes.PLAYER:
               return OGDPlayerAPI.fetch(request);
            break;
            case RequestModes.SESSION:
               return OGDSessionAPI.fetch(request);
            break;
            default:
               let dummy = new Response(JSON.stringify(no_request), {status:200});
               return Promise.resolve(dummy);
            break;
         }
      }
      else {
         let dummy = new Response(JSON.stringify(no_request), {status:200});
         return Promise.resolve(dummy);
      }
   }
}