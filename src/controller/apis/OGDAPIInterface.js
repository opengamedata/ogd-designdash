import { SelectionOptions } from "../SelectionOptions";

export default class OGDAPIInterface {
   /**
    * @param {SelectionOptions} selectionOptions 
    * @param {string[]} metrics 
    */
   static fetch(selectionOptions, metrics) {
      throw new Error("API must implement the fetch function!");
   }
}