import EnumType from "./EnumType";

export default class RequestModes extends EnumType {
   static POPULATION = new RequestModes('POPULATION', 'Population');
   static PLAYER = new RequestModes('PLAYER', 'Player');
   static SESSION = new RequestModes('SESSION', 'Session');
   static POPULATION_AVAILABLE = new RequestModes('POPULATION_AVAILABLE', 'Population Available Metrics');
   static PLAYER_AVAILABLE = new RequestModes('PLAYER_AVAILABLE', 'Player Available Metrics');
   static SESSION_AVAILABLE = new RequestModes('SESSION_AVAILABLE', 'Session Available Metrics');
   static PLAYER_LIST = new RequestModes('PLAYER_LIST', 'List of Players');
   static SESSION_LIST = new RequestModes('SESSION_LIST', 'List of Sessions');

   static EnumList() {
      return [RequestModes.POPULATION, RequestModes.PLAYER, RequestModes.SESSION,
              RequestModes.POPULATION_AVAILABLE, RequestModes.PLAYER_AVAILABLE,
              RequestModes.SESSION_AVAILABLE, RequestModes.PLAYER_LIST, RequestModes.SESSION_LIST]
   }

   static Default() {
      return this.POPULATION;
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}
