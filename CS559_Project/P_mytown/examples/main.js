/*jshint esversion: 6 */
// @ts-check

//
// CS559 - Graphics Town - Workbook 12
// Example Code:
// Example "Town"
//
// This sets up the town loading different objects.
//
// It should be called from the onload function, after the world has been created

import { SimpleHouse } from "./house.js";
import { Helicopter, Helipad } from "./helicopter.js";
import { Tree } from "../for_students/tree.js";
import { Skyscraper } from "../for_students/skyscraper.js";
import { Wolf } from "../for_students/wolf.js";
import { Quadcopter } from "../for_students/quadcopter.js";
import { GrSwingRide } from "../for_students/swingride.js";
import { GrColoredRoundabout } from "../for_students/roundabout.js";
import { GrJumpRide } from "../for_students/jumpride.js";
import { GrSimpleSwing } from "../for_students/swing.js";
import { CircularTrack, EmptyTrack, LinearTrack, TrackCar, TrackCube, stopsign } from "../for_students/track.js";
import { car, driving_car } from "../for_students/car.js";
import { Shader } from "../for_students/shader.js";
/***********************************************
 ************************ */
/** EXAMPLES - student should not use this! It is just for reference    */
/** you may use the sample objects, but not the sample layout           */
/***/
export function main(world) {
  // make two rows of houses, mainly to give something to look at
  for (let i = 20; i < 50; i += 5) {
    world.add(new SimpleHouse({ x: i, z: 16 }));
    world.add(new SimpleHouse({ x: i, z: 28 }));
    world.add(new SimpleHouse({ x: i, z: 40 }));
  }

  // /** Race Track - with three things racing around */
  let track = new CircularTrack();
  track.setPos(-20,0.3,30);
  world.add(track);
  let tc3 = new TrackCar(track);
  tc3.setPos(-20,0,0);
  tc3.u = 0.125;
  // world.add(tc3);

  /** Helicopter - first make places for it to land*/

  world.add(new Helipad(-40, 20, -40));
  world.add(new Helipad(40, 20, -40));
  world.add(new Helipad(40, 20, 0));

  // tracks
  let lineartrack1 = new LinearTrack(46, 15);
  lineartrack1.setPos(-27, 0, -24);
  world.add(lineartrack1);

  let LinearTrack2 = new LinearTrack(40, 15);
  LinearTrack2.setPos(30, 0, -24);
  world.add(LinearTrack2);
  let LinearTrack3 = new LinearTrack(19.5, 15, 1);
  LinearTrack3.setPos(3, 0, -40);

  let emptytrack = new EmptyTrack(14, 14);
  emptytrack.setPos(3, 0, -24);
  world.add(emptytrack);
  world.add(LinearTrack3);

  // stopsign
  let stop = new stopsign();
  stop.setPos(10, 0, -32);
  world.add(stop);
  //-------------------------

  let copter = new Helicopter();
  world.add(copter);
  copter.setScale(3, 3, 3);
  copter.getPads(world.objects);

  // buldings
  let b1 = new Skyscraper(10, 10, 10);
  b1.setPos(-40, 0, -40);
  let b2 = new Skyscraper(10, 10, 10);
  b2.setPos(-25, 0, -40);
  let b3 = new Skyscraper(10, 10, 10);
  b3.setPos(40, 0, -40);
  let b4 = new Skyscraper(10, 10, 10);
  b4.setPos(40, 0, 0);
  world.add(b1);
  world.add(b2);
  world.add(b3);
  world.add(b4);
  //--------------------\

  let wolf = new Wolf();
  wolf.setPos(5, 0, 10);
  world.add(wolf);``
  let quadcopter = new Quadcopter("skyblue");
  quadcopter.setScale(0.05, 0.05, 0.05);

  world.add(quadcopter);
  // quadcopter.setPos(-25, 0, -40);
  // world.add(new ShinySculpture(world));
  // world.add(new MorphTest({ x: 10, y: 3, r: 2 }));

  let t1 = new Tree();
  t1.setScale(13, 13, 13);
  t1.setPos(5, 0, 5);
  world.add(t1);
  let t2 = new Tree();
  t2.setScale(10, 8, 8);
  t2.setPos(2, 0, 13);
  world.add(t2);
  let t3 = new Tree();
  t3.setScale(10, 8, 8);
  t3.setPos(10, 0, 10);
  world.add(t3);
  let t4 = new Tree();
  t4.setScale(10, 18, 8);
  t4.setPos(12, 0, 35);
  world.add(t4);
  let t5 = new Tree();
  t5.setScale(10, 12, 8);
  t5.setPos(-22, 0, 30);
  world.add(t5);

  let s = new Shader();
  world.add(s);
  let swing = new GrSimpleSwing();
  swing.setPos(-3, 0, -3);
  world.add(swing);
  let swingRide = new GrSwingRide({ x: 9, z: -7 });
  world.add(swingRide);

  let colorRo = new GrColoredRoundabout({ x: -12, z: 10 });
  colorRo.setScale(2, 2, 2);
  colorRo.setPos(-9, 0, -5);
  world.add(colorRo);

  let jumpride = new GrJumpRide({ x: -6, z: 6 });
  world.add(jumpride);

  let still_car = new car({
    x: -10,
    z: -33,
    size: 1,
  });
  still_car.stepWorld = function () {};
  world.add(still_car);
  let drivingCar = new driving_car({
    x: -7.5,
    z: -20,
    size: 1,
  });
  world.add(drivingCar);
  let drivingCar2 = new driving_car({
    x: -7.5,
    z: -27,
    size: 1,
  });
  drivingCar2.count = 0.5;
  world.add(drivingCar2);
}





