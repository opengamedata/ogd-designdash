import { API_ORIGIN } from '../../config';
import { SessionSelectionOptions } from '../../controller/SelectionOptions';

export class OGDSessionAPI {
   /**
    * @param {SessionSelectionOptions} selection_options 
    * @param {string[]} metrics 
    * @returns {Promise<Response>}
    */
   static fetch(selection_options, metrics) {
      const path = OGDSessionAPI.getURLPath(selection_options, metrics)
      return       fetch(path)
   }

   /**
    * @param {SessionSelectionOptions} selection_options 
    * @param {string[]} view_metrics 
    * @returns {URL}
    */
   static getURLPath = (selection_options, view_metrics) => {
      let searchParams, urlPath
      // construct url path and params
      if (selection_options.session_ids.length === 0) {
         throw RangeError("No values found in selection_options.session_ids")
      }
      // TODO: replace this with ability to call the SessionListAPI, not just SessionAPI
      if (selection_options.session_ids.length > 1) {
         console.warn(`selection_options.session_ids had ${selection_options.session_ids.length} ids, only retrieving the first in SessionAPI`);
      }
      urlPath = `game/${selection_options.game_name}/session/${selection_options.session_ids[0]}/metrics`;
      searchParams = new URLSearchParams({
         metrics: `[${view_metrics}]`
      });

      // fetch by url
      return new URL(`${urlPath}?${searchParams.toString()}`, API_ORIGIN)
   }
}