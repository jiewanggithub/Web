import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";
export class Shader extends GrObject {
    constructor() {
      let greyMat = new T.MeshStandardMaterial({color: "grey"});
      let shaderMat = shaderMaterial("shadervs.vs", "shaderfs.fs", {
        side: T.DoubleSide,
        uniforms: {
          time: {value: 0},
          mouse: {value: new T.Vector2(1,1)},
          resolution: {value: new T.Vector2(1000,1000)}
        },
      });
      shaderMat.extensions.derivatives = true;
      
      let obj = new T.Mesh(
        new T.BoxGeometry(30,10,0.1), [
          greyMat,
          greyMat,
          greyMat,
          greyMat,
          greyMat,
          shaderMat,
      ]);
      obj.position.set(-25,7,10);
      
      super("Display", obj);
      this.shaderMat = shaderMat;
      this.stepCnt = 0;
    }
    
    stepWorld(delta) {
      this.stepCnt += delta/1000;
      this.shaderMat.uniforms.time.value = this.stepCnt;
    }
  }