export default class VisualizerModel {
   /**
    * 
    * @param {string} game_name
    * @param {object} raw_data 
    */
   constructor(game_name, raw_data) {
      this.game_name = game_name
      this.raw_data = raw_data
   }

   dataNotEqual(raw_data) {
      // TODO: implement this.
      console.log("dataNotEqual not implemented yet, in the future this will compare hashes on raw_data.")
      return true;
   }

   get Game() {
      return this.game_name;
   }
   get Data() {
      return this.raw_data
   }
}