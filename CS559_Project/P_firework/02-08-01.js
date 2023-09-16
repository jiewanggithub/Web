/**
 * Starter file for 02-08-01.js - the only exercise of page 8 of Workbook 2
 */

// @ts-check

// Find the canvas and start!
let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("box2canvas"));
// @ts-ignore
let context = canvas.getContext('2d');
const color = ["red","green","yellow","pink","black","purple","blue","cyan","teal","brown"];
// @ts-ignore
let circles = [];
let boxs = [];
// @ts-ignore
let mouseX = -10;
// @ts-ignore
let mouseY = -10;


// @ts-ignore
canvas.onclick = function(event){
    mouseX = event.clientX;
    mouseY = event.clientY;
    let box = /** @type {HTMLCanvasElement} */ (event.target).getBoundingClientRect();
    mouseX -= box.left;
    mouseY -= box.top;
    if ( (mouseX > 0) && (mouseY > 0) ) {
        let randomNumber = Math.round((Math.random() * 10));
        let randomXPostition = Math.random()*600;
        let vx = (mouseX - randomXPostition) / calculateDistance(randomXPostition,399,mouseX,mouseY);
        let vy = (mouseY - 399) / calculateDistance(randomXPostition,399,mouseX,mouseY); 
        circles.push({"x":randomXPostition,"y":399,"targetx":mouseX,"targety":mouseY, "vx":vx,"vy":vy,"r":4,"colorNumber":randomNumber
    ,"disapper":false});
    }
    
}
let randomMouseX;
let randomMouseY;
let randomCircles = [];
function randomAnimate(){
    let timeIntervel = Math.round(Math.random()*70);
    if(timeIntervel == 6){
    let randomNumber = Math.round((Math.random() * 10));
    randomMouseX = Math.random()*600;
    randomMouseY = Math.random()*400;
    
    let randomXPosition = Math.random()*600;
    let vx = (randomMouseX- randomXPosition) / calculateDistance(randomXPosition,399,randomMouseX,randomMouseY);
    let vy = (randomMouseY - 399) / calculateDistance(randomXPosition,399,randomMouseX,randomMouseY); 
    circles.push({"x":randomXPosition,"y":399,"targetx":randomMouseX,"targety":randomMouseY, "vx":vx,"vy":vy,"r":4,"colorNumber":randomNumber
,"disapper":false});
    
    }
    window.requestAnimationFrame(randomAnimate);
}
randomAnimate();

// calculate the distance between two points
function calculateDistance( x0, y0, x1, y1 ) {
	let xDistance = x1 - x0,
		yDistance = y1 - y0;
	return Math.sqrt( Math.pow( xDistance, 2 ) + Math.pow( yDistance, 2 ) );
}


function animate(){
    // @ts-ignore
    context.clearRect(0,0,canvas.width,canvas.height);
    
    // filter out the circles
    circles = circles.filter(
        circle => (circle.disapper == false)
        );
    // filter out the dots
    boxs = boxs.filter(
        box => ((box.y>0)&&(box.x>0)&&(box.x<canvas.width)&&(box.y<canvas.height))
        );
        
    //move all the circles to the destination the user clicked
    circles.forEach(function(circle){
        if(circle.x != circle.targetx && circle.y > circle.targety){
            if(circle.x > circle.targetx ){
                circle.x += circle.vx*8;
                circle.y += circle.vy*8;
            }
            else if(circle.x < circle.targetx){
                circle.x += circle.vx*8;
                circle.y += circle.vy*8; 
            }
        }
        else{
                circle.disapper = true;
                const angleIncrment = Math.PI * 2 / 400;
                for (let i = 0; i < 400; i++){
                let randomNumber = Math.round((Math.random() * 10));
                boxs.push({"x":mouseX,"y":mouseY,"colorNumber":randomNumber,
                "vx":(Math.cos(angleIncrment*i) * Math.random())
                ,"vy":(Math.sin(angleIncrment*i) * Math.random()),"alpha":1});
                
            }
                for (let i = 0; i < 400; i++){
                let randomNumber = Math.round((Math.random() * 10));
                boxs.push({"x":randomMouseX,"y":randomMouseY,"colorNumber":randomNumber,
                "vx":(Math.cos(angleIncrment*i) * Math.random())
                ,"vy":(Math.sin(angleIncrment*i) * Math.random()),"alpha":1});
                
            }
        }
    })
    circles.forEach(function(circle){
        context?.beginPath();
        context?.arc(circle.x,circle.y,circle.r,0,Math.PI*2,true);
        context?.fill();
    });


    boxs.forEach(function(dot){
        // dot.alpha -= 0.008;
        dot.alpha -= Math.random()/70;
        dot.vy -= 0.01;
        dot.xy *= 0.99;
        dot.y -= dot.vy;
        dot.x -= dot.vx;
        // @ts-ignore
        context.fillStyle = color[dot.colorNumber];
        // @ts-ignore
        if(dot.alpha > 0){
        // @ts-ignore
        context.fillRect(dot.x,dot.y,3,3);
    }
    });

    window.requestAnimationFrame(animate);
}
animate();

