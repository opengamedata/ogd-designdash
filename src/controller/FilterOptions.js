import Timedelta from "../model/Timedelta";

export class FilterOptions {
   /**
    * @param {number} min_jobs
    * @param {Timedelta | null} min_playtime
    * @param {Timedelta | null} max_playtime
    */
   constructor(min_jobs=1, min_playtime=null, max_playtime=null) {
      this.min_jobs = min_jobs;
      this.min_playtime = min_playtime;
      this.max_playtime = max_playtime;
   }
}