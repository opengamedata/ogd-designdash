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
    game_name = "counter_test";
    console.log(
      `In HistogramModel, got game name of ${game_name} and raw_data with ${
        Object.keys(raw_data ?? {}).length
      } keys`
    );
    super(game_name || "UNKNOWN GAME", raw_data);
  }
}
