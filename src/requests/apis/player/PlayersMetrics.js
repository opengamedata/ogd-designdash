import { APIRequest } from '../../APIRequest';
import { AvailableGames } from "../../../visualizers/BaseVisualizer/AvailableGames";
import { RESTTypes }   from "../../../enums/RESTTypes"

export class PlayersMetricsRequest extends APIRequest {
   /**
    * @param {string[]} features
    * @param {Array.<string>} player_ids
    * @param {RESTTypes}  request_type
    * @param {AvailableGames} game
    * @param {string | null} min_app_version
    * @param {string | null} max_app_version
    * @param {string | null} min_log_version
    * @param {string | null} max_log_version
    */
   constructor(features, player_ids,
               request_type=RESTTypes.POST,
               game=AvailableGames.EnumList()[0],
               min_app_version=null, max_app_version=null,
               min_log_version=null, max_log_version=null) {
      super(request_type, game,
            min_app_version, max_app_version,
            min_log_version, max_log_version);
      this.features   = features;
      this.player_ids = player_ids;
   }

   /**
    * @returns {string}
    */
   URLPath() {
      return "/players/metrics"
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
      const _player_ids = this.player_ids.join(",")
      ret_val.append("game_id",    this.Game)
      ret_val.append("player_ids", `[${_player_ids}]`)
      ret_val.append("metrics",    `[${_features}]`)
      return ret_val
   }

   genLocalStorageKey() {
      let _players = this.player_ids.join("-")
      return ["PLAYER", this.game_name, this.min_app_version, this.max_app_version, this.min_log_version, this.max_log_version, _players].join("/")
   }
}
