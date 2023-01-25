export class InputModes {
   static NUMBER = new InputModes('NUMBER');
   static TEXT = new InputModes('TEXT');
   static DATE = new InputModes('DATE');
   static TIME = new InputModes('TIME');

   constructor(name) { this.name = name; }
   get asString() { return this.name; }
}