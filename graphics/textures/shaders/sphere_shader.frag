#ifdef GL_ES
precision mediump float;
#endif

uniform samplerCube u_sphereTex;
uniform vec3 u_EyePosition;
varying vec3 v_pos;
varying vec3 v_Normal;
varying vec4 v_color;

void main() {
	vec3 normal = normalize(v_Normal);
	vec3 viewDir = normalize(u_EyePosition - v_pos);
	vec3 reflectVec = reflect(viewDir, normal);
	gl_FragColor = textureCube(u_sphereTex, reflectVec);
}
