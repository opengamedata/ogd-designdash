import { APIRequest } from '../../APIRequest';
import { AvailableGames } from "../../../visualizers/BaseVisualizer/AvailableGames";
import { RESTTypes }   from "../../../enums/RESTTypes"

export class SessionMetricsRequest extends APIRequest {
   /**
    * @param {string[]} features
    * @param {string} session_id
    * @param {RESTTypes}  request_type
    * @param {AvailableGames} game
    * @param {string | null} min_app_version
    * @param {string | null} max_app_version
    * @param {string | null} min_log_version
    * @param {string | null} max_log_version
    */
   constructor(features, session_id,
               request_type=RESTTypes.POST,
               game=AvailableGames.EnumList()[0],
               min_app_version=null, max_app_version=null,
               min_log_version=null, max_log_version=null) {
      super(request_type, game,
            min_app_version, max_app_version,
            min_log_version, max_log_version);
      this.features   = features;
      this.session_id = session_id;
   }

   /**
    * @returns {string}
    */
   URLPath() {
      return "/session/metrics"
   }

   /**
    * @returns {URLSearchParams}
    */
   HeaderParams() {
      return new URLSearchParams();
   }

   /**
    * @returns {FormData}
    */
   BodyParams() {
      const ret_val = new FormData();
      const _features = this.features.join(",");
      ret_val.append("game_id",   this.Game)
      ret_val.append("session_id", this.session_id)
      ret_val.append("metrics",   `[${_features}]`)
      return ret_val
   }

   genLocalStorageKey() {
      return ["SESSION", this.game_name, this.min_app_version, this.max_app_version, this.min_log_version, this.max_log_version, this.session_id].join("/")
   }
}
