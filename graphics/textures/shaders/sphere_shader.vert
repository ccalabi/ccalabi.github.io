uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;
varying vec3 v_pos;
varying vec3 v_Normal;

attribute vec4 a_Position;

void main() {
	v_pos = a_Position.xyz;
	v_Normal = v_pos;
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
}
