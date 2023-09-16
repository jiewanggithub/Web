/*jshint esversion: 6 */
// you might want to turn this on: // @ts-check

// these two things are the main UI code for the train
// students learned about them in last week's workbook

import { draggablePoints } from "../libs/CS559/dragPoints.js";
import { RunCanvas } from "../libs/CS559/runCanvas.js";

// this is a utility that adds a checkbox to the page 
// useful for turning features on and off
import { makeCheckbox } from "../libs/CS559/inputHelpers.js";

/**
 * Have the array of control points for the track be a
 * "global" (to the module) variable
 *
 * Note: the control points are stored as Arrays of 2 numbers, rather than
 * as "objects" with an x,y. Because we require a Cardinal Spline (interpolating)
 * the track is defined by a list of points.
 *
 * things are set up with an initial track
 */

function trainDraw(x,y,theta,color){
  context.save();
  context.translate(x,y);
  context.rotate(theta);
  context.lineWidth = 2;
  context.beginPath();
  context.save();
  context.moveTo(0,20);
  context.bezierCurveTo(45, 20, 45, -20, 0, -20);
  context.lineTo(-50,-20);
  context.lineTo(-50,+20);
  context.closePath();
  context.fillStyle = color;
  context.fill();
  context.restore();
  context.save();
  context.moveTo(45,-20);
  context.lineTo(25,-25);
  context.moveTo(55,-10);
  context.lineTo(25,-10);
  context.moveTo(65,0);
  context.lineTo(25,0);
  context.moveTo(55,10);
  context.lineTo(25,10);
  context.moveTo(45,20);
  context.lineTo(25,25);
  context.stroke();
  context.restore();
  context.save();
  for (let i = 0; i < 5; i++){
    context.moveTo(-40,-20+i*10);
    context.lineTo(-55,-20+i*10);
  }
  context.save();
  context.fillRect(-40,-25,50,5);
  context.fillRect(-40,20,50,5);
  context.restore();
  context.restore();
  context.save();
  context.fillStyle = "silver";
  context.fillRect(-30,-10,30,20);
  context.stroke();
  context.restore();
  context.restore();
}

function railTrackDraw(x, y, theta) {
  context.save();
  context.translate(x,y);
  context.rotate(theta);
  context.fillStyle = '#8B0000';
  context.beginPath();
  context.moveTo(2,15);
  context.lineTo(-2, 15);
  context.lineTo(-2, -15);
  context.lineTo(2, -15);
  context.closePath();
  context.fill();
  context.restore();
}

/** @type Array<number[]> */
let thePoints = [
  [150, 150],
  [150, 450],
  [450, 450],
  [450, 150]
];

let thePointsD = [[]];

function calcPointsDrv(t){
  thePointsD = new Array(thePoints.length);
  for(let i = 0; i < thePoints.length; i++){
    thePointsD[i] = new Array(2);
    let left = (i+thePointsD.length-1)%thePointsD.length
    let right = (i+1)%thePointsD.length;
    let x_d = (thePoints[right][0] - thePoints[left][0])*t;
    let y_d = (thePoints[right][1] - thePoints[left][1])*t;
    thePointsD[i][0] = x_d;
    thePointsD[i][1] = y_d;
  }
}

function calcAngle(x_d,y_d){
  let theta = Math.atan(y_d/x_d);
  if (x_d < 0){
    theta += Math.PI;
  }
  return theta;
}

function calcDistance(point0, point1){
  return Math.sqrt((point1['x']-point0['x'])**2 
  + (point1['y']-point0['y'])**2);
}

function Hermite_to_Bezier(p1, p1_drv, p2, p2_drv) {
  let b1 = p1;
  let b2 = [p1[0] + p1_drv[0]/3, p1[1] + p1_drv[1]/3]
  let b3 = [p2[0] - p2_drv[0]/3, p2[1] - p2_drv[1]/3]
  let b4 = p2;
  return [b1, b2, b3, b4]
}

let sampleStep = 10;
let samplePoints = [];
function paramatri_cardinal() {
  samplePoints = new Array();
  for (let i = 0; i < sampleStep*thePoints.length; i++) {
    let point = eval_position(i/sampleStep, false);
    point.x_d /= sampleStep;
    point.y_d /= sampleStep;
    samplePoints.push(point);
  }
}

