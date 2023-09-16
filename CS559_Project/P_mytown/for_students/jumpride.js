import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

let JumpRideObCtr = 0;
export class GrJumpRide extends GrObject {
    /**
     * @param {JumpRideProperties} params
     */
    constructor(params = {}) {
      let width = 4;
      let carousel = new T.Group();
  
      let base_geom = new T.CylinderGeometry(width, width, 1, 32);
      let base_mat = new T.MeshStandardMaterial({
        color: "lightblue",
        metalness: 0.3,
        roughness: 0.8
      });
      let base = new T.Mesh(base_geom, base_mat);
      base.translateY(0.5);
      carousel.add(base);
  
      let platform_group = new T.Group();
      base.add(platform_group);
      platform_group.translateY(0.5);
  
      let platform_geom = new T.CylinderGeometry(
        0.95 * width,
        0.95 * width,
        0.2,
        32
      );
      let platform_mat = new T.MeshStandardMaterial({
        color: "gold",
        metalness: 0.3,
        roughness: 0.8
      });
      let platform = new T.Mesh(platform_geom, platform_mat);
      platform_group.add(platform);
  
      let cpole_geom = new T.CylinderGeometry(0.3 * width, 0.3 * width, 15, 16);
      let cpole_mat = new T.MeshStandardMaterial({
        color: "gold",
        metalness: 0.8,
        roughness: 0.5
      });
      let cpole = new T.Mesh(cpole_geom, cpole_mat);
      platform_group.add(cpole);
      cpole.translateY(6.5);
  
      let top_trim = new T.Mesh(platform_geom, platform_mat);
      platform_group.add(top_trim);
      top_trim.translateY(13.6);
  
      let move = new T.CylinderGeometry(width/1.5, width/1.5, 1, 16);
      let opole_mat = new T.MeshBasicMaterial({
        color: "pink",
      });
      let cab = new T.Mesh(
        move,
        opole_mat
      )
      let roof_geom = new T.ConeGeometry(width, 0.5 * width, 32, 4);
      let roof = new T.Mesh(roof_geom, base_mat);
      carousel.add(roof);
      roof.translateY(15.8);
      carousel.add(cab);
      // note that we have to make the Object3D before we can call
      // super and we have to call super before we can use this
      super(`JumpRide-${JumpRideObCtr++}`, carousel);
      this.whole_ob = carousel;
      this.platform = platform_group;
      this.jump = cab;
      this.position = 0;
      this.go = true;
      // put the object in its place
      this.whole_ob.position.x = params.x ? Number(params.x) : 0;
      this.whole_ob.position.y = params.y ? Number(params.y) : 0;
      this.whole_ob.position.z = params.z ? Number(params.z) : 0;
      let scale = params.size ? Number(params.size) : 1;
      carousel.scale.set(scale, scale, scale);
    }
    /**
     * StepWorld method
     * @param {*} delta 
     * @param {*} timeOfDay 
     */
    stepWorld(delta, timeOfDay) {
      if(this.position < 14 && this.go == true){
        this.position += 0.2;
        if(Math.round(this.position) == 14){
          this.go = false;
        }
      }
      else{
        this.position -= 0.2;
        if(Math.round(this.position) == 1){
          this.go = true;
        }
      }
      this.jump.position.set(0,this.position,0);
    }
  }
  
  