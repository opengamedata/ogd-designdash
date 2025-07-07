import EnumType from "../../enums/EnumType";
/**
 * Default options for dropdown item
 */
export class AvailableModes extends EnumType {
   static EnumList() {
      return ["File", "API"].map((mode) => new AvailableModes(mode));
   }

   static Default() {
      return this.EnumList()[0]
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}