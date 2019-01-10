// Written by Cori Calabi, ccalabi
// Some elements from Matsuda Lea book examples

// Vertex shader program
var VSHADER_SOURCE =
	'precision mediump float;\n' +
	'uniform float rotated;\n' +
	'attribute vec4 a_Position;\n' +
	'uniform mat4 u_ModelMatrix;\n' +
	'uniform mat4 u_NormalMatrix;\n' +   // Coordinate transformation matrix of the normal
	'attribute vec4 a_Color;\n' +
	'attribute vec4 a_Normal;\n' +
	'uniform mat4 u_ViewMatrix;\n' +
	'uniform mat4 u_ProjMatrix;\n' +
	'uniform vec3 u_LightColor;\n' + // Light color
	'uniform vec3 u_LightPosition;\n' + // Position of the light source
	'uniform vec3 u_AmbientLight;\n' +  // Ambient light color
	'uniform vec3 u_SpecularLight;\n' +  // Specular light color
    'uniform float u_SpecExp;\n' +  // Specular exponent
	'varying vec4 v_Color;\n' +
    'varying vec3 v_Normal;\n' +  // for per fragment 
	'varying vec3 v_Position;\n' +  // for per fragment
	'void main() {\n' +
	'  gl_Position =  u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
	'  v_Position = vec3(u_ModelMatrix * a_Position);\n' +
	'  v_Normal = normalize(vec3(a_Normal));\n' +
	'  if (rotated == 1.0) {\n' + 
	'    v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
	'  }\n' +
	'  v_Color = a_Color;\n' +
	'}\n';

// Fragment shader program
var FSHADER_SOURCE =
	'#ifdef GL_ES\n' +
	'precision mediump float;\n' +
	'#endif\n' +
	'uniform vec3 u_LightColor;\n' +     // Light color
    'uniform vec3 u_LightPosition;\n' +  // Position of the light source
    'uniform vec3 u_AmbientLight;\n' +   // Ambient light color
    'uniform vec3 u_SpecularLight;\n' +  // Specular light color
    'uniform float u_SpecExp;\n' +  // Specular exponent
    'uniform vec3 u_ViewPos;\n' +
    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' +
    'varying vec4 v_Color;\n' +
	'void main() {\n' +
	   // Normalize the normal because it is interpolated and not 1.0 in length any more
    '  vec3 normal = normalize(v_Normal);\n' +
       // Calculate the light direction and make its length 1
    '  vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
    '  vec3 viewDir = normalize(u_ViewPos - v_Position);\n' +
       // The dot product of the light direction and the orientation of a surface (the normal)
    '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
    '  vec3 reflectVec = reflect(-lightDirection, normal);\n' +
    '  float rDotV = max(dot(reflectVec, viewDir), 0.0);\n' +
       // Calculate the final color from diffuse reflection and ambient reflection
    '  vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n' +
    '  vec3 ambient = u_AmbientLight * v_Color.rgb;\n' + 
    '  float spec = pow(rDotV, u_SpecExp);\n' +
    '  vec3 specular = u_SpecularLight * spec;\n' +
    '  gl_FragColor = vec4(diffuse + ambient + specular, v_Color.a);\n' +
	'}\n';


