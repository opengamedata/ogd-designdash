import VisualizerModel from "../BaseVisualizer/VisualizerModel";

export class BarplotModel extends VisualizerModel {
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
      // var data = [];
      // for (var i = 0; i < 1000; i++) {
      //    var randomValue = Math.floor(Math.random() * 100) + 1; // Generates a random number between 1 and 100 (inclusive)
      //    data.push(randomValue);
      // }
      const dict = { "level1": 100, "level2": 40, "level3": 20, "level4": 10, "level5": 5, "level6": 3 };
      raw_data = dict;
      game_name = "counter_test";
      console.log(dict);
      console.log(`In BarplotModel, got game name of ${game_name} and raw_data with ${Object.keys(raw_data ?? {}).length} keys`)
      super(game_name || "UNKNOWN GAME", raw_data)
   }
}