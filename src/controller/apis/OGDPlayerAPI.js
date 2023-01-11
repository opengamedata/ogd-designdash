import { API_ORIGIN } from '../../config';
import OGDAPIInterface from './OGDAPIInterface';
import { SelectionOptions, PlayerSelectionOptions } from '../../controller/SelectionOptions';

export class OGDPlayerAPI extends OGDAPIInterface {
   /**
    * @param {SelectionOptions} selection_options 
    * @param {string[]} metrics 
    * @returns {Promise<Response>}
    */
   static fetch(selection_options, metrics) {
      if (selection_options instanceof PlayerSelectionOptions) {
         const path = OGDPlayerAPI.getURLPath(selection_options, metrics)
         return       fetch(path)
      }
      else {
         throw new TypeError("Sent wrong type of selection options to Player API!");
      }
   }

   /**
    * @param {PlayerSelectionOptions} selection_options 
    * @param {string[]} view_metrics 
    * @returns {URL}
    */
   static getURLPath = (selection_options, view_metrics) => {
      let searchParams, urlPath
      // construct url path and params
      if (selection_options.player_ids.length === 0) {
         throw RangeError("No values found in selection_options.player_ids")
      }
      // TODO: replace this with ability to call the PlayerListAPI, not just PlayerAPI
      if (selection_options.player_ids.length > 1) {
         console.warn(`selection_options.player_ids had ${selection_options.player_ids.length} ids, only retrieving the first in PlayerAPI`);
      }
      urlPath = `game/${selection_options.game_name}/player/${selection_options.player_ids[0]}/metrics`;
      searchParams = new URLSearchParams({
         metrics: `[${view_metrics}]`
      });

      // fetch by url
      return new URL(`${urlPath}?${searchParams.toString()}`, API_ORIGIN)
   }
}