
uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;

attribute vec4 a_Position;
attribute vec4 a_Color;

varying vec3 v_pos;
varying vec4 v_color;

void main() {
    v_pos = a_Position.xyz;
    v_color = vec4(0.25, 0, 0.3, 1);
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
}
