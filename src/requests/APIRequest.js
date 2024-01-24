// global imports

// local imports
import { AvailableGames } from "../visualizers/BaseVisualizer/AvailableGames";
import { RESTTypes }   from "../enums/RESTTypes"

export class APIRequest {
   /**
    * @param {RESTTypes}  request_type
    * @param {AvailableGames} game
    * @param {string | null} min_app_version
    * @param {string | null} max_app_version
    * @param {string | null} min_log_version
    * @param {string | null} max_log_version
    */
   constructor(request_type=RESTTypes.Default(),
               game=AvailableGames.EnumList()[0],
               min_app_version=null, max_app_version=null,
               min_log_version=null, max_log_version=null) {
      if (this.constructor === APIRequest) {
         throw new TypeError("Tried to instantiate abstract class APIRequest!")
      }
      this.request_type    = request_type
      this.game_name       = game.name;
      this.min_app_version = min_app_version;
      this.max_app_version = max_app_version;
      this.min_log_version = min_log_version;
      this.max_log_version = max_log_version;
   }

   /**
    * @returns {string}
    */
   genLocalStorageKey() {
      return [this.game_name, this.min_app_version, this.max_app_version, this.min_log_version, this.max_log_version].join("/")
   }
   /**
    * @returns {string}
    */
   URLPath() {
      throw new TypeError("API request must implement the URLPath function!");
   }
   /**
    * @returns {URLSearchParams}
    */
   HeaderParams() {
      throw new TypeError("API request must implement the HeaderParams function!");
   }
   /**
    * @returns {FormData}
    */
   BodyParams() {
      throw new TypeError("API request must implement the BodyParams function!");
   }

   /**
    * @returns {RESTTypes}
    */
   get RequestType() {
      return this.request_type
   }
   /**
    * @returns {string}
    */
   get Game() {
      return this.game_name;
   }
   get LocalStorageKey() {
      return this.genLocalStorageKey();
   }

   /**
    * 
    * @param {string} base_url 
    * @returns {URL}
    */
   FetchURL(base_url) {
      let searchParams = null;
      if (Object.keys(this.HeaderParams()).length > 0) {
         searchParams = []
         let callback = (key) => searchParams.push(`${key}=${encodeURIComponent(this.HeaderParams()[key])}`);
         Object.keys(this.HeaderParams()).forEach( callback );
      }

      // fetch by url
      const _path = searchParams ? `${this.URLPath()}?${searchParams.join("&")}` : this.URLPath()
      return new URL(base_url + _path);
   }
   FetchOptions() {
      let options = {
         method : this.RequestType.asString,
         body   : this.BodyParams()
      };
      return options
   }
}
