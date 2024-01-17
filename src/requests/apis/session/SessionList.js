import { APIRequest } from '../../APIRequest';
import { AvailableGames } from "../../../enums/AvailableGames";
import { RequestTypes }   from "../../../enums/RequestTypes"
import { ISODatetimeFormat } from '../../../utils/TimeFormat';

export class SessionListRequest extends APIRequest {
   /**
    * @param {RequestTypes}  request_type
    * @param {AvailableGames} game
    * @param {string | null} min_app_version
    * @param {string | null} max_app_version
    * @param {string | null} min_log_version
    * @param {string | null} max_log_version
    * @param {Date | null} start_date
    * @param {Date | null} end_date
    */
   constructor(request_type=RequestTypes.GET,
               game=AvailableGames.EnumList()[0],
               min_app_version=null, max_app_version=null,
               min_log_version=null, max_log_version=null,
               start_date=null, end_date=null) {
      super(request_type, game,
            min_app_version, max_app_version,
            min_log_version, max_log_version);
      this.start_date = start_date;
      this.end_date = end_date;
   }

   URLPath() {
      /**
       * @returns {string}
       */
      return `/sessions/list/${this.Game()}`
   }
   HeaderParams() {
      /**
       * @returns {Object.<string, object>}
       */
      return {
         "start_datetime" : this.start_date,
         "end_datetime"   : this.end_date
      }
   }
   BodyParams() {
      /**
       * @returns {Object.<string, object>}
       */
      return {}
   }

   genLocalStorageKey() {
      return ["SESSION", this.game_name, this.min_app_version, this.max_app_version, this.min_log_version, this.max_log_version, ISODatetimeFormat(this.start_date ?? new Date()), ISODatetimeFormat(this.end_date ?? new Date())].join("/")
   }
}
