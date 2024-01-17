import EnumType from "./EnumType";

export class RequestTypes extends EnumType {
   static GET  = new RequestTypes('GET');
   static POST = new RequestTypes('POST');
   static PUT  = new RequestTypes('PUT');

   static EnumList() {
      return [RequestTypes.GET, RequestTypes.POST, RequestTypes.PUT]
   }

   static Default() {
      return this.GET;
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}
