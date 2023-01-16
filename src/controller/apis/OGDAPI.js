import { OGDPopulationAPI } from './OGDPopulationAPI';
import { OGDPlayerAPI } from './OGDPlayerAPI';
import { OGDSessionAPI } from './OGDSessionAPI';
import { ViewModes } from '../../model/ViewModes';
import { SelectionOptions } from '../SelectionOptions';

/**
 * @param {ViewModes} viewMode
 * @param {SelectionOptions} selectionOptions
 * @param {string[]} metrics
 * @returns {Promise<Response>}
 */
export class OGDAPI {
   static fetch(viewMode, selectionOptions, metrics) {
      switch (viewMode) {
         case ViewModes.POPULATION:
            return OGDPopulationAPI.fetch(selectionOptions, metrics);
         break;
         case ViewModes.PLAYER:
            return OGDPlayerAPI.fetch(selectionOptions, metrics);
         break;
         case ViewModes.SESSION:
            return OGDSessionAPI.fetch(selectionOptions, metrics);
         break;
         case ViewModes.INITIAL:
         default:
            let response_data = {
               result: "No Data Requested",
               status: "SUCCESS"
            }
            let dummy = new Response(JSON.stringify(response_data), {status:200});
            return Promise.resolve(dummy);
         break;
      }
   }
}