import Timedelta from "../model/Timedelta";

export class FilterOptions {
   /**
    * @param {number} min_jobs
    * @param {Timedelta} min_playtime
    * @param {Timedelta} max_playtime
    */
   constructor(min_jobs=1, min_playtime=new Timedelta(), max_playtime=new Timedelta()) {
      this.min_jobs = min_jobs;
      this.min_playtime = min_playtime;
      this.max_playtime = max_playtime;
   }
}