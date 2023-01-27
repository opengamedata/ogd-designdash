import EnumType from "../enums/EnumType";

/**
 * @typedef {import("../../typedefs").AnyMap} AnyMap
 * @typedef {import("../../typedefs").MapSetter} MapSetter
 */

export class InputModes extends EnumType {
   static INPUT = new InputModes('INPUT');
   static RANGE = new InputModes('RANGE');
   static DROPDOWN = new InputModes('DROPDOWN');

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

   static EnumList() {
      return [ValueModes.NUMBER, ValueModes.TEXT, ValueModes.DATE, ValueModes.TIME]
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}

export class FilterRequest {
   /**
    * @param {MapSetter} updateRequesterState
    */
   constructor(updateRequesterState) {
      this.updateRequesterState = updateRequesterState;
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
    * 
    * @param {string} name
    * @param {InputModes} input_mode 
    * @param {ValueModes} value_mode 
    * @param {AnyMap} start_values
    */
   constructor(name, input_mode, value_mode, start_values) {
      this.name = name;
      this.input_mode = input_mode;
      this.value_mode = value_mode;
      this.start_values = start_values;
   }
}