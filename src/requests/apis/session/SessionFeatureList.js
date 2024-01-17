import { APIRequest } from '../../APIRequest';
import { AvailableGames } from "../../../enums/AvailableGames";
import { RequestTypes }   from "../../../enums/RequestTypes"

export class SessionFeatureListRequest extends APIRequest {
   /**
    * @param {AvailableGames} game
    * @param {RequestTypes}  request_type
    */
   constructor(game=AvailableGames.EnumList()[0],
               request_type=RequestTypes.Default()) {
      super(game, request_type, null, null,
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