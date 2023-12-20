import EnumType from "../../enums/EnumType";

export class AllowedGames extends EnumType {
    static allowed_game_list = ['AQUALAB', 'JOURNALISM', 'PENGUINS']
    static EnumList() {
       return AllowedGames.allowed_game_list.map((game) => new AllowedGames(game));
    }
 
    static Default() {
       return this.EnumList()[0]
    }
 
    constructor(name, readable=name) {
       super(name, readable);
    }
 }