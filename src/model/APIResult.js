import EnumType from "./enums/EnumType";

export class ResultStatus extends EnumType {
   static NONE    = new ResultStatus("NONE");
   static SUCCESS = new ResultStatus("SUCCESS");
   static ERR_SRV = new ResultStatus("SERVER ERROR");
   static ERR_REQ = new ResultStatus("REQUEST ERROR");

   static EnumList() {
      return [ResultStatus.NONE, ResultStatus.SUCCESS, ResultStatus.ERR_SRV, ResultStatus.ERR_REQ];
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}

export class RESTType extends EnumType {
   static NONE = new RESTType("NONE");
   static GET  = new RESTType("GET");
   static POST = new RESTType("POST");
   static PUT  = new RESTType("PUT");

   static EnumList() {
      return [RESTType.NONE, RESTType.GET, RESTType.POST, RESTType.PUT];
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}

export default class APIResult {
   /**
    * 
    * @param {object?} response_object 
    */
   constructor(response_object) {
      if (response_object != null) {
         /** @type {string} */
         this.message     = response_object.msg;
         /** @type {ResultStatus} */
         this.status      = ResultStatus.FromName(response_object.status) || ResultStatus.NONE;
         /** @type {RESTType} */
         this.req_type    = RESTType.FromName(response_object.type) || RESTType.NONE;
         /** @type {object} */
         this.values_dict = response_object.val;
      }
      else {
         this.message     = "FAIL: Response object was null";
         this.status      = ResultStatus.NONE;
         this.req_type    = RESTType.NONE;
         this.values_dict = {};
      }
   }

   get Message() {
      return this.message;
   }
   get Status() {
      return this.status;
   }
   get RequestType() {
      return this.req_type;
   }
   get Values() {
      return this.values_dict;
   }
   get asDict() {
      return {
         msg: this.message,
         status: this.status,
         type: this.req_type,
         val: this.values_dict
      }
   }
}