function main() {
	// Retrieve HTML elements
	var canvas = document.getElementById('webgl');
	var outerDiv = document.getElementById('outer');
	var scaleSlider = document.getElementById('scaleSlider');
	var scaleInfo = document.getElementById('curScale');
	var zoomSlider = document.getElementById('zoomSlider');
	var zoomInfo = document.getElementById('currentZoom');
	var aspectSlider = document.getElementById('aspectSlider');
	var aspectInfo = document.getElementById('currentAspect');
	var rotateZclockBtn = document.getElementById('rotateZclock');
	var rotateZcounterBtn = document.getElementById('rotateZcounter');
	var turnCamSlider = document.getElementById('turnCamSlider');
	var turnCamInfo = document.getElementById('turnCamInfo');

	var g_points = []; // The array for the position of a mouse press
	var cyl_points1 = []; // Array for first circle of cylinder points
	var cyl_points2 = []; // Array for second circle of cylinder points
	var color = []; // Array for cylinder colors
	var pt_color = []; // Array for points and lines colors

	// Coordinates
	var vertices = new Float32Array([
		2.0, 2.0, 2.0,  -2.0, 2.0, 2.0,  -2.0,-2.0, 2.0,   2.0,-2.0, 2.0, // v0-v1-v2-v3 front
		2.0, 2.0, 2.0,   2.0,-2.0, 2.0,   2.0,-2.0,-2.0,   2.0, 2.0,-2.0, // v0-v3-v4-v5 right
		2.0, 2.0, 2.0,   2.0, 2.0,-2.0,  -2.0, 2.0,-2.0,  -2.0, 2.0, 2.0, // v0-v5-v6-v1 up
		-2.0, 2.0, 2.0,  -2.0, 2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0,-2.0, 2.0, // v1-v6-v7-v2 left
		-2.0,-2.0,-2.0,   2.0,-2.0,-2.0,   2.0,-2.0, 2.0,  -2.0,-2.0, 2.0, // v7-v4-v3-v2 down
		2.0,-2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0, 2.0,-2.0,   2.0, 2.0,-2.0  // v4-v7-v6-v5 back
	]);

	// Colors
	var colors = new Float32Array([
		1, 0.1, 0.1,   1, 0.1, 0.1,   1, 0.1, 0.1,  1, 0.1, 0.1,     // v0-v1-v2-v3 front
		1, 0.1, 0.1,   1, 0.1, 0.1,   1, 0.1, 0.1,  1, 0.1, 0.1,     // v0-v3-v4-v5 right
		1, 0.1, 0.1,   1, 0.1, 0.1,   1, 0.1, 0.1,  1, 0.1, 0.1,     // v0-v5-v6-v1 up
		1, 0.1, 0.1,   1, 0.1, 0.1,   1, 0.1, 0.1,  1, 0.1, 0.1,     // v1-v6-v7-v2 left
		1, 0.1, 0.1,   1, 0.1, 0.1,   1, 0.1, 0.1,  1, 0.1, 0.1,     // v7-v4-v3-v2 down
		1, 0.1, 0.1,   1, 0.1, 0.1,   1, 0.1, 0.1,  1, 0.1, 0.1　    // v4-v7-v6-v5 back
	]);

	// Normal
	var normals = new Float32Array([
		0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
		1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
		0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
		-1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
		0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
		0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
	]);

	// Indices of the vertices
	var indices = new Uint8Array([
		0, 1, 2,   0, 2, 3,    // front
		4, 5, 6,   4, 6, 7,    // right
		8, 9,10,   8,10,11,    // up
		12,13,14,  12,14,15,    // left
		16,17,18,  16,18,19,    // down
		20,21,22,  20,22,23     // back
	]);

	// Get the rendering context for WebGL
	var gl = getWebGLContext(canvas);
	if (!gl) {
		console.log('Failed to get the rendering context for WebGL');
		return;
	}
	// Initialize shaders
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('Failed to intialize shaders.');
		return;
	}
	// Initialize vertex info
	var vbuffer = initVertexBuffers(gl, vertices, colors, normals, indices);
	if (vbuffer < 0) {
		console.log('Failed to set the vertex information');
    	return;
	}

	var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
	var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
	var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
	var u_SpecularLight = gl.getUniformLocation(gl.program, 'u_SpecularLight');
	var u_SpecExp = gl.getUniformLocation(gl.program, 'u_SpecExp');
	var u_ViewPos = gl.getUniformLocation(gl.program, 'u_ViewPos');
	if (!u_LightColor || !u_LightPosition　|| !u_AmbientLight || !u_SpecularLight || !u_SpecExp || !u_ViewPos) { 
		console.log('Failed to get storage location');
		return;
	}
	// Set the light color (white)
	gl.uniform3f(u_LightColor, light_color[0], light_color[1], light_color[2]);
	// Set the light direction (in the world coordinate)
	gl.uniform3f(u_LightPosition, light_point[0], light_point[1], light_point[2]);
	// Set the ambient light
	gl.uniform3f(u_AmbientLight, ambient[0], ambient[1], ambient[2]);
	// Set specular light and exponent
	gl.uniform3f(u_SpecularLight, specular[0], specular[1], specular[2]);
	gl.uniform1f(u_SpecExp, specExp);
	gl.uniform3f(u_ViewPos, eyeX, eyeY, eyeZ);

	// Get the storage location of booleans
	var rotatedTF = gl.getUniformLocation(gl.program, 'rotated');
	if (rotatedTF < 0) {
		console.log('Failed to get the storage location of uniform float/boolean');
		return;
	}
	gl.uniform1f(rotatedTF, rotated);

	var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
	var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
	var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
	if (!u_ViewMatrix || !u_ProjMatrix || !u_ModelMatrix || !u_NormalMatrix) { 
		console.log('Failed to get the storage location of a matrix');
		return;
	}

	var viewMatrix = new Matrix4();  // The view matrix
	var projMatrix = new Matrix4();  // The projection matrix
	var modelMatrix = new Matrix4(); // The transformation matrix
	var normalMatrix = new Matrix4(); // Transformation matrix for normals

	// calculate the view matrix and projection matrix
	viewMatrix.setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);  //setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ)
	projMatrix.setPerspective(fovy, aspect, 1, 100);  // fovy, aspect, near, far
	modelMatrix.setTranslate(Tx, Ty, Tz);  // Set translation matrix
	// Pass the view and projection matrix to u_ViewMatrix, u_ProjMatrix
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

	var mouseDownPosX = 0;
	var mouseDownPosY = 0;
	var mouseUpPosX = 0;
	var mouseUpPosY = 0;
	var mouseDown = 0;
	var mouseButton = -1;

	canvas.oncontextmenu = function() { return false; };
	canvas.onmousedown = function(ev){
		mouseDownPosX = ev.clientX;
		mouseDownPosY = ev.clientY; 
		lastMouseX = mouseDownPosX;
		lastMouseY = mouseDownPosY;
		mouseDown = 1;
		mouseButton = ev.button;
	};
	canvas.onmouseup = function(ev){
		mouseUpPosX = ev.clientX;
		mouseUpPosY = ev.clientY;
		mouseDownPosX = 0;
		mouseDownPosY = 0;
		mouseDown = 0;
		mouseButton = -1;
	};
	canvas.onmousemove = function(ev){
		if (mouseDown != 0) {
			if (mouseButton == 0) {
				translateCube(ev, canvas, gl, vbuffer, modelMatrix, u_ModelMatrix, mouseDownPosX, mouseDownPosY);
			}
			else if (mouseButton == 2) {
				rotateCube(ev, canvas, gl, vbuffer, modelMatrix, u_ModelMatrix, mouseDownPosX, mouseDownPosY, normalMatrix, u_NormalMatrix, rotatedTF);
			}
		}
	};

	document.onkeydown = function(ev) {
		if (ev.keyCode == 37) {  // pressed left arrow: pan camera left
			moveCameraXNeg(ev, gl, vbuffer, viewMatrix, u_ViewMatrix, u_ViewPos);
		}
		else if (ev.keyCode == 39) {  // pressed right arrow: pan camera right
			moveCameraXPos(ev, gl, vbuffer, viewMatrix, u_ViewMatrix, u_ViewPos);
		}
		else if (ev.keyCode == 38) {  // pressed up arrow: pan camera up
			moveCameraYPos(ev, gl, vbuffer, viewMatrix, u_ViewMatrix, u_ViewPos);
		}
		else if (ev.keyCode == 40) {  // pressed down arrow: pan camera down
			moveCameraYNeg(ev, gl, vbuffer, viewMatrix, u_ViewMatrix, u_ViewPos);
		}
		else if (ev.keyCode == 189) {  // pressed -/_ key: pan camera in
			moveCameraZNeg(ev, gl, vbuffer, viewMatrix, u_ViewMatrix, u_ViewPos);
		}
		else if (ev.keyCode == 187) {  // pressed +/= key: pan camera out
			moveCameraZPos(ev, gl, vbuffer, viewMatrix, u_ViewMatrix, u_ViewPos);
		}
		else if (ev.keyCode == 1) {  // pressed 1/! key: rotate camera around y axis: 
			console.log("yay");
			rotateCameraAroundYPos(ev, gl, vbuffer, viewMatrix, u_ViewMatrix, u_ViewPos);
		}
		else if (ev.keyCode == 2) {  // pressed 2/@ key: rotate camera around y axis:
			rotateCameraAroundYNeg(ev, gl, vbuffer, viewMatrix, u_ViewMatrix, u_ViewPos);
		}
	}

	scaleSlider.oninput = function(ev){ scaleCube(ev, gl, canvas, scaleInfo, scaleSlider, vbuffer, modelMatrix, u_ModelMatrix); };
	zoomSlider.oninput = function(ev){ zoomFOV(gl, vbuffer, projMatrix, u_ProjMatrix, zoomSlider, zoomInfo); };
	aspectSlider.oninput = function(ev){ changeAspectRatio(gl, vbuffer, projMatrix, u_ProjMatrix, aspectSlider, aspectInfo); };
	rotateZcounterBtn.onclick = function(){ rotateCameraAroundZ(gl, vbuffer, viewMatrix, u_ViewMatrix, u_ViewPos, 1); };
	rotateZclockBtn.onclick = function(){ rotateCameraAroundZ(gl, vbuffer, viewMatrix, u_ViewMatrix, u_ViewPos, -1); };
	turnCamSlider.oninput = function(ev){ turnCameraY(ev, gl, vbuffer, viewMatrix, u_ViewMatrix, turnCamSlider, turnCamInfo); };

	// Specify the color for clearing <canvas>
	gl.clearColor(255.0, 255.0, 255.0, 1.0);

	gl.enable(gl.DEPTH_TEST);

	// Clear <canvas> and depth buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	// Draw the cube
	gl.drawElements(gl.TRIANGLES, vbuffer, gl.UNSIGNED_BYTE, 0);
}

