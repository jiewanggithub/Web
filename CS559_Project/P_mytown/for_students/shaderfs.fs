precision highp float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

#define FOG_STRENGTH 1.67

const float PI = 3.14159265;
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;

#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))





float sphereSize = 0.75 * (sin(7.)*0.5+0.5) + 0.25;
const vec3 lightDir = vec3(-0.577, 0.577, 0.577);

vec3 trans(vec3 p){
	return mod(p, 6.0) - 3.0;
}

float distanceFunc(vec3 p){
	return length(trans(p)) - sphereSize;
}

vec3 getNormal(vec3 p){
	float d = 0.01;
	return normalize(vec3(
		distanceFunc(p + vec3(  d, 0.0, 0.0)) - distanceFunc(p + vec3( -d, 0.0, 0.0)),
		distanceFunc(p + vec3(0.0,   d, 0.0)) - distanceFunc(p + vec3(0.0,  -d, 0.0)),
		distanceFunc(p + vec3(0.0, 0.0,   d)) - distanceFunc(p + vec3(0.0, 0.0,  -d))
	));
}

void main(void){
    vec2 m =  mouse;
	m *= rot(-time);
	vec3  cPos = vec3(1.0 * 400.*sin(0.1*time), 1. * 60.*cos(0.1*time), 2.0 - 3.*time*2.);   // movement
	
	// fragment position
	vec2 p = 1.5*(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
        p *= rot(-time);
	// ray
	vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)));	
	
	// marching loop
	float distance = 0.0;
	float rLen = 0.0;
	
	vec3  rPos = cPos;
	
	for(int i = 0; i < 200; i++){
		distance = distanceFunc(rPos);
		rLen += distance+1.*sin(sin(2.*time+rPos.y));
		rPos = cPos + ray * rLen;
	}
	// the fog
	float fog = 1.0 - pow(20./rLen, FOG_STRENGTH);
	vec3 c = vec3(0.0);
	// hitting
	
		vec3 normal = getNormal(rPos);
		float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
		c = vec3(0.25*diff+0.75*(normal*0.5+0.5));  // normal values for coloring
	        c += floor(p.y - fract(dot(gl_FragCoord.xy, vec2(0.5, 0.75))) * 10.0) * 0.05;  // dithering effect
	
	gl_FragColor = vec4(c, 1.0 - fog);
}