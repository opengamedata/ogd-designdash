import VisualizerModel from "../BaseVisualizer/VisualizerModel";

export class HistogramModel extends VisualizerModel {
   /**
    * @typedef {object} JobGraphMeta
    * @property {object} playerSummary
    * @property {object} populationSummary
    * @property {number} maxAvgTime
    * @property {number} minAvgTime
    */

   /**
    * @param {string?} game_name 
    * @param {object?} raw_data 
    */

   constructor(game_name, raw_data) {
      var data = [];
      for (var i = 0; i < 1000; i++) {
         var randomValue = Math.floor(Math.random() * 100) + 1; // Generates a random number between 1 and 100 (inclusive)
         data.push(randomValue);
      }
      raw_data = data;
      game_name = "counter_test";
      console.log(data);
      console.log(`In HistogramModel, got game name of ${game_name} and raw_data with ${Object.keys(raw_data ?? {}).length} keys`)
      super(game_name || "UNKNOWN GAME", raw_data)
   }

   /**
    * TODO: 
    * In constructor, data = a list of 1000 random values
    * get HistogramValues() (similar to visualizerModel get Data())
    * d3:
    * y = count of x value
    * x = x, (range, min - max, bucket)
    * 
    * Feature data
    * (rawevents) -> 
    * buttonClick                                   event
    * count                                         feature
    * count/avg/... of all buttonClick              population level feature
    * count                                         single player
    * count                                         gameplay session (each time login)
    * 
    * x = single player
    * y = each count of single player
    * 
    * player list that plays during xx-xx?
    */
}