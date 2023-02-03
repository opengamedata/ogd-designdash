import EnumType from "../../model/enums/EnumType";

/**
 * @typedef {import("../../typedefs").AnyMap} AnyMap
 * @typedef {import("../../typedefs").Validator} Validator
 */

export class InputModes extends EnumType {
   static INPUT = new InputModes('INPUT');
   static RANGE = new InputModes('RANGE');
   static DROPDOWN = new InputModes('DROPDOWN');
   static SEPARATOR = new InputModes('SEPARATOR');

   static EnumList() {
      return [InputModes.RANGE, InputModes.DROPDOWN]
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}

export class ValueModes extends EnumType {
   static NUMBER = new ValueModes('NUMBER', 'Number');
   static TEXT = new ValueModes('TEXT', 'Text');
   static DATE = new ValueModes('DATE', 'Date');
   static TIME = new ValueModes('TIME', 'Time');
   static ENUM = new ValueModes('ENUM', 'Custom Enumerated Type');

   static EnumList() {
      return [ValueModes.NUMBER, ValueModes.TEXT, ValueModes.DATE, ValueModes.TIME]
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}

export class FilterRequest {
   constructor() {
      /** @type {FilterItem[]} */
      this.items = []
   }

   get Items() {
      return this.items;
   }

   /**
    * 
    * @param {FilterItem} new_item 
    */
   AddItem(new_item) {
      this.items.push(new_item);
   }
}

export class FilterItem {
   /**
    * Defines an input item to render for filtering.
    * @param {string} name
    * @param {InputModes} input_mode 
    * @param {ValueModes} value_mode 
    * @param {AnyMap} start_values
    * @param {Validator} validator
    */
   constructor(name, input_mode, value_mode, start_values, validator = (value) => true) {
      this.name = name;
      this.input_mode = input_mode;
      this.value_mode = value_mode;
      this.start_values = start_values;
      this.validator = validator;
   }

   get Name() { return this.name; }
   get InputMode() { return this.input_mode; }
   get ValueMode() { return this.value_mode; }
   get InitialValues() { return this.start_values; }
   get Validator() { return this.validator; }
}