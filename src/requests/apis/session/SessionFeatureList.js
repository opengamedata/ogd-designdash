import { APIRequest } from '../../APIRequest';
import { AvailableGames } from "../../../enums/AvailableGames";
import { RequestTypes }   from "../../../enums/RequestTypes"

export class SessionFeatureListRequest extends APIRequest {
   /**
    * @param {RequestTypes}  request_type
    * @param {AvailableGames} game
    */
   constructor(request_type=RequestTypes.GET,
               game=AvailableGames.EnumList()[0]) {
      super(request_type, game,
            null, null,
            null, null);
   }

   URLPath() {
      /**
       * @returns {string}
       */
      return `/sessions/metrics/list/${this.Game()}`
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