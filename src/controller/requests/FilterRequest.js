import EnumType from "../../model/enums/EnumType";
import Timedelta from "../../model/Timedelta";

/**
 * @typedef {import("../../typedefs").AnyMap} AnyMap
 * @typedef {import("../../typedefs").Validator} Validator
 */

export class InputModes extends EnumType {
   static NONE      = new InputModes('NONE');
   static INPUT     = new InputModes('INPUT');
   static RANGE     = new InputModes('RANGE');
   static DROPDOWN  = new InputModes('DROPDOWN');
   static SEPARATOR = new InputModes('SEPARATOR');

   static EnumList() {
      return [InputModes.NONE, InputModes.INPUT, InputModes.RANGE, InputModes.DROPDOWN, InputModes.SEPARATOR]
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}

export class ValueModes extends EnumType {
   static NONE   = new ValueModes('NONE', 'No Value');
   static NUMBER = new ValueModes('NUMBER', 'Number');
   static TEXT   = new ValueModes('TEXT', 'Text');
   static DATE   = new ValueModes('DATE', 'Date');
   static TIME   = new ValueModes('TIME', 'Time');
   static ENUM   = new ValueModes('ENUM', 'Custom Enumerated Type');

   static EnumList() {
      return [ValueModes.NUMBER, ValueModes.TEXT, ValueModes.DATE, ValueModes.TIME, ValueModes.ENUM]
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}

export class FilterRequest {
   /**
    * 
    * @param {string} name 
    */
   constructor(name="") {
      this.name = name;
      /** @type {FilterItem[]} */
      this.items = []
   }

   get Items() {
      return this.items;
   }
   get Name() {
      return this.name;
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
    * @param {ValueModes} value_mode 
    * @param {Validator} validator
    */
   constructor(name, value_mode, validator = (value) => true) {
      this.name = name;
      this.value_mode = value_mode;
      this.validator = validator;
      this.input_mode = InputModes.SEPARATOR;
      this.initial_values = {};
   }

   get Name() { return this.name; }
   get ValueMode() { return this.value_mode; }
   get InputMode() { return this.input_mode; }
   get Validator() { return this.validator; }
   get InitialValues() { return this.initial_values; }
}

export class InputItem extends FilterItem {
   constructor(name, value_mode, initial_val, validator = (value) => true) {
      super(name, value_mode, validator);
      this.input_mode = InputModes.INPUT;
      this.initial_values[`${name}Value`] = initial_val
   }
}

export class RangeItem extends FilterItem {
   /**
    * 
    * @param {string} name 
    * @param {ValueModes} value_mode 
    * @param {any?} min_val 
    * @param {any?} max_val 
    * @param {Validator} validator 
    */
   constructor(name, value_mode, min_val=null, max_val=null, validator = (value) => true) {
      super(name, value_mode, validator);
      this.input_mode = InputModes.RANGE;
      this.initial_values[`${name}Min`] = min_val || RangeItem.DefaultValue(value_mode);
      this.initial_values[`${name}Max`] = max_val || RangeItem.DefaultValue(value_mode);
   }

   static DefaultValue(value_mode) {
      switch (value_mode) {
         case ValueModes.NUMBER:
            return 0;
         break;
         case ValueModes.TEXT:
            return "*";
         break;
         case ValueModes.DATE:
            return new Date();
         break;
         case ValueModes.TIME:
            return new Timedelta();
         break;
         case ValueModes.ENUM:
            return 0;
         break;
         case ValueModes.NONE:
         default:
            return null;
         break;
      }
   }
}


export class DropdownItem extends FilterItem {
   /**
    * 
    * @param {string} name 
    * @param {ValueModes} value_mode 
    * @param {typeof EnumType} type 
    * @param {EnumType?} selection 
    */
   constructor(name, value_mode, type, selection=null) {
      super(name, value_mode);
      this.input_mode = InputModes.DROPDOWN;
      this.initial_values[`${name}Type`] = type;
      this.initial_values[`${name}Selected`] = selection || DropdownItem.DefaultValue(value_mode, type);
   }

   /**
    * 
    * @param {ValueModes} value_mode 
    * @param {typeof EnumType} type 
    * @returns 
    */
   static DefaultValue(value_mode, type) {
      switch (value_mode) {
         case ValueModes.ENUM:
            return type.EnumList()[0]
         break;
         case ValueModes.NONE:
         case ValueModes.NUMBER:
         case ValueModes.TEXT:
         case ValueModes.DATE:
         case ValueModes.TIME:
         default:
            return null;
         break;
      }
   }
}

export class SeparatorItem extends FilterItem {
   /**
    * 
    * @param {string} name 
    */
   constructor(name) {
      super(name, ValueModes.NONE)
      this.input_mode = InputModes.SEPARATOR;
   }
}