/**
 * 04-05-01.js - a simple JavaScript file that gets loaded with
 * page 5 of Workbook 4 (CS559).
 *
 * written by Michael Gleicher, January 2019
 * modified January 2020, February 2021
 *
 */

/**
 * If you want to read up on JavaScript classes, 
 * see the tutorial on the class website:
 * 
 * https://cs559.github.io/559Tutorials/javascript/oop-in-js-1/
 */
class Boid {
    /**
     * 
     * @param {number} x    - initial X position
     * @param {number} y    - initial Y position
     * @param {number} vx   - initial X velocity
     * @param {number} vy   - initial Y velocity
     */
    constructor(x, y, vx = 1, vy = 0) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.colorChange = false;
        this.colorChangeCount = 0;
    }
    angle() {
        let theta = Math.atan(this.vy/this.vx);
        if (this.vx < 0) {
          theta += Math.PI;
        }
        return theta;
    }
    /**
     * Draw the Boid
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle());

        // color change
        if (this.colorChange) {
            context.fillStyle = "purple";
            context.strokeStyle = "cyan";
        } 
        else {
            context.fillStyle = "orange";
            context.strokeStyle = "lightcyan";
        }
        
        // arrows
        context.save();
        context.beginPath();
        context.arc(0,0,15,0,Math.PI *2);
        context.fill();
        context.restore();
        context.lineWidth = 3;
        context.moveTo(-50,0);
        context.lineTo(15,0);
        context.moveTo(-20,7);
        context.lineTo(15,0);
        context.lineTo(-20,-7);
        context.stroke();
        context.restore();
    }
    /**
     * Perform the "steering" behavior -
     * This function should update the velocity based on the other
     * members of the flock.
     * It is passed the entire flock (an array of Boids) - that includes
     * "this"!
     * Note: dealing with the boundaries does not need to be handled here
     * (in fact it can't be, since there is no awareness of the canvas)
     * *
     * And remember, (vx,vy) should always be a unit vector!
     * @param {Array<Boid>} flock 
     */
    steer(flock) {
        let sumAngle = 0;
        let sumDistance = 0;
        for (let i = 0; i < flock.length; i++) {
        let otherBoid = flock[i];
        sumAngle += otherBoid.angle();
        sumDistance += 1/Math.sqrt((otherBoid.x - this.x)**2 + (otherBoid.y - this.y)**2);
        }
        this.vx = Math.cos(this.angle() + (sumAngle/sumDistance
        - this.angle())/100);
        this.vy = Math.sin(this.angle() + (sumAngle/sumDistance
         - this.angle())/100);
        /*
		// Note - this sample behavior is just to help you understand
		// what a steering function might  do
		// all this one does is have things go in circles, rather than
		// straight lines
		// Something this simple would not count for the advanced points:
		// a "real" steering behavior must consider other boids,
		// or at least obstacles.
		
        // a simple steering behavior: 
        // create a rotation matrix that turns by a small amount
        // 2 degrees per time step
        const angle = 2 * Math.PI / 180;
        const s = Math.sin(angle);
        const c = Math.cos(angle);

        let ovx = this.vx;
        let ovy = this.vy;

        this.vx =  ovx * c + ovy * s;
        this.vy = -ovx * s + ovy * c;
		*/
    }
}
function drawObstacle() {
    context.save();
    context.fillStyle = "gray";
    context.fillRect(canvas.width/3, canvas.height/3, canvas.width/3, canvas.height/3);
    context.restore();
  }

/** the actual main program
 * this used to be inside of a function definition that window.onload
 * was set to - however, now we use defer for loading
 */

 /** @type Array<Boid> */
let boids = [];

let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("flock"));
let context = canvas.getContext("2d");

let speedSlider = /** @type {HTMLInputElement} */ (document.getElementById("speed"));

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    boids.forEach(boid => boid.draw(context));
}

/**
 * Create some initial boids
 * STUDENT: may want to replace this
 */
boids.push(new Boid(100, 100));
boids.push(new Boid(200, 200, -1, 0));
boids.push(new Boid(400, 400, 0, 1));

/**
 * Handle the buttons
 */
document.getElementById("add").onclick = function () {
    for (let i = 0; i < 10; i++) {
        let randomX = Math.random()*canvas.width;
        while(canvas.width/3 < randomX && randomX < canvas.width*2/3) {
            randomX = Math.random()*canvas.width;
        }
        let randomY = Math.random()*canvas.height;
        while(canvas.height/3 < randomY && randomY < canvas.height*2/3) {
            randomY = Math.random()*canvas.height;
        }
        let randomTheta = Math.random() * Math.PI
        boids.push(new Boid(
          randomX,
          randomY,
          Math.cos(randomTheta),
          Math.sin(randomTheta),
        ));
      }
};
document.getElementById("clear").onclick = function () {
    boids = [];
};


let lastTime; // will be undefined by default
/**
 * The Actual Execution
 */
function loop(timestamp) {
    // time step - convert to 1/60th of a second frames
    // 1000ms / 60fps
    const delta = (lastTime ? timestamp-lastTime : 0) * 1000.0/60.0;

    // change directions
    boids.forEach(boid => boid.steer(boids));
    // move forward
    let speed = Number(speedSlider.value);
    boids.forEach(function (boid) {
        boid.x += boid.vx * speed;
        boid.y += boid.vy * speed;
        boid.colorChangeCount++;
        if(boid.colorChangeCount > 30){
            boid.colorChange = false;
            boid.colorChangeCount = 0;
        }
    });

    // make sure that we stay on the screen
    boids.forEach(function (boid) {
        if (boid.x < 0 || boid.x > canvas.width) {
            boid.vx *= -1;
            boid.colorChange = true;
        }
        if (boid.y < 0 || boid.y > canvas.height) {
            boid.vy *= -1;
            boid.colorChange = true;
        }
        if((canvas.width/3 < boid.x && boid.x < canvas.width*2/3) &&
          (canvas.height/3 < boid.y && boid.y < canvas.height*2/3)) {
            boid.colorChange = true;
            boid.vx *= -1;
            boid.vy *= -1;
        }
    });
    for (let i = 0; i < boids.length-1; i++) {
        for (let j = i+1; j < boids.length; j++) {
          let boid1 = boids[i];
          let boid2 = boids[j];
  
          if (boid1.colorChange || boid2.colorChange) {
            continue;
          }
          let distance = (boid1.x - boid2.x)**2 + (boid1.y - boid2.y)**2
          if (distance <= (2*15)**2) {
            boid1.colorChange = true;
            boid2.colorChange = true;
            boid1.vx *= -1;
            boid1.vy *= -1;
            boid2.vx *= -1;
            boid2.vy *= -1;
          }
        }
      }
    // now we can draw
    draw();
    drawObstacle();
    // and loop
    window.requestAnimationFrame(loop);

}
// start the loop with the first iteration
window.requestAnimationFrame(loop);


