import EnumType from "../../enums/EnumType";
import { AvailableGames } from "../BaseVisualizer/AvailableGames";
/**
 * This class shows the options of games in the dropdown item
 */
export class JobGraphGames extends AvailableGames {
    static EnumList() {
        return ['AQUALAB'].map((game) => new AvailableGames(game));
     }
 }