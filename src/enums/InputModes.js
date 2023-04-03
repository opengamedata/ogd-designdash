import EnumType from "../../model/enums/EnumType";

export default class InputModes extends EnumType {
   static NONE      = new InputModes('NONE');
   static INPUT     = new InputModes('INPUT');
   static RANGE     = new InputModes('RANGE');
   static DROPDOWN  = new InputModes('DROPDOWN');
   static SEPARATOR = new InputModes('SEPARATOR');

   static EnumList() {
      return [InputModes.NONE, InputModes.INPUT, InputModes.RANGE, InputModes.DROPDOWN, InputModes.SEPARATOR]
   }

   static Default() {
      return this.NONE;
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}