var normals = []; // Array for normals for each triangle (normalized to  0.7)
var normal_start = [];
var stopClick = false;  // Becomes true on right click
var sides = 12; // Set number of sides
var radius = 0.09;  // Set the radius of the polygonal face
var drawNorms = false; // Don't draw normals unless true
var light_point = [-4.0, 7.0, -16.0]; // point light is coming from
var light_color = [1.0, 1.0, 1.0]; // color of light
var ambient = [0.15, 0.0, 0.15];  //ambient light
var specular = [2.0, 2.0, 0.0];  //specular light
var specExp = 800;  // exponent for specular light calcs
var eyeX = 4;
var eyeY = 6;
var eyeZ = 14;
var atX = 0;
var atY = 0;
var atZ = 0;
var upX = 0;
var upY = 1;
var upZ = 0;
var Tx = 0;
var Ty = 0;
var Tz = 0;
var rotateAngle = 2;
var rotated = 0.0; // 0: false, 1: true
var lastMouseX = 0;
var lastMouseY = 0;
var fovy = 30;
var aspect = 1;

function drawCube(vbuffer, gl) {
	// Clear <canvas> and depth buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	// Draw the cube
	gl.drawElements(gl.TRIANGLES, vbuffer, gl.UNSIGNED_BYTE, 0);
	return;
}

