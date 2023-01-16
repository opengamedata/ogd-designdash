export class ViewModes {
   static POPULATION = new ViewModes('POPULATION');
   static PLAYER = new ViewModes('PLAYER');
   static SESSION = new ViewModes('SESSION');
   static INITIAL = new ViewModes('INITIAL');

   constructor(name) { this.name = name; }
   get toString() { return this.name; }
}