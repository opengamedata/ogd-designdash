import { APIRequest } from '../../APIRequest';
import { AvailableGames } from "../../../enums/AvailableGames";
import { RequestTypes }   from "../../../enums/RequestTypes"

export class SessionMetricsRequest extends APIRequest {
   /**
    * @param {string[]} features
    * @param {string} session_id
    * @param {RequestTypes}  request_type
    * @param {AvailableGames} game
    * @param {string | null} min_app_version
    * @param {string | null} max_app_version
    * @param {string | null} min_log_version
    * @param {string | null} max_log_version
    */
   constructor(features, session_id,
               request_type=RequestTypes.POST,
               game=AvailableGames.EnumList()[0],
               min_app_version=null, max_app_version=null,
               min_log_version=null, max_log_version=null) {
      super(request_type, game,
            min_app_version, max_app_version,
            min_log_version, max_log_version);
      this.features   = features;
      this.session_id = session_id;
   }

   URLPath() {
      /**
       * @returns {string}
       */
      return "/session/metrics"
   }
   HeaderParams() {
      /**
       * @returns {Object.<string, object>}
       */
      return []
   }
   BodyParams() {
      /**
       * @returns {Object.<string, object>}
       */
      return {
         "game_id"       : this.Game(),
         "session_id"    : this.session_id,
         "metrics"       : this.features
      }
   }

   genLocalStorageKey() {
      return ["SESSION", this.game_name, this.min_app_version, this.max_app_version, this.min_log_version, this.max_log_version, this.session_id].join("/")
   }
}
