// global imports

// local imports
import { AvailableGames } from "../enums/AvailableGames";

export class APIRequest {
   /**
    * @param {AvailableGames} game
    * @param {string | null} min_app_version
    * @param {string | null} max_app_version
    * @param {string | null} min_log_version
    * @param {string | null} max_log_version
    */
   constructor(game=AvailableGames.EnumList()[0],
               min_app_version=null, max_app_version=null,
               min_log_version=null, max_log_version=null) {
      if (this.constructor === APIRequest) {
         throw new TypeError("Tried to instantiate abstract class APIRequest!")
      }
      this.game_name       = game.name;
      this.min_app_version = min_app_version;
      this.max_app_version = max_app_version;
      this.min_log_version = min_log_version;
      this.max_log_version = max_log_version;
   }

   genLocalStorageKey() {
      return [this.game_name, this.min_app_version, this.max_app_version, this.min_log_version, this.max_log_version].join("/")
   }

   Game() {
      return this.game_name;
   }
   URLPath() {
      /**
       * @returns {string}
       */
      throw new TypeError("API request must implement the URLPath function!");
   }
   HeaderParams() {
      /**
       * @returns {Object.<string, object>}
       */
      throw new TypeError("API request must implement the HeaderParams function!");
   }
   BodyParams() {
      /**
       * @returns {Object.<string, object>}
       */
      throw new TypeError("API request must implement the BodyParams function!");
   }

   get LocalStorageKey() {
      return this.genLocalStorageKey();
   }
}
