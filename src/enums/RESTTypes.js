import EnumType from "./EnumType";

export class RESTTypes extends EnumType {
   static NONE = new RESTTypes("NONE");
   static GET  = new RESTTypes('GET');
   static POST = new RESTTypes('POST');
   static PUT  = new RESTTypes('PUT');

   static EnumList() {
      return [RESTTypes.NONE, RESTTypes.GET, RESTTypes.POST, RESTTypes.PUT]
   }

   static Default() {
      return this.GET;
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}
