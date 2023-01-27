import { OGDPopulationAPI } from './OGDPopulationAPI';
import { OGDPlayerAPI } from './OGDPlayerAPI';
import { OGDSessionAPI } from './OGDSessionAPI';
import RequestModes from '../../model/enums/RequestModes';
import { APIRequest } from '../../model/requests/APIRequest';

/**
 * @param {APIRequest} request
 * @returns {Promise<Response>}
 */
export class OGDAPI {
   static fetch(request) {
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
            let response_data = {
               result: "No Data Requested",
               status: "SUCCESS",
               val: "{}"
            }
            let dummy = new Response(JSON.stringify(response_data), {status:200});
            return Promise.resolve(dummy);
         break;
      }
   }
}