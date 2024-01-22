import { APIRequest } from '../../APIRequest';
import { AvailableGames } from "../../../visualizers/BaseVisualizer/AvailableGames";
import { RESTTypes }   from "../../../enums/RESTTypes"

export class SessionFeatureListRequest extends APIRequest {
   /**
    * @param {RESTTypes}  request_type
    * @param {AvailableGames} game
    */
   constructor(request_type=RESTTypes.GET,
               game=AvailableGames.EnumList()[0]) {
      super(request_type, game,
            null, null,
            null, null);
   }

   URLPath() {
      /**
       * @returns {string}
       */
      return `/sessions/metrics/list/${this.Game}`
   }
   HeaderParams() {
      /**
       * @returns {Object.<string, object>}
       */
      return {}
   }
   BodyParams() {
      /**
       * @returns {Object.<string, object>}
       */
      return {}
   }

   genLocalStorageKey() {
      /**
       * @returns {string}
       */
      return ["SESSION", this.game_name, "FeatureList"].join("/")
   }
}