export class ViewModes {
   static POPULATION = new ViewModes('POPULATION', 'Population');
   static PLAYER = new ViewModes('PLAYER', 'Player');
   static SESSION = new ViewModes('SESSION', 'Session');
   static INITIAL = new ViewModes('INITIAL', 'Initial');

   static ModeList() {
      return [ViewModes.POPULATION, ViewModes.PLAYER, ViewModes.SESSION, ViewModes.INITIAL]
   }

   constructor(name, readable=name) { this.name = name; this.readable = readable; }
   get asString() { return this.name; }
   get asDisplayString() { return this.readable; }
}