import VisualizerModel from "./VisualizerModel";

export class PlayerTimelineModel extends VisualizerModel {
   /**
    * 
    * @param {string} game_name
    * @param {object} raw_data 
    */
   constructor(game_name, raw_data) {
      super(game_name, raw_data);
      this.val = 0;
   }

}