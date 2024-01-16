import { APIRequest } from '../../APIRequest';
import { AvailableGames } from "../../../enums/AvailableGames";

export class PlayerFeatureListRequest extends APIRequest {
   /**
    * @param {AvailableGames} game
    */
   constructor(game=AvailableGames.EnumList()[0]) {
      super(game, null, null,
            null, null);
   }

   URLPath() {
      /**
       * @returns {string}
       */
      return `/players/metrics/list/${this.Game()}`
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
      return ["POPULATION", this.game_name, "FeatureList"].join("/")
   }
}