import EnumType from "./EnumType";

export class InputModes extends EnumType {
   static NUMBER = new InputModes('NUMBER', 'Number');
   static TEXT = new InputModes('TEXT', 'Text');
   static DATE = new InputModes('DATE', 'Date');
   static TIME = new InputModes('TIME', 'Time');

   static EnumList() {
      return [InputModes.NUMBER, InputModes.TEXT, InputModes.DATE, InputModes.TIME]
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}