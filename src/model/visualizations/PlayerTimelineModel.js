import VisualizerModel from "./VisualizerModel";

 /**
 * @typedef {import('../../typedefs').FeaturesMap} FeaturesMap
 */

export class PlayerTimelineModel extends VisualizerModel {
   constructor() {
      super();
      this.val = 0;
   }

   /**
    * @returns {FeaturesMap}
    */
   static RequiredExtractors() {
      return {
         "AQUALAB" : [
            'JobsCompleted',
            'SessionID',
            'SessionDuration'
         ],
         "SHIPWRECKS" : [
            'JobsCompleted',
            'SessionID',
            'SessionDuration'
         ]
      };
   }
}