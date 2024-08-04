import EnumType from "./EnumType";

export class SessionOrPlayerEnums extends EnumType {
   static EnumList() {
      return ['Session', 'Player'].map((choice) => new SessionOrPlayerEnums(choice));
   }

   static Default() {
      return this.EnumList()[0]
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}