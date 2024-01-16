import { APIRequest } from '../../APIRequest';
import { AvailableGames } from "../../../enums/AvailableGames";

export class PlayersMetricsRequest extends APIRequest {
   /**
    * @param {string[]} features
    * @param {Array.<string>} player_ids
    * @param {AvailableGames} game
    * @param {string | null} min_app_version
    * @param {string | null} max_app_version
    * @param {string | null} min_log_version
    * @param {string | null} max_log_version
    */
   constructor(features, player_ids, game=AvailableGames.EnumList()[0],
               min_app_version=null, max_app_version=null,
               min_log_version=null, max_log_version=null) {
      super(game, min_app_version, max_app_version,
            min_log_version, max_log_version);
      this.features   = features;
      this.player_ids = player_ids;
   }

   URLPath() {
      /**
       * @returns {string}
       */
      return "/players/metrics"
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
         "game_id"        : this.Game(),
         "player_ids"     : this.player_ids,
         "metrics"        : this.features
      }
   }

   genLocalStorageKey() {
      let _players = this.player_ids.join("-")
      return ["PLAYER", this.game_name, this.min_app_version, this.max_app_version, this.min_log_version, this.max_log_version, _players].join("/")
   }
}
