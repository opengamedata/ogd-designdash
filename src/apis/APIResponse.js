import EnumType from "../enums/EnumType";
import { RESTTypes }   from "../enums/RESTTypes"

export class ResponseStatus extends EnumType {
   static NONE    = new ResponseStatus("NONE");
   static SUCCESS = new ResponseStatus("SUCCESS");
   static ERR_SRV = new ResponseStatus("SERVER ERROR");
   static ERR_REQ = new ResponseStatus("REQUEST ERROR");

   static EnumList() {
      return [ResponseStatus.NONE, ResponseStatus.SUCCESS, ResponseStatus.ERR_SRV, ResponseStatus.ERR_REQ];
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}

export default class APIResponse {
   /**
    * 
    * @param {Object.<string, any>?} response_object 
    */
   constructor(response_object) {
      if (response_object != null) {
         /** @type {RESTTypes} */
         this.req_type    = RESTTypes.FromName(response_object.type) ?? RESTTypes.NONE;
         try {
            /** @type {object} */
            this.values_dict = JSON.parse(response_object.val);
         }
         catch (err) {
            console.error(`Got an error when trying to JSON.parse the following:\n${response_object}`)
            this.values_dict = response_object.val
         }
         /** @type {string} */
         this.message     = response_object.msg;
         /** @type {ResponseStatus} */
         this.status      = ResponseStatus.FromName(response_object.status) ?? ResponseStatus.NONE;
      }
      else {
         this.message     = "FAIL: Response object was null";
         this.status      = ResponseStatus.NONE;
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