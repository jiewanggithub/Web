uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;
varying vec2 v_uv;

void main() {
    v_uv = uv;
    // the main output of the shader (the vertex position)
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}