function turnCameraY(ev, gl, vbuffer, viewMatrix, u_ViewMatrix, turnCamSlider, turnCamInfo) {
	var sliderVal = turnCamSlider.value;
	if (sliderVal == 1) {
		atX = 3;
		atZ = -1.5;
	}
	else if (sliderVal == 2) {
		atX = 2;
		atZ = -0.7; 
	}
	else if (sliderVal == 3) {
		atX = 0;
		atZ = 0; 
	}
	else if (sliderVal == 4) {
		atX = -2;
		atZ = 0.7; 
	}
	else if (sliderVal == 5) {
		atX = -3;
		atZ = 1.5;
	}
	eyeX = 4;
	eyeY = 6;
	eyeZ = 14;
	viewMatrix.setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	drawCube(vbuffer, gl);
	return;
}

function rotateCameraAroundZ(gl, vbuffer, viewMatrix, u_ViewMatrix, u_ViewPos, angle) {
	var pt1 = [0, 0, 0];
	var pt2 = [0, 0, 1];
	var rot_pt = [eyeX, eyeY, eyeZ];
	var rotated = rotatePoint(pt1, pt2, rot_pt, angle);
	console.log(rotated);
	eyeX = rotated[0];
	eyeY = rotated[1];
	eyeZ = rotated[2];
	viewMatrix.setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniform3f(u_ViewPos, eyeX, eyeY, eyeZ);
	drawCube(vbuffer, gl);
	return;
}

