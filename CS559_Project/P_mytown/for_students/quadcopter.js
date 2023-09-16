import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";


let quadcopterCount = 0;
let Pilot = function(){
    this.group = new T.Object3D();
    this.group.name = "pilot";
    this.hair_angle=0;

    // Body
    let body = new T.Mesh(
        new T.BoxGeometry(15,15,15),
        new T.MeshPhongMaterial({color:0x23190f}));
    body.position.set(2,-12,0);
    this.group.add(body);

    // Face
    let face = new T.Mesh(
        new T.BoxGeometry(10,12,12),
        new T.MeshLambertMaterial({color:0xF5986E}));
    this.group.add(face);

    // Hair element
    let hair = new T.Mesh(
        new T.BoxGeometry(4,4,4),
        new T.MeshLambertMaterial({color:0x59332e}));
    hair.geometry.applyMatrix4(new T.Matrix4().makeTranslation(0,3,0));
    let hairs = new T.Group();
    this.hairsTop = new T.Group();
    // hair at the top: spreading the hair at the top
    for (let i=0; i<12; i++){
        let hair_clone = hair.clone();
        let col = i%3;
        hair_clone.position.set(-4 + (Math.floor(i/3))*4, 0, -4 + col*4);
        this.hairsTop.add(hair_clone);
    }
    hairs.add(this.hairsTop);
    // create other hair
    let hair_side = new T.BoxGeometry(12,5,1);
    hair_side.applyMatrix4(new T.Matrix4().makeTranslation(-6,0,0));
    let hair_side_right = new T.Mesh(hair_side,
        new T.MeshLambertMaterial({color:0x59332e}));
    let hair_side_left = hair_side_right.clone();
    hair_side_right.position.set(8,-2,6);
    hair_side_left.position.set(8,-2,-6);
    hairs.add(hair_side_right);
    hairs.add(hair_side_left);
    let hair_back = new T.Mesh(
        new T.BoxGeometry(2,8,10),
        new T.MeshLambertMaterial({color:0x59332e}));
    hair_back.position.set(-1,-4,0)
    hairs.add(hair_back);
    hairs.position.set(-5,5,0);
    this.group.add(hairs);

    // Ear
    let ear_left = new T.Mesh(
        new T.BoxGeometry(2,3,2),
        new T.MeshLambertMaterial({color:0xF5986E}));
    ear_left.position.set(0,0,-6);
    let ear_right = ear_left.clone();
    ear_right.position.set(0,0,6);
    this.group.add(ear_left);
    this.group.add(ear_right);

    // mouse
    let mouse = new T.Mesh(
        new T.BoxGeometry(8,0.5,8),
        new T.MeshLambertMaterial({color:0xF5986E}));
    mouse.position.set(2,-2.1,0);
    this.group.add(mouse);

    // eye
    let eye_left = new T.Mesh(
        new T.BoxGeometry(3,1,3),
        new T.MeshBasicMaterial({color:"white"}));
    eye_left.position.set(4,4.5,3);
    let eye_right = new T.Mesh(
        new T.BoxGeometry(3,1,3),
        new T.MeshBasicMaterial({color:"white"}));
    eye_right.position.set(4,4.5,-3);
    this.group.add(eye_left);
    this.group.add(eye_right);

    // nose
    let nose = new T.Mesh(
        new T.BoxGeometry(2,1,1),
        new T.MeshBasicMaterial({color:0x59332e}));
    nose.position.set(4,2,0);
    this.group.add(nose);
    //scale accordingly
    this.group.scale.set(3,3,3);
    // this.group.rotateY(-theta-Math.PI/2);
}

export class Quadcopter extends GrObject{
    constructor(color){
        let group = new T.Group();
        super(`Quadcopter-${++quadcopterCount}`, group);
        let cockpit = new T.Mesh(
            new T.BoxGeometry(60,50,50,1,1,1),
            new T.MeshPhongMaterial({color:color}));
        group.add(cockpit);
        
        // head
        let head = new T.Mesh(
            new T.BoxGeometry(20,50,50,1,1,1),
            new T.MeshPhongMaterial({color:"silver"}));
        head.position.x = 40;
        group.add(head);
        
        // tail
        let tail = new T.Mesh(
            new T.BoxGeometry(18,40,5,1,1,1),
            new T.MeshPhongMaterial({color:"silver"})
        );
        tail.position.set(-35,25,0);
        group.add(tail);
        
        // wings
        let wing = new T.Mesh(
            new T.BoxGeometry(40,8,150,1,1,1),
            new T.MeshPhongMaterial({color:"silver"}));
        group.add(wing);
        this.propeller_left_node = new T.Mesh(
            new T.BoxGeometry(20,5,5,1,1,1),
            new T.MeshPhongMaterial({color: 0x59332e})
            );
            let propeller_left = new T.Mesh(
                new T.BoxGeometry(1,30,10,1,1,1),
                new T.MeshPhongMaterial({color: 0x59332e})
            );
            propeller_left.position.set(6,0,0);
            this.propeller_left_node.add(propeller_left);
            this.propeller_left_node.position.set(30,0,-50);
            group.add(this.propeller_left_node); 

            this.propeller_right_node = new T.Mesh(
                new T.BoxGeometry(20,5,5,1,1,1),
                new T.MeshPhongMaterial({color: 0x59332e})
                );
                var propeller_right = new T.Mesh(
                new T.BoxGeometry(1,30,10,1,1,1),
                new T.MeshPhongMaterial({color: 0x59332e})
                );
                propeller_right.position.set(6,0,0);
                this.propeller_right_node.add(propeller_right);
                this.propeller_right_node.position.set(30,0,50);
                group.add(this.propeller_right_node);
                this.pilot = new Pilot();
                this.pilot.group.position.set(0,35,0)
                group.add(this.pilot.group);
                this.group = group;
                this.go = 0;
                this.count = 0;
                this.z = this.group.position.z;

                this.rideable = this.group;
            };
            stepWorld(delta){
                this.pilot.updateHairs();
                this.propeller_left_node.rotateX(delta);
                this.propeller_right_node.rotateX(delta);
                if(this.go == 0){
                    this.count += delta/100;
                    this.group.position.x = this.count;
                    this.group.position.y = this.count/2 + 12;
                    if(this.count >= 45 ){
                        this.group.rotateY(3*Math.PI/2);
                        this.go = 1;
                    }
                }
                else if(this.go == 1){
                    this.z += delta/100;
                    this.group.position.z = this.z; 
                    if(this.z >= 25){
                        this.go = 2;
                        this.group.rotateY(Math.PI);
                    }
                }
                else if (this.go == 2){
                    this.z -= delta/100;
                    this.group.position.z = this.z;
                    if(this.z <= 0){
                        this.go = 3;
                        this.group.rotateY(Math.PI/2);
                    }
                }
                else{
                    this.count -= delta/100;
                    this.group.position.x = this.count;
                    this.group.position.y = this.count/2 + 12;
                    if(this.count <= -20){
                        this.go = 0;
                        this.group.rotateY(Math.PI);
                    }
                }
                

                
            }

    }

    Pilot.prototype.updateHairs = function(){
        let hairs = this.hairsTop.children;
        for (let i=0; i<hairs.length; i++){
            let hair = hairs[i];
            hair.scale.y = .8 + Math.cos(this.hair_angle+i/3)*.25;
        }
        this.hair_angle += 0.2;
    }

    // let particle = function(){
    //     return new T.Mesh(
    //         new T.BoxGeometry(4,4,4),
    //         new T.MeshStandardMaterial({color:"white"})
    //     )
    // }
