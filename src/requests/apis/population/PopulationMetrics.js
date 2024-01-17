import { APIRequest } from '../../APIRequest';
import { AvailableGames } from "../../../enums/AvailableGames";
import { RequestTypes } from "../../../enums/RequestTypes"
import { ISODatetimeFormat } from '../../../utils/TimeFormat';

export class PopulationMetricsRequest extends APIRequest {
   /**
    * @param {string[]} features
    * @param {AvailableGames} game
    * @param {RequestTypes}  request_type
    * @param {string | null} min_app_version
    * @param {string | null} max_app_version
    * @param {string | null} min_log_version
    * @param {string | null} max_log_version
    * @param {Date | null} start_date
    * @param {Date | null} end_date
    */
   constructor(features, game=AvailableGames.EnumList()[0],
               request_type=RequestTypes.Default(),
               min_app_version=null, max_app_version=null,
               min_log_version=null, max_log_version=null,
               start_date     =null, end_date       =null) {
      super(game, request_type,
            min_app_version, max_app_version,
            min_log_version, max_log_version);
      this.features = features;
      this.start_date = start_date;
      this.end_date = end_date;
   }

   URLPath() {
      /**
       * @returns {string}
       */
      return "/populations/metrics"
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
      return {
         "game_id"        : this.Game(),
         "start_datetime" : this.start_date,
         "end_datetime"   : this.end_date,
         "metrics"        : this.features
      }
   }

   genLocalStorageKey() {
      /**
       * @returns {string}
       */
      let _start = ISODatetimeFormat(this.start_date ?? new Date());
      let _end   = ISODatetimeFormat(this.end_date   ?? new Date());
      return ["POPULATION", this.game_name, this.min_app_version, this.max_app_version,
               this.min_log_version, this.max_log_version, _start, _end].join("/")
   }
}
