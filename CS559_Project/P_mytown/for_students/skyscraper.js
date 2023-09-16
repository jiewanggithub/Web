import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
export {Skyscraper};
let wall_texture = new T.TextureLoader().load("../for_students/images/skyscraper.png");

let skyscraperCount = 0;
class Skyscraper extends GrObject {
    constructor(x,y,z) {

      let wall_material = new T.MeshStandardMaterial({
        map: wall_texture, // map texture
      });
      let white_material = new T.MeshStandardMaterial({
        color: "white",
      });

      let group = new T.Group();
      let box1 = new T.BoxGeometry(x, y, z);
      let box2 = new T.BoxGeometry(x, y, z);
      box1.translate(0, x/2, 0);
      box2.translate(0, 3*x/2, 0);
    
      group.add(
        new T.Mesh(box1, [
          wall_material,
          wall_material,
          white_material,
          white_material,
          wall_material,
          wall_material,
        ])
      );

      group.add(
        new T.Mesh(box2, [
          wall_material,
          wall_material,
          white_material,
          white_material,
          wall_material,
          wall_material,
        ])
      );
      super(`Skyscraper-${++skyscraperCount}`, group);
    }
  }