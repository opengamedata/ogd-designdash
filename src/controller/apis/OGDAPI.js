import { OGDPopulationAPI } from './OGDPopulationAPI';
import { OGDPlayerAPI } from './OGDPlayerAPI';
import { OGDSessionAPI } from './OGDSessionAPI';
import RequestModes from '../../model/enums/RequestModes';

/**
 * @typedef {import('../../model/requests/APIRequest').APIRequest} APIRequest
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
         try {
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
         catch (err) {
            const bad_request = {
               result: "Request to API Failed",
               status: "FAILURE",
               val: "{}"
            };
            console.warn(`Could not make API Request, got the following error:\n${err}`)
            let dummy = new Response(JSON.stringify(bad_request), {status:200});
            return Promise.resolve(dummy);
         }
      }
      else {
         let dummy = new Response(JSON.stringify(no_request), {status:400});
         return Promise.resolve(dummy);
      }
   }
}