function changeAspectRatio(gl, vbuffer, projMatrix, u_ProjMatrix, aspectSlider, aspectInfo) {
	var sliderVal = aspectSlider.value;
	var newAspect = 0;
	if (sliderVal == 1) {
		newAspect = 0.1; aspectInfo.innerHTML = "Current aspect ratio: 1:10";
	}
	else if (sliderVal == 2) {
		newAspect = 0.5; aspectInfo.innerHTML = "Current aspect ratio: 1:2";
	}
	else if (sliderVal == 3) {
		newAspect = 1; aspectInfo.innerHTML = "Current aspect ratio: 1:1";
	}
	else if (sliderVal == 4) {
		newAspect = 1.5; aspectInfo.innerHTML = "Current aspect ratio: 3:2";
	}
	else if (sliderVal == 5) {
		newAspect = 2; aspectInfo.innerHTML = "Current aspect ratio: 2:1";
	}
	else if (sliderVal == 6) {
		newAspect = 2.5; aspectInfo.innerHTML = "Current aspect ratio: 5:2";
	}
	else if (sliderVal == 7) {
		newAspect = 3; aspectInfo.innerHTML = "Current aspect ratio: 3:1";
	}
	aspect = newAspect;
	projMatrix.setPerspective(fovy, aspect, 1, 100);
	gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
	drawCube(vbuffer, gl);
	return;
}

function rotateCameraAroundYPos(ev, gl, vbuffer, viewMatrix, u_ViewMatrix, u_ViewPos) {
	// move towards negative X, to left on screen
	eyeY += 0.3;
	viewMatrix.setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniform3f(u_ViewPos, eyeX, eyeY, eyeZ);
	drawCube(vbuffer, gl);
	return;
}

function rotateCameraAroundYNeg(ev, gl, vbuffer, viewMatrix, u_ViewMatrix, u_ViewPos) {
	// move towards negative X, to left on screen
	eyeY -= 0.3;
	viewMatrix.setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniform3f(u_ViewPos, eyeX, eyeY, eyeZ);
	drawCube(vbuffer, gl);
	return;
}

function zoomFOV(gl, vbuffer, projMatrix, u_ProjMatrix, zoomSlider, zoomInfo) {
	var newFOV = zoomSlider.value;
	fovy = newFOV;
	zoomInfo.innerHTML = "Current zoom: " + newFOV;
	projMatrix.setPerspective(fovy, aspect, 1, 100);
	gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
	drawCube(vbuffer, gl);
	return;
}

function moveCameraXPos(ev, gl, vbuffer, viewMatrix, u_ViewMatrix, u_ViewPos) {
	// move towards positive X, to right on screen
	eyeX += 0.3;
	atX += 0.3;
	viewMatrix.setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniform3f(u_ViewPos, eyeX, eyeY, eyeZ);
	drawCube(vbuffer, gl);
	return;
}

function moveCameraXNeg(ev, gl, vbuffer, viewMatrix, u_ViewMatrix, u_ViewPos) {
	// move towards negative X, to left on screen
	eyeX -= 0.3;
	atX -= 0.3;
	viewMatrix.setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniform3f(u_ViewPos, eyeX, eyeY, eyeZ);
	drawCube(vbuffer, gl);
	return;
}

function moveCameraYPos(ev, gl, vbuffer, viewMatrix, u_ViewMatrix, u_ViewPos) {
	// move towards positive Y, upwards on screen
	eyeY += 0.3;
	atY += 0.3;
	viewMatrix.setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniform3f(u_ViewPos, eyeX, eyeY, eyeZ);
	drawCube(vbuffer, gl);
	return;
}

