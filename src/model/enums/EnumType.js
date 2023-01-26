export default class EnumType {
   /**
    * @param {string} name 
    * @param {string} readable 
    */
   constructor(name, readable) { 
      this.name = name
      this.readable = readable
   }

   /**
    * @returns {EnumType[]}
    */
   static EnumList() {
      throw new Error("Tried to call EnumList on an EnumType that did not implement it!")
      return [];
   }
   /**
    * @returns {string}
    */
   get asString() {
      return this.name;
   }
   /**
    * @returns {string}
    */
   get asDisplayString() {
      return this.readable;
   }
}