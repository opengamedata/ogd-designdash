import EnumType from "./EnumType";
import { vis_games } from '../config';

export class AvailableGames extends EnumType {
   static EnumList() {
      return vis_games.map((game) => new AvailableGames(game));
   }

   static Default() {
      return this.EnumList()[0]
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}