function moveCameraYNeg(ev, gl, vbuffer, viewMatrix, u_ViewMatrix, u_ViewPos) {
	// move towards negative Y, downwards on screen
	eyeY -= 0.3;
	atY -= 0.3;
	viewMatrix.setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniform3f(u_ViewPos, eyeX, eyeY, eyeZ);
	drawCube(vbuffer, gl);
	return;
}

function moveCameraZNeg(ev, gl, vbuffer, viewMatrix, u_ViewMatrix, u_ViewPos) {
	// move towards negative Z, into screen
	eyeZ -= 0.3;
	atZ -= 0.3;
	viewMatrix.setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniform3f(u_ViewPos, eyeX, eyeY, eyeZ);
	drawCube(vbuffer, gl);
	return;
}

function moveCameraZPos(ev, gl, vbuffer, viewMatrix, u_ViewMatrix, u_ViewPos) {
	// move to positive Z, out of screen
	eyeZ += 0.3;
	atZ += 0.3;
	viewMatrix.setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniform3f(u_ViewPos, eyeX, eyeY, eyeZ);
	drawCube(vbuffer, gl);
	return;
}

function translateCube(ev, canvas, gl, vbuffer, modelMatrix, u_ModelMatrix, mouseDownPosX, mouseDownPosY) {
	// console.log("translate");
	var mouseX = ev.clientX;
	var mouseY = ev.clientY;
	var mouseDownX = mouseDownPosX;
	var mouseDownY = mouseDownPosY;
	var diffX = 0;
	var diffY = 0;
	var rect = ev.target.getBoundingClientRect();
	// console.log(rect.left + ", " + rect.bottom + ", " + mouseDownX + ", " + mouseDownY);
		mouseDownX = mouseDownX - rect.left;
		mouseDownY = rect.bottom - mouseDownY;
		mouseX = mouseX - rect.left;
		mouseY = rect.bottom - mouseY;
		if (mouseDownX >= mouseX) {
			diffX = mouseDownX - mouseX;
			diffX = diffX * -1;
		}
		else {
			diffX = mouseX - mouseDownX;
		}
		if (mouseDownY >= mouseY) {
			diffY = mouseDownY - mouseY;
			diffY = diffY * -1;
		}
		else {
			diffY = mouseY - mouseDownY;
		}
	Tx = mouseX / 500;
	Ty = mouseY / 500;
	modelMatrix.setTranslate(Tx, Ty, Tz);  // Set translation matrix
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements); // pass to shader
	drawCube(vbuffer, gl);
	return;
}


function rotateCube(ev, canvas, gl, vbuffer, modelMatrix, u_ModelMatrix, mouseDownPosX, mouseDownPosY, normalMatrix, u_NormalMatrix, rotatedTF) {
	rotated = 1.0;
	gl.uniform1f(rotatedTF, rotated);
	var mouseX = ev.clientX;
	var mouseY = ev.clientY;
	var pastMouseX = lastMouseX;
	var pastMouseY = lastMouseY;
	lastMouseX = mouseX;
	lastMouseY = mouseY;
	var diffX = 0;
	var diffY = 0;
	var rect = ev.target.getBoundingClientRect();
	pastMouseX = pastMouseX - rect.left;
	pastMouseY = rect.bottom - pastMouseY;
	mouseX = mouseX - rect.left;
	mouseY = rect.bottom - mouseY;
	if (pastMouseX >= mouseX) {
		diffX = pastMouseX - mouseX;
		diffX = diffX * -1;
	}
	else {
		diffX = mouseX - pastMouseX;
	}
	//console.log("diffX: " + diffX);
	if (pastMouseY >= mouseY) {
		diffY = pastMouseY - mouseY;
		diffY = diffY * -1;
	}
	else {
		diffY = mouseY - pastMouseY;
	}
	//console.log("diffY: " + diffY);
	var x = mouseX / 500;
	var y = mouseY / 500;

	if (Math.abs(diffX) >= Math.abs(diffY)) {
		modelMatrix.rotate(rotateAngle * diffX, 0, 1, 0);
	}
	else {
		modelMatrix.rotate(rotateAngle * diffY, 1, 0, 0);
	}

	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements); // pass to shader
	normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
	 
	drawCube(vbuffer, gl);
	return;
}


