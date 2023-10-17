import EnumType from "./EnumType";

export default class ValueModes extends EnumType {
   static NONE   = new ValueModes('NONE', 'No Value');
   static NUMBER = new ValueModes('NUMBER', 'Number');
   static TEXT   = new ValueModes('TEXT', 'Text');
   static DATE   = new ValueModes('DATE', 'Date');
   static TIME   = new ValueModes('TIME', 'Time');
   static ENUM   = new ValueModes('ENUM', 'Custom Enumerated Type');

   static EnumList() {
      return [ValueModes.NUMBER, ValueModes.TEXT, ValueModes.DATE, ValueModes.TIME, ValueModes.ENUM]
   }

   static Default() {
      return this.NONE;
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}
