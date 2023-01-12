 /**
 * @typedef {import('../../typedefs').FeaturesMap} FeaturesMap
 */

export default class VisualizerModel {
   /**
    * @returns {FeaturesMap}
    */
   static RequiredExtractors() {
      throw new Error("VisualizerModel subclass did not implement RequiredExtractors function!");
   }
}