function scaleCube(ev, gl, canvas, scaleInfo, scaleSlider, vbuffer, modelMatrix, u_ModelMatrix) {
	var scaleBy = scaleSlider.value;
	scaleBy = scaleBy / 10;
	scaleInfo.innerHTML = "Current scale: " + scaleBy;
	modelMatrix.setScale(scaleBy, scaleBy, scaleBy);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements); // pass to shader
	drawCube(vbuffer, gl);
	return;
}

function zTranslateCube(gl, canvas, zTransSlider, translation, vbuffer, modelMatrix, u_ModelMatrix) {
	var translateBy = zTransSlider.value;
	translateBy = translateBy / 10;
	if (translateBy < 6) {
		translateBy = 6 - translateBy;
		translateBy = translateBy * -1;
	}
	else if (translateBy == 6) {
		translateBy = 0;
	}
	else {
		translateBy = translateBy - 6;
	}
	translation.innerHTML = "Current translation: " + translateBy;
	Tx = 0;
	Ty = 0;
	modelMatrix.setTranslate(Tx, Ty, translateBy);  // Set translation matrix
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements); // pass to shader
	drawCube(vbuffer, gl);
	return;
}

function turnOnGravity(gl, vbuffer, modelMatrix, u_ModelMatrix) {
	Tx = 0;
	Ty = 0;
	Tz = 0;
	var counter = 0;
	var interval = setInterval(function() {
		if (counter < 95) {
			Ty -= 0.1;
			modelMatrix.setTranslate(Tx, Ty, Tz);  // Set translation matrix
			gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements); // pass to shader
			drawCube(vbuffer, gl);
			counter++;
		}
		else {
			clearInterval(interval);
		}
	}, 10);
	return;
}

function moveCameraView(moveView, g_points, cyl_points1, cyl_points2, gl, color, u_ViewMatrix, u_ProjMatrix, canvas) {
	if (eyeX == 0) {
		eyeX = 1; eyeY = 1; 
		moveView.innerText = "Move camera to 0,0,5";
	}
	else {
		eyeX = 0; eyeY = 0; 
		moveView.innerText = "Move camera to 1,1,5";
	}
	var viewMatrix = new Matrix4();  // The view matrix
	var projMatrix = new Matrix4();  // The projection matrix
	// calculate the view matrix and projection matrix
	viewMatrix.setLookAt(eyeX, eyeY, eyeZ, 0, 0, -100, 0, 1, 0);  //setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ)
	projMatrix.setPerspective(30, canvas.width/canvas.height, 4, 100);  // fovy, aspect, near, far
	// Pass the view and projection matrix to u_ViewMatrix, u_ProjMatrix
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

	drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
	return;
}


function changeSpecularGlossiness(specularSlider, u_SpecExp, gl, vbuffer) {
	var glossChoice = specularSlider.value; 
	specExp = glossChoice;
	gl.uniform1f(u_SpecExp, specExp);
	drawCube(vbuffer, gl);
	// Print point size to page
	document.getElementById('glossiness').innerHTML = 'Current glossiness: ' + glossChoice;
}


// Calculate surface normal of triangle
// Gives normal at 0,0,0
function surface_normal(p1, p2, p3) {
	var v1 = [(p2[0] - p1[0]), (p2[1] - p1[1]), (p2[2] - p1[2])];
	var v2 = [(p3[0] - p1[0]), (p3[1] - p1[1]), (p3[2] - p1[2])];
	var normal = [(v1[1])*(v2[2]) - (v1[2])*(v2[1]), 
				  (v1[2])*(v2[0]) - (v1[0])*(v2[2]), 
				  (v1[0])*(v2[1]) - (v1[1])*(v2[0])];
	return normal;
}


function initVertexBuffers(gl, vertices, colors, normals, indices) {
	// Write the vertex property to buffers (coordinates, colors and normals)
	if (!initArrayBuffer(gl, 'a_Position', vertices, 3)) return -1;
	if (!initArrayBuffer(gl, 'a_Color', colors, 3)) return -1;
	if (!initArrayBuffer(gl, 'a_Normal', normals, 3)) return -1;

	// Unbind the buffer object
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	// Create buffer object
	var indexBuffer = gl.createBuffer();
	if (!indexBuffer) {
		console.log('Failed to create index buffer object');
		return -1;
	}
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

	return indices.length;
}

