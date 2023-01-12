import VisualizerModel from "./VisualizerModel";

 /**
 * @typedef {import('../../typedefs').FeaturesMap} FeaturesMap
 */

export class PlayerTimelineModel {
   constructor() {
      this.val = 0;
   }

   /**
    * @returns {Object.<string, string[]>}
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