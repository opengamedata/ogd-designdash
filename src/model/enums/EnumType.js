export default class EnumType {
   /**
    * @returns {EnumType[]}
    */
   static EnumList() {
      throw new Error("Tried to call EnumList on an EnumType that did not implement it!")
      return [];
   }
}