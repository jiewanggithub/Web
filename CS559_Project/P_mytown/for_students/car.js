import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
export { car, driving_car };

function createWheels() {
  const geometry = new T.CylinderBufferGeometry(8, 8, 4, 32);
  const material = new T.MeshStandardMaterial({ color: 0x333333 });
  const wheel_L = new T.Mesh(geometry, material);
  wheel_L.rotateX(Math.PI / 2);
  wheel_L.translateY(-15);
  const wheel_R = new T.Mesh(geometry, material);
  wheel_R.rotateX(Math.PI / 2);
  wheel_R.translateY(15);

  let group = new T.Group();
  group.add(wheel_L);
  group.add(wheel_R);
  return group;
}
function getCarFrontTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "lightblue";
  context.fillRect(0, 0, 64, 32);

  context.fillStyle = "grey";
  context.fillRect(8, 8, 48, 24);

  return new T.CanvasTexture(canvas);
}
function getCarSideTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "lightblue";
  context.fillRect(0, 0, 128, 32);

  context.fillStyle = "grey";
  context.fillRect(10, 8, 38, 24);
  context.fillRect(58, 8, 60, 24);

  return new T.CanvasTexture(canvas);
}

let car_cnt = 0;
class car extends GrObject {
  constructor(params = {}) {
    const car = new T.Group();

    const backWheels = createWheels();
    backWheels.position.y = 6;
    backWheels.position.x = -18;
    car.add(backWheels);

    const frontWheels = createWheels();
    frontWheels.position.y = 6;
    frontWheels.position.x = 18;
    car.add(frontWheels);

    const length = 50,
      width = 12.5;

    const shape = new T.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, width);
    shape.lineTo(length, width);
    shape.lineTo(length, 0);
    shape.lineTo(0, 0);

    const extrudeSettings = {
      steps: 2,
      depth: 30,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 1,
    };

    const main = new T.Mesh(
      new T.ExtrudeGeometry(shape, extrudeSettings),
      new T.MeshStandardMaterial({ color: 0xa52523 })
    );
    main.position.x = -25;
    main.position.y = 7.5;
    main.position.z = -15;
    car.add(main);

    const carFrontTexture = getCarFrontTexture();
    const carBackTexture = getCarFrontTexture();
    const carRightSideTexture = getCarSideTexture();
    const carLeftSideTexture = getCarSideTexture();

    carLeftSideTexture.center = new T.Vector2(0.5, 0.5);
    carLeftSideTexture.rotation = Math.PI;
    carLeftSideTexture.flipY = false;

    const cabin = new T.Mesh(new T.BoxBufferGeometry(30, 12, 24), [
      new T.MeshStandardMaterial({ map: carFrontTexture }),
      new T.MeshStandardMaterial({ map: carBackTexture }),
      new T.MeshStandardMaterial({ color: "lightblue" }), // top
      new T.MeshStandardMaterial({ color: "lightblue" }), // bottom
      new T.MeshStandardMaterial({ map: carRightSideTexture }),
      new T.MeshStandardMaterial({ map: carLeftSideTexture }),
    ]);
    cabin.position.x = -5;
    cabin.position.y = 25.5;
    car.add(cabin);

    car.scale.set(0.1, 0.1, 0.1);

    super(`car-${car_cnt++}`, car);

    this.whole_obj = car;
    this.center_x = params.x ? Number(params.x) : 0;
    this.center_z = params.z ? Number(params.z) : 0;
    this.whole_obj.position.x = params.x ? Number(params.x) : 0;
    this.whole_obj.position.y = params.y ? Number(params.y) : 0;
    this.whole_obj.position.z = params.z ? Number(params.z) : 0;
    let scale = (params.size ? Number(params.size) : 1) * 0.1;
    car.scale.set(scale, scale, scale);
    this.count = 0;

    this.ridePoint = new T.Object3D();
    this.ridePoint.translateY(1);
    this.ridePoint.rotateY(Math.PI / 2);
    cabin.add(this.ridePoint);
    this.rideable = this.ridePoint;
  }

  stepWorld(delta, timeOfDay) {
    this.whole_obj.position.x = this.center_x;
    this.whole_obj.position.z = this.center_z;
    this.whole_obj.rotateY(delta / 800);
    this.whole_obj.translateX(8 * Math.sin(delta / 800));
    this.whole_obj.translateZ(8 * Math.cos(delta / 800));
  }
}

class driving_car extends car {
  constructor(params = {}) {
    super(params);
  }

  stepWorld(delta, timeOfDay) {
    this.count = (this.count + delta / 2000) % 6;
    console.log(this.count);
    if (this.count < 1) {
      this.whole_obj.position.set(
        linMap(this.center_x - 30, this.center_x, this.count),
        0,
        this.center_z
      );
    } else if (this.count < 2) {
    } else if (this.count < 3) {
      this.whole_obj.position.set(
        linMap(this.center_x, this.center_x + 50, this.count - 2),
        0,
        this.center_z
      );
    } else if (this.count < 6) {
      this.whole_obj.position.set(this.center_x, -1000, this.center_z);
    }
  }
}
function linMap(min, max, u) {
  return (max - min) * (u % 1) + min;
}
