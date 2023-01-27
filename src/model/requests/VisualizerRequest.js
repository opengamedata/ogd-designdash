export default class VisualizerRequest {
   get APIRequest() {
      throw new Error(`Request subclass ${this.constructor.name} failed to implement APIRequest getter!`);
   }

   get LocalStorageKey() {
      throw new Error(`Request subclass ${this.constructor.name} failed to implement LocalStorageKey getter!`);
   }

   get FilterRequest() {
      throw new Error(`Request subclass ${this.constructor.name} failed to implement FilterRequest getter!`);
   }
}