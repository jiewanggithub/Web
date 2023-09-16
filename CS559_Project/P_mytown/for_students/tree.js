import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { CylinderGeometry } from "../libs/CS559-Three/build/three.module.js";
export { Tree };

let treeCount = 0;
class Tree extends GrObject {
    constructor() {
      let brown = new T.MeshStandardMaterial({
        color: "#643212",
      });
      let green = new T.MeshStandardMaterial({
        color: "green",
      });
      let treeStem = new CylinderGeometry(0.1, 0.2, 1);
      treeStem.translate(0, 0.4, 0);
      let top1 = new CylinderGeometry(0.2, 0.45, 0.35);
      top1.translate(0, 0.4, 0);
      let top2 = new CylinderGeometry(0.1, 0.32, 0.35);
      top2.translate(0, 0.7, 0);
      let top3 = new CylinderGeometry(0, 0.21, 0.35);
      top3.translate(0, 1.0, 0);
      let tree = new T.Group();
      tree.add(new T.Mesh(treeStem, brown));
      tree.add(new T.Mesh(top1, green));
      tree.add(new T.Mesh(top2, green));
      tree.add(new T.Mesh(top3, green));
      super(`Tree-${++treeCount}`, tree);
    }
  }