function drawFancyTrack(){
    context.save();
    let l = thePoints.length;
    const d = 10;
    paramatri_cardinal();
    let thePoints_outer = new Array();
    let thePoints_inner = new Array();
    let thePoints_d = new Array();
    for (let i = 0; i < l*sampleStep; i++){
      let point = eval_position(i/sampleStep,true);
      let x = point['x'], y = point['y'], theta=point['theta'];
      railTrackDraw(x, y, theta);
    }

    for (let i = 0; i < l*sampleStep; i++){
      let point = eval_position(i/sampleStep,false);
      let x = point['x'], y = point['y'], theta = point['theta'];
      let angle_outter = theta + Math.PI/2;
      let angle_inner = theta - Math.PI/2;
      let dx_outer = d*Math.cos(angle_outter);
      let dy_outer = d*Math.sin(angle_outter);
      let dx_inner = d*Math.cos(angle_inner);
      let dy_inner = d*Math.sin(angle_inner);
      thePoints_outer.push([x+dx_outer, y+dy_outer]);
      thePoints_inner.push([x+dx_inner, y+dy_inner]);
      thePoints_d.push([point['x_d']/sampleStep, point['y_d']/sampleStep]);
    }
      drawSimpleTrack(thePoints_outer,thePoints_d);
      drawSimpleTrack(thePoints_inner,thePoints_d);  
      context.restore();
}


function drawSimpleTrack(points,pointsD) {
  context.save();
  context.beginPath();
  context.strokeStyle = "black";
  let l = points.length;
  for (let i = 0; i < l; i++){
    let [b1, b2, b3, b4] = Hermite_to_Bezier(
      points[i], 
      pointsD[i],
      points[(i+1)%l],
      pointsD[(i+1)%l]
    );
    context.moveTo(b1[0], b1[1]);
    context.bezierCurveTo(
      b2[0], b2[1],
      b3[0], b3[1],
      b4[0], b4[1]
    )
  }
  context.stroke();
  context.restore();
}

function eval_position(param,arcLength = false){
    if(arcLength){
      paramatri_cardinal();

    let length = samplePoints.length;
    let distances = new Array();
    for(let i = 0; i < samplePoints.length; i++) {
      distances.push(calcDistance(
        samplePoints[i],
        samplePoints[(i+1)%length]
      ));
    }
    // console.log(distances);
    let sumDistance = distances.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0
    );

    let targetDistance = param/thePoints.length*sumDistance;
    for(let i = 0; i < samplePoints.length; i++) {
      if (targetDistance < distances[i]) {
        let u = targetDistance/distances[i];

        let p0 = [samplePoints[i]['x'], samplePoints[i]['y']];
        let p0_d = [samplePoints[i]['x_d'], samplePoints[i]['y_d']];
        let p1 = [samplePoints[(i+1)%length]['x'], samplePoints[(i+1)%length]['y']];
        let p1_d = [samplePoints[(i+1)%length]['x_d'], samplePoints[(i+1)%length]['y_d']];

        let x = (1 - 3*u**2 + 2*u**3)*p0[0] + (u - 2*u**2 + u**3)*p0_d[0]
         + (3*u**2 - 2*u**3)*p1[0] + (-1*u**2 + u**3)*p1_d[0];
        let y = (1 - 3*u**2 + 2*u**3)*p0[1] + (u - 2*u**2 + u**3)*p0_d[1]
         + (3*u**2 - 2*u**3)*p1[1] + (-1*u**2 + u**3)*p1_d[1];
        let x_d = (-6*u + 6*u**2)*p0[0] + (1 - 4*u + 3*u**2)*p0_d[0]
         + (6*u - 6*u**2)*p1[0] + (-2*u + 3*u**2)*p1_d[0];
        let y_d = (-6*u + 6*u**2)*p0[1] + (1 - 4*u + 3*u**2)*p0_d[1]
         + (6*u - 6*u**2)*p1[1] + (-2*u + 3*u**2)*p1_d[1];
        return {
        x: x,
        y: y,
        x_d: x_d,
        y_d: y_d,
        theta: calcAngle(x_d, y_d)
        };
      } else {
        targetDistance -= distances[i]
      }
    }
    }
    else{
      let i = Math.floor(param);
      let u = param - i;
      let p0 = thePoints[i];
      let p0_d = thePointsD[i];
      let p1 = thePoints[(i+1)%thePoints.length];
      let p1_d = thePointsD[(i+1)%thePoints.length];
  
      let x = (1 - 3*u**2 + 2*u**3)*p0[0] + (u - 2*u**2 + u**3)*p0_d[0] 
       + (3*u**2 - 2*u**3)*p1[0] + (-1*u**2 + u**3)*p1_d[0];
      let y = (1 - 3*u**2 + 2*u**3)*p0[1] + (u - 2*u**2 + u**3)*p0_d[1]
       + (3*u**2 - 2*u**3)*p1[1] + (-1*u**2 + u**3)*p1_d[1];
      let x_d = (-6*u + 6*u**2)*p0[0] + (1 - 4*u + 3*u**2)*p0_d[0]
       + (6*u - 6*u**2)*p1[0] + (-2*u + 3*u**2)*p1_d[0];
      let y_d = (-6*u + 6*u**2)*p0[1] + (1 - 4*u + 3*u**2)*p0_d[1]
       + (6*u - 6*u**2)*p1[1] + (-2*u + 3*u**2)*p1_d[1];
      //  console.log(calcAngle(x_d, y_d));
      return {
        x: x,
        y: y,
        x_d: x_d,
        y_d: y_d,
        theta: calcAngle(x_d, y_d) 
      };
    }   
}

