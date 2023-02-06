export default class APIResponse {
   /**
    * 
    * @param {object?} response_object 
    */
   constructor(response_object) {
      if (response_object != null) {
         this.message     = response_object.msg;
         this.status      = response_object.status;
         this.req_type    = response_object.type;
         this.values_dict = response_object.val;
      }
      else {
         this.message     = "FAIL: Response object was null";
         this.status      = "FAIL";
         this.req_type    = "UNKNOWN"
         this.values_dict = {};
      }
   }
}