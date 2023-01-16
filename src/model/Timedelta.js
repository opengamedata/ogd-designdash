export default class Timedelta {
   /**
    * 
    * @param {number} hours 
    * @param {number} minutes 
    * @param {number} seconds 
    * @param {number} milliseconds 
    * @returns 
    */
   constructor(hours=0, minutes=0, seconds=0, milliseconds=0) {
      let overseconds = Math.floor(milliseconds / 1000);
      this.milliseconds = milliseconds - overseconds*1000;

      seconds += overseconds;
      let overminutes = Math.floor(seconds / 60);
      this.seconds = seconds - overminutes*60;

      minutes += overminutes
      let overhours = Math.floor(minutes / 60);
      this.minutes = minutes - overhours*60

      hours += overhours;
      this.hours = hours;
   }

   static fromMillis(milliseconds) {
      let hours = Math.floor(milliseconds / 1000 / 60 / 60);
      milliseconds -= hours*1000*60*60;
      let minutes = Math.floor(milliseconds / 1000 / 60);
      milliseconds -= minutes*1000*60;
      let seconds = Math.floor(milliseconds / 1000);
      milliseconds -= seconds*1000;
      return new Timedelta(hours, minutes, seconds, milliseconds);
   }

   /**
    * 
    * @param {Date} date1 
    * @param {Date} date2 
    */
   static DateDifference(date1, date2) {
      let diff = Math.abs(date1.valueOf() - date2.valueOf())
      return Timedelta.fromMillis(diff);
   }

   /**
    * @returns {number}
    */
   get TotalHours() {
      return Math.floor(this.TotalMilliseconds / 1000 / 60 / 60);
   }

   /**
    * @returns {number}
    */
   get Hours() {
      return this.hours
   }

   /**
    * @param number
    */
   set SetHours(newHours) {
      this.hours = newHours;
   }

   /**
    * @returns {number}
    */
   get TotalMinutes() {
      return Math.floor(this.TotalMilliseconds / 1000 / 60)
   }

   /**
    * @returns {number}
    */
   get Minutes() {
      return this.minutes
   }

   /**
    * @param number
    */
   set SetMinutes(newMinutes) {
      let overhours = Math.floor(newMinutes / 60);
      this.minutes = newMinutes - overhours*60;
      this.SetHours = this.Hours + overhours;
   }

   /**
    * @returns {number}
    */
   get TotalSeconds() {
      return Math.floor(this.TotalMilliseconds / 1000)
   }

   /**
    * @returns {number}
    */
   get Seconds() {
      return this.seconds
   }

   /**
    * @param number
    */
   set SetSeconds(newSeconds) {
      let overminutes = Math.floor(newSeconds / 60);
      this.seconds = newSeconds - overminutes*60;
      this.SetMinutes = this.Minutes + overminutes;
   }

   /**
    * @returns {number}
    */
   get TotalMilliseconds() {
      return this.Hours*60*60*1000 + this.Minutes*60*1000 + this.Seconds*1000 + this.Milliseconds;
   }

   /**
    * @returns {number}
    */
   get Milliseconds() {
      return this.milliseconds;
   }

   /**
    * @param number
    */
   set SetMilliseconds(newMilliseconds) {
      let overSeconds = Math.floor(newMilliseconds / 1000);
      this.milliseconds = newMilliseconds - overSeconds*1000;
      this.SetSeconds = this.Seconds + overSeconds;
   }

   /**
    * @returns {string}
    */
   get ToString() {
      return `${this.Hours}:${this.Minutes}:${this.Seconds}.${this.Milliseconds}`
   }
}