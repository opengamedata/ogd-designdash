import EnumType from "./EnumType";

export default class RequestModes extends EnumType {
   static POPULATION = new RequestModes('POPULATION', 'Population');
   static PLAYER = new RequestModes('PLAYER', 'Player');
   static SESSION = new RequestModes('SESSION', 'Session');

   static EnumList() {
      return [RequestModes.POPULATION, RequestModes.PLAYER, RequestModes.SESSION]
   }

   static Default() {
      return this.POPULATION;
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}
