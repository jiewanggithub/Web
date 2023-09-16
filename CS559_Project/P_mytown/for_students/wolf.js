import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { OBJLoader } from "../libs/CS559-Three/examples/jsm/loaders/OBJLoader.js";
let wolfCount = 0;
export class Wolf extends GrObject {
    constructor() {
      let loader = new OBJLoader();
      let obj = new T.Object3D();
      super(`Wolf-${++wolfCount}`, obj);
      let wolf = loader.loadAsync("wolf.obj");
      wolf.then(function(wolf) {
        obj.add(wolf);
      });
      this.obj = obj;
      obj.position.set(-7, 6, 4);
      obj.scale.set(10, 10, 10);
    }
  }