function initArrayBuffer(gl, attribute, data, num) {
	var buffer = gl.createBuffer();
	if (!buffer) {
		console.log('Failed to create buffer object in initArrayBuffer');
		return false;
	}
	// Write data into buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	// Assign buffer to the attribute variable
	var a_attribute = gl.getAttribLocation(gl.program, attribute);
	if (a_attribute < 0) {
		console.log('Failed to get storage location of ' + attribute);
		return false;
	}
	gl.vertexAttribPointer(a_attribute, num, gl.FLOAT, false, 0, 0);
	// Enable assignment of buffer to the attribute var
	gl.enableVertexAttribArray(a_attribute);
	// console.log("Made buffer for " + attribute);
	return true;
}

// Calculate diffuse light on object
function diffuse(light_color, diffuse_coef, light_point, normal) {
	var norm_light = normalize(light_point[0], light_point[1], light_point[2], 1);
	var norm_normal = normalize(normal[0], normal[1], normal[2], 1);
	var dot = dotProduct(norm_light, norm_normal);
	var max = Math.max(dot, 0.0);
	var diffuseR = light_color[0] * diffuse_coef[0] * max;
	var diffuseG = light_color[1] * diffuse_coef[1] * max;
	var diffuseB = light_color[2] * diffuse_coef[2] * max;
	var diffuse = [diffuseR, diffuseG, diffuseB];
	return diffuse;
}

function dotProduct (u, v) {
	var dot = (u[0] * v[0]) + (u[1] * v[1]) + (u[2] * v[2]);
	return dot;
}

    
function rotatePoint(mid_line1, mid_line2, rot_pt, angleDegrees) {
	// Based on code from https://sites.google.com/site/glennmurray/Home/rotation-matrices-and-formulas
	//var angle = (2 * Math.PI) / sides;  // angle between sides & angle of rotation
	var angle = angleDegrees; //* Math.PI / 180;
	// console.log("angle " + angle);
	var vec = [mid_line2[0] - mid_line1[0], mid_line2[1] - mid_line1[1], mid_line2[2] - mid_line1[2]];
	// vec = normalize(vec[0], vec[1], 0.3);
	var L = vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2];
	var a = mid_line1[0];
	var b = mid_line1[1];
	var c = mid_line1[2];
	var x = rot_pt[0];
	var y = rot_pt[1];
	var z = rot_pt[2];
	var u = vec[0];
	var v = vec[1];
	var w = vec[2];
	// All da math >.<
	var newX = ((a*(v*v + w*w) - u*(b*v + c*w - u*x - v*y - w*z)) * (1 - Math.cos(angle)) + L*x*Math.cos(angle) + Math.sqrt(L) * (-1*c*v + b*w - w*y + v*z) * Math.sin(angle))/L;
	var newY = ((b*(u*u + w*w) - v*(a*u + c*w - u*x - v*y - w*z)) * (1 - Math.cos(angle)) + L*y*Math.cos(angle) + Math.sqrt(L) * (c*u - a*w + w*x - u*z) * Math.sin(angle))/L;
	var newZ = ((c*(u*u + v*v) - w*(a*u + b*v - u*x - v*y - w*z)) * (1 - Math.cos(angle)) + L*z*Math.cos(angle) + Math.sqrt(L) * (-1*b*u + a*v - v*x + u*y) * Math.sin(angle))/L;
	var newpt = [newX, newY, newZ];
	return newpt;
}


function normalize(normX, normY, normZ, scale) {
	// no z needed now because line is in x,y only
	var normal = [0, 0, 0]; // need array to return normalized x and y
	var sqrt = Math.sqrt(normX * normX + normY * normY + normZ * normZ);
	if (sqrt != 0) {
		normal[0] = scale * (normX / sqrt); // normalized X
		normal[1] = scale * (normY / sqrt); // normalized Y
		normal[2] = scale * (normZ / sqrt);  // normalized Z
	}
	return normal;
}