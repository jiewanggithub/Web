import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { OBJLoader } from "../libs/CS559-Three/examples/jsm/loaders/OBJLoader.js";

let SwingRideObCtr = 0;
// A Carousel.
/**
 * @typedef SwingRideProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrSwingRide extends GrObject {
  /**
   * @param {SwingRideProperties} params
   */
  constructor(params = {}) {
    let width = 6;
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

    let cpole_geom = new T.CylinderGeometry(0.3 * width, 0.3 * width, 9, 16);
    let cpole_mat = new T.MeshStandardMaterial({
      color: "gold",
      metalness: 0.8,
      roughness: 0.5
    });
    let cpole = new T.Mesh(cpole_geom, cpole_mat);
    platform_group.add(cpole);
    cpole.translateY(3.5);

    let top_trim = new T.Mesh(platform_geom, platform_mat);
    platform_group.add(top_trim);
    top_trim.translateY(7.2);

    let opole_geom = new T.CylinderGeometry(0.01 * width, 0.01 * width, 6, 16);
    let opole_mat = new T.MeshStandardMaterial({
      color: "#aaaaaa",
      metalness: 0.8,
      roughness: 0.5
    });
 
    let num_poles = 10;
    let poles = [];
    let loader = new OBJLoader();
    for (let i = 0; i < num_poles; i++) {
      let opole;
      opole = new T.Mesh(opole_geom, opole_mat);
      platform_group.add(opole);
      opole.translateY(5);
      opole.rotateY((2 * i * Math.PI) / num_poles);
      opole.translateX(0.8 * width);
      opole.rotateZ(Math.PI / 4);
      
      let horse = loader.loadAsync("horse.obj");
      horse.then(function(horse) {
        horse.rotateX(-Math.PI/2)
        horse.scale.set(0.001, 0.001, 0.001);
        opole.add(horse);
      });
      poles.push(opole);
    }

    let roof_geom = new T.ConeGeometry(width, 0.5 * width, 32, 4);
    let roof = new T.Mesh(roof_geom, base_mat);
    carousel.add(roof);
    roof.translateY(9.8);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`Swingride-${SwingRideObCtr++}`, carousel);
    this.whole_ob = carousel;
    this.platform = platform_group;
    this.poles = poles;
    this.rotateAngle = 0;
    this.num_poles = num_poles;

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
    this.rotateAngle += 0.0005 * delta;
    this.platform.rotation.y = -(this.rotateAngle);
    
    for (let i = 0; i < 10; i++) {
      let horse = this.poles[i].children[0];
      if (typeof horse !== 'undefined') {
        horse.position.y = -4;
      }
    }
  }
}