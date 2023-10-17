import Timedelta from "../utils/Timedelta";
import InputModes from "../enums/InputModes";
import ValueModes from "../enums/ValueModes";
import EnumType from "../enums/EnumType"; // Need the import to quiet typing errors in comment blocks.

/**
 * @typedef {import("../typedefs").Validator} Validator
 */

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

   get InitialState() {
      let init_state = {};
      this.Items.forEach(
         (elem) => {
            Object.assign(init_state, elem.InitialValues);
         }
      )
      return init_state;
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
      this.initial_values[`${name}Min`] = min_val ?? RangeItem.DefaultValue(value_mode);
      this.initial_values[`${name}Max`] = max_val ?? RangeItem.DefaultValue(value_mode);
   }

   static DefaultValue(value_mode) {
      let ret_val;
      switch (value_mode) {
         case ValueModes.NUMBER:
            ret_val = 0;
         break;
         case ValueModes.TEXT:
            ret_val = "*";
         break;
         case ValueModes.DATE:
            ret_val = new Date();
         break;
         case ValueModes.TIME:
            ret_val = new Timedelta();
         break;
         case ValueModes.ENUM:
            ret_val = 0;
         break;
         case ValueModes.NONE:
         default:
            ret_val = null;
         break;
      }
      return ret_val;
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
      this.initial_values[`${name}Selected`] = selection ?? DropdownItem.DefaultValue(value_mode, type);
   }

   /**
    * 
    * @param {ValueModes} value_mode 
    * @param {typeof EnumType} type 
    * @returns {EnumType?}
    */
   static DefaultValue(value_mode, type) {
      /** @type {EnumType?} */
      let ret_val;
      switch (value_mode) {
         case ValueModes.ENUM:
            ret_val = type.EnumList()[0]
         break;
         case ValueModes.NONE:
         case ValueModes.NUMBER:
         case ValueModes.TEXT:
         case ValueModes.DATE:
         case ValueModes.TIME:
         default:
            ret_val = null;
         break;
      }
      return ret_val;
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