let speed = 1;

/**
 * Draw function - this is the meat of the operation
 *
 * It's the main thing that needs to be changed
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number} param
 */
function draw(canvas, param) {

  let context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  thePoints.forEach(function(pt) {
    context.beginPath();
    context.arc(pt[0], pt[1], 5, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  });


  calcPointsDrv(ts);
  if(document.getElementById("check-simple-track").checked){
    drawSimpleTrack(thePoints,thePointsD);
  }
  else{
    drawFancyTrack();
  }
  param = (param * speed) % (thePoints.length);
  if (document.getElementById("check-arc-length").checked){
    let point = eval_position(param,true);
    let point3 = eval_position((param + 0.45)%thePoints.length,true);
    let point2 = eval_position((param + 0.82)%thePoints.length,true);
    trainDraw(point['x'],point['y'],point['theta'],"skyblue");
    trainDraw(point3['x'],point3['y'],point3['theta'], "cyan");
    trainDraw(point2['x'],point2['y'],point2['theta'],"orange");
    
  }
  else{
    let point = eval_position(param,false);
    let point2 = eval_position((param + 0.45)%thePoints.length,false);
    let point3 = eval_position((param + 0.82)%thePoints.length,false);
    trainDraw(point['x'],point['y'],point['theta'],"skyblue");
    trainDraw(point2['x'],point2['y'],point2['theta'],"cyan");
    trainDraw(point3['x'],point3['y'],point3['theta'],"orange");
    
  }

  
  // now, the student should add code to draw the track and train
}

/**
 * Initialization code - sets up the UI and start the train
 */
let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
let context = canvas.getContext("2d");

// we need the slider for the draw function, but we need the draw function
// to create the slider - so create a variable and we'll change it later
let slider; // = undefined;

// note: we wrap the draw call so we can pass the right arguments
function wrapDraw() {
    // do modular arithmetic since the end of the track should be the beginning
    draw(canvas, Number(slider.value) % thePoints.length);
}
// create a UI
let runcanvas = new RunCanvas(canvas, wrapDraw);
// now we can connect the draw function correctly
slider = runcanvas.range;

// note: if you add these features, uncomment the lines for the checkboxes
// in your code, you can test if the checkbox is checked by something like:
// document.getElementById("check-simple-track").checked
// in your drawing code
// WARNING: makeCheckbox adds a "check-" to the id of the checkboxes
//
// lines to uncomment to make checkboxes
let simpleTrack = makeCheckbox("simple-track");
simpleTrack.oninput = wrapDraw;
let arcLength = makeCheckbox("arc-length");
arcLength.oninput = wrapDraw;
arcLength.checked = true;
//makeCheckbox("bspline");

let sampleStepChange = document.getElementById("sample-steps");
sampleStepChange.oninput = function() {
  sampleStep = sampleStepChange.value;
  wrapDraw();
}
let speedChange = document.getElementById("speed");
speedChange.oninput = function() {
  speed = speedChange.value;
  wrapDraw();
}
let ts = 0.5;
let tension = document.getElementById("tension");
tension.oninput = function(){
  ts = tension.value;
  wrapDraw();
}
// helper function - set the slider to have max = # of control points
function setNumPoints() {
    runcanvas.setupSlider(0, thePoints.length, 0.05);
}

setNumPoints();
runcanvas.setValue(0);

// add the point dragging UI
draggablePoints(canvas, thePoints, wrapDraw, 10, setNumPoints);
