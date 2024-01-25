import EnumType from "../enums/EnumType";
import { RESTTypes }   from "../enums/RESTTypes"

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

export default class APIResult {
   /**
    * 
    * @param {object?} response_object 
    */
   constructor(response_object) {
      if (response_object != null) {
         /** @type {RESTTypes} */
         this.req_type    = RESTTypes.FromName(response_object.type) ?? RESTTypes.NONE;
         /** @type {object} */
         this.values_dict = JSON.parse(response_object.val);
         /** @type {string} */
         this.message     = response_object.msg;
         /** @type {ResultStatus} */
         this.status      = ResultStatus.FromName(response_object.status) ?? ResultStatus.NONE;
      }
      else {
         this.message     = "FAIL: Response object was null";
         this.status      = ResultStatus.NONE;
         this.req_type    = RESTTypes.NONE;
         this.values_dict = {};
      }
   }

   get RequestType() {
      return this.req_type;
   }
   get Values() {
      return this.values_dict;
   }
   get Message() {
      return this.message;
   }
   get Status() {
      return this.status;
   }
   get asDict() {
      return {
         type: this.req_type,
         val: this.values_dict,
         msg: this.message,
         status: this.status
      }
   }
}