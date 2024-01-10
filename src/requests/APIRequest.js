// global imports

// local imports
import { AvailableGames } from "../enums/AvailableGames";
import { ISODatetimeFormat } from "../utils/TimeFormat";

/**
 * @typedef {import('../enums/RequestModes').default} RequestModes
 */

export class APIRequest {
   /**
    * @param {RequestModes} request_mode
    * @param {string[]} extractor_list
    * @param {AvailableGames} game
    * @param {string | null} min_app_version
    * @param {string | null} max_app_version
    * @param {string | null} min_log_version
    * @param {string | null} max_log_version
    */
   constructor(request_mode, extractor_list=[], game=AvailableGames.EnumList()[0],
               min_app_version=null, max_app_version=null,
               min_log_version=null, max_log_version=null) {
      this.request_mode    = request_mode;
      this.extractor_list  = extractor_list;
      this.game_name       = game.name;
      this.min_app_version = min_app_version;
      this.max_app_version = max_app_version;
      this.min_log_version = min_log_version;
      this.max_log_version = max_log_version;
   }

   genLocalStorageKey() {
      return [this.request_mode.name, this.game_name, this.min_app_version, this.max_app_version, this.min_log_version, this.max_log_version].join("/")
   }

   get RequestMode() {
      return this.request_mode;
   }
   get Game() {
      return this.game_name;
   }
   get Extractors() {
      return this.extractor_list;
   }

   get LocalStorageKey() {
      return this.genLocalStorageKey();
   }
}

export class PopulationAPIRequest extends APIRequest {
   /**
    * @param {RequestModes} request_mode
    * @param {string[]} extractor_list
    * @param {AvailableGames} game
    * @param {string | null} min_app_version
    * @param {string | null} max_app_version
    * @param {string | null} min_log_version
    * @param {string | null} max_log_version
    * @param {Date | null} start_date
    * @param {Date | null} end_date
    */
   constructor(request_mode, extractor_list, game=AvailableGames.EnumList()[0],
               min_app_version=null, max_app_version=null,
               min_log_version=null, max_log_version=null,
               start_date=null, end_date=null) {
      super(request_mode, extractor_list, game,
            min_app_version, max_app_version,
            min_log_version, max_log_version);
      this.start_date = start_date;
      this.end_date = end_date;
   }

   genLocalStorageKey() {
      return [this.request_mode.name, "POPULATION", this.game_name, this.min_app_version, this.max_app_version, this.min_log_version, this.max_log_version, ISODatetimeFormat(this.start_date ?? new Date()), ISODatetimeFormat(this.end_date ?? new Date())].join("/")
   }
}

export class PlayerAPIRequest extends APIRequest {
   /**
    * @param {RequestModes} request_mode
    * @param {string[]} extractor_list
    * @param {AvailableGames} game
    * @param {string | null} min_app_version
    * @param {string | null} max_app_version
    * @param {string | null} min_log_version
    * @param {string | null} max_log_version
    * @param {Array.<string>} player_ids
    */
   constructor(request_mode, extractor_list, game=AvailableGames.EnumList()[0],
               min_app_version=null, max_app_version=null,
               min_log_version=null, max_log_version=null,
               player_ids=[]) {
      super(request_mode, extractor_list, game,
            min_app_version, max_app_version,
            min_log_version, max_log_version);
      this.player_ids = player_ids;
   }

   genLocalStorageKey() {
      return [this.request_mode.name, "PLAYER", this.game_name, this.min_app_version, this.max_app_version, this.min_log_version, this.max_log_version].join("/")
   }
}

export class PlayerAPIListRequest extends APIRequest {
   /**
    * @param {RequestModes} request_mode
    * @param {string[]} extractor_list
    * @param {AvailableGames} game
    * @param {string | null} min_app_version
    * @param {string | null} max_app_version
    * @param {string | null} min_log_version
    * @param {string | null} max_log_version
    * @param {Date | null} start_date
    * @param {Date | null} end_date
    */
   constructor(request_mode, extractor_list, game=AvailableGames.EnumList()[0],
               min_app_version=null, max_app_version=null,
               min_log_version=null, max_log_version=null,
               start_date=null, end_date=null) {
      super(request_mode, extractor_list, game,
            min_app_version, max_app_version,
            min_log_version, max_log_version);
      this.start_date = start_date;
      this.end_date = end_date;
   }

   genLocalStorageKey() {
      return [this.request_mode.name, "PLAYER_LIST", this.game_name, this.min_app_version, this.max_app_version, this.min_log_version, this.max_log_version].join("/")
   }
}

export class SessionAPIRequest extends APIRequest {
   /**
    * @param {RequestModes} request_mode
    * @param {string[]} extractor_list
    * @param {AvailableGames} game
    * @param {string | null} min_app_version
    * @param {string | null} max_app_version
    * @param {string | null} min_log_version
    * @param {string | null} max_log_version
    * @param {Array.<string>} session_ids
    */
   constructor(request_mode, extractor_list, game=AvailableGames.EnumList()[0],
               min_app_version=null, max_app_version=null,
               min_log_version=null, max_log_version=null,
               session_ids=[]) {
      super(request_mode, extractor_list, game,
            min_app_version, max_app_version,
            min_log_version, max_log_version);
      this.session_ids = session_ids;
   }

   genLocalStorageKey() {
      return [this.request_mode.name, "SESSION", this.game_name, this.min_app_version, this.max_app_version, this.min_log_version, this.max_log_version].join("/")
   }
}

export class SessionAPIListRequest extends APIRequest {
   /**
    * @param {RequestModes} request_mode
    * @param {string[]} extractor_list
    * @param {AvailableGames} game
    * @param {string | null} min_app_version
    * @param {string | null} max_app_version
    * @param {string | null} min_log_version
    * @param {string | null} max_log_version
    * @param {Date | null} start_date
    * @param {Date | null} end_date
    */
   constructor(request_mode, extractor_list, game=AvailableGames.EnumList()[0],
               min_app_version=null, max_app_version=null,
               min_log_version=null, max_log_version=null,
               start_date=null, end_date=null) {
      super(request_mode, extractor_list, game,
            min_app_version, max_app_version,
            min_log_version, max_log_version);
      this.start_date = start_date;
      this.end_date = end_date;
   }

   genLocalStorageKey() {
      return [this.request_mode.name, "SESSION_LIST", this.game_name, this.min_app_version, this.max_app_version, this.min_log_version, this.max_log_version].join("/")
   }
}