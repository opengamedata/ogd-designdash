import EnumType from "./EnumType";

export class ViewModes extends EnumType {
   static POPULATION = new ViewModes('POPULATION', 'Population');
   static PLAYER = new ViewModes('PLAYER', 'Player');
   static SESSION = new ViewModes('SESSION', 'Session');
   static INITIAL = new ViewModes('INITIAL', 'Initial');

   static EnumList() {
      return [ViewModes.POPULATION, ViewModes.PLAYER, ViewModes.SESSION, ViewModes.INITIAL];
   }

   static Default() {
      return this.INITIAL;
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}