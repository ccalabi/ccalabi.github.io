// Written by Cori Calabi, ccalabi
// Some elements from Matsuda Lea book examples

// Vertex shader program
var VSHADER_SOURCE =
	'precision mediump float;\n' +
	'uniform float Phong;\n' +
	'uniform float picked;\n' +
	'uniform float hover;\n' +
	'uniform float projection;\n' +
	'attribute vec4 a_Position;\n' +
	'uniform float u_PointSize;\n' +
	'attribute vec4 a_Color;\n' +
	'attribute vec4 a_Normal;\n' +
	'uniform mat4 u_ViewMatrix;\n' +
	'uniform mat4 u_ProjMatrix;\n' +
	'uniform float Depth;\n' +
	'uniform vec3 u_LightColor;\n' + // Light color
	'uniform vec3 u_LightPosition;\n' + // Position of the light source
	'uniform vec3 u_AmbientLight;\n' +  // Ambient light color
	'uniform vec3 u_SpecularLight;\n' +  // Specular light color
    'uniform float u_SpecExp;\n' +  // Specular exponent
	'varying vec4 v_Color;\n' +
    'varying vec3 v_Normal;\n' +  // for per fragment 
	'varying vec3 v_Position;\n' +  // for per fragment
	'void main() {\n' +
	'  if (projection == 0.0) {\n' +
	'    gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;\n' +
	'  }\n' +
	'  else {\n' +
	'    gl_Position = a_Position;\n' +
	'  }\n' +
	'  if (Phong == 0.0) {\n' +
	'    vec3 normal = normalize(vec3(a_Normal));\n' +
	'    vec4 vertexPosition = a_Position;\n' +
	     // Calculate the light direction and make it 1.0 in length
	'    vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));\n' +
	     // The dot product of the light direction and the normal
	'    float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
	     // Calculate the color due to diffuse reflection
	'    vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;\n' +
	     // Calculate the color due to ambient reflection
	'    vec3 ambient = u_AmbientLight;\n' +
	'    float spec = 0.0;\n' + 
    '    vec3 viewVec = vec3(0,0,1.0);\n' +
    '    vec3 reflectVec = reflect(-lightDirection, normal);\n' +
    '    spec = pow(max(dot(reflectVec, viewVec), 0.0), u_SpecExp);\n' +
    '    vec3 specular = u_SpecularLight * spec;\n' +
	 
	'    if (Depth == 1.0) {\n' +
    '      if (a_Position.z < 1.0 && a_Position.z >= 0.08) {\n' +
    '        v_Color = vec4(0.9, 0.9, 0.9, a_Color.a);\n' +
    '      }\n' +
    '      else if (a_Position.z < 0.08 && a_Position.z >= 0.05) {\n' +
    '        v_Color = vec4(0.7, 0.7, 0.7, a_Color.a);\n' +
    '      }\n' +
    '      else if (a_Position.z < 0.05 && a_Position.z >= 0.02) {\n' +
    '        v_Color = vec4(0.4, 0.4, 0.4, a_Color.a);\n' +
    '      }\n' +
    '      else if (a_Position.z < 0.02 && a_Position.z >= 0.0) {\n' +
    '        v_Color = vec4(0.2, 0.2, 0.2, a_Color.a);\n' +
    '      }\n' +
    '      else {\n' +
    '        v_Color = vec4(0.1, 0.1, 0.1, a_Color.a);\n' +
    '      }\n' +
    '    }\n' +
    '    else {\n' +
           // Add the surface colors due to diffuse, ambient, and specular reflection
	'      v_Color = vec4(diffuse + ambient + specular, a_Color.a);\n' +
    '    }\n' +
	'    gl_PointSize = u_PointSize;\n' +
	'  }\n' +
	'  else {\n' +
	//'    gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;\n' +
	'    v_Position = vec3(a_Position);\n' +
	'    v_Normal = normalize(vec3(a_Normal));\n' +
	'    v_Color = a_Color;\n' +
	//      // Add the surface colors due to diffuse, ambient, and specular reflection
	// '    v_Color = vec4(diffuse + ambient + specular, a_Color.a);\n' +
	'  }\n' +
	'  if (picked == 1.0) {\n' +
	'    vec4 highlight = vec4(0.1, 0.1, 0.1, 0);\n' +
	'    v_Color = v_Color + highlight;\n' +
	'  }\n' +
	'  if (hover == 1.0) {\n' +
	'    vec4 hoverHighlight = vec4(0.0, 0.0, 0.2, 0);\n' +
	'    v_Color = v_Color + hoverHighlight;\n' +
	'  }\n' +
	'}\n';

// Fragment shader program
var FSHADER_SOURCE =
	'#ifdef GL_ES\n' +
	'precision mediump float;\n' +
	'#endif\n' +
	'uniform float Phong;\n' +
	'uniform float picked;\n' +
	'uniform float hover;\n' +
	'uniform vec3 u_LightColor;\n' +     // Light color
    'uniform vec3 u_LightPosition;\n' +  // Position of the light source
    'uniform vec3 u_AmbientLight;\n' +   // Ambient light color
    'uniform vec3 u_SpecularLight;\n' +  // Specular light color
    'uniform float u_SpecExp;\n' +  // Specular exponent
    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' +
    'varying vec4 v_Color;\n' +
	'void main() {\n' +
	'  if (Phong == 0.0) {\n' +
	'    gl_FragColor = v_Color;\n' +
	'  }\n' +
	'  else {\n' +
	     // Normalize the normal because it is interpolated and not 1.0 in length any more
    '    vec3 normal = normalize(v_Normal);\n' +
         // Calculate the light direction and make its length 1.
    '    vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
         // The dot product of the light direction and the orientation of a surface (the normal)
    '    float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
         // Calculate the final color from diffuse reflection and ambient reflection
    '    vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n' +
    '    vec3 ambient = u_AmbientLight;\n' + 

    '    float spec = 0.0;\n' + 
    '    vec3 viewVec = vec3(0,0,1.0);\n' +
    '    vec3 reflectVec = reflect(-lightDirection, normal);\n' +
    '    spec = pow(max(dot(reflectVec, viewVec), 0.0), u_SpecExp);\n' +
    '    vec3 specular = u_SpecularLight * spec;\n' +
    '    gl_FragColor = vec4(diffuse + ambient + specular, v_Color.a);\n' +
    '  }\n' +
    '  if (picked == 1.0) {\n' +
	'    vec4 highlight = vec4(0.1, 0.1, 0.1, 0);\n' +
	'    gl_FragColor = gl_FragColor + highlight;\n' +
	'  }\n' +
	'  if (hover == 1.0) {\n' +
	'    vec4 hoverHighlight = vec4(0.0, 0.0, 0.2, 0);\n' +
	'    gl_FragColor = gl_FragColor + hoverHighlight;\n' +
	'  }\n' +
	'}\n';


function main() {
	// Retrieve HTML elements
	var canvas = document.getElementById('webgl');
	var outerDiv = document.getElementById('outer');
	// var colorBtn = document.getElementById('colorBtn');
	// var pointSlider = document.getElementById('pointSlider');
	// var ptsize = document.getElementById('ptsize');
	var radiusSlider = document.getElementById('radiusSlider');
	var radiusSize = document.getElementById('radiusSize');
	// var left = document.getElementById('left');
	// var right = document.getElementById('right');
	// var up = document.getElementById('up');
	// var down = document.getElementById('down');
	var switchPhGo = document.getElementById('switchPhGo');
	var changeAmbient = document.getElementById('changeAmbient');
	var specularSlider = document.getElementById('specularSlider');
	var switchDepth = document.getElementById('switchDepth');
	var nearSlider = document.getElementById('nearSlider');
	var nearInfo = document.getElementById('nearPlane');
	var switchOrthoPersp = document.getElementById('switchOrthoPersp');
	var moveView = document.getElementById('moveCamera');

	var g_points = []; // The array for the position of a mouse press
	var cyl_points1 = []; // Array for first circle of cylinder points
	var cyl_points2 = []; // Array for second circle of cylinder points
	var color = []; // Array for cylinder colors
	var pt_color = []; // Array for points and lines colors

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

	var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
	var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
	var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
	var u_SpecularLight = gl.getUniformLocation(gl.program, 'u_SpecularLight');
	var u_SpecExp = gl.getUniformLocation(gl.program, 'u_SpecExp');
	if (!u_LightColor || !u_LightPosition　|| !u_AmbientLight || !u_SpecularLight || !u_SpecExp) { 
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

	// Get the storage location of a_Position
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return;
	}

	// Get the storage location of Phong
	var PhongTF = gl.getUniformLocation(gl.program, 'Phong');
	var pickedObj = gl.getUniformLocation(gl.program, 'picked');
	var hoverObj = gl.getUniformLocation(gl.program, 'hover');
	var switchProjection = gl.getUniformLocation(gl.program, 'projection');
	var Depth = gl.getUniformLocation(gl.program, 'Depth');
	if (PhongTF < 0 || pickedObj < 0 || Depth < 0 || hoverObj < 0 || switchProjection < 0) {
		console.log('Failed to get the storage location of PhongTF or Depth or pickedObj or hoverObj or switchProjection');
		return;
	}
	gl.uniform1f(PhongTF, Phong);
	gl.uniform1f(pickedObj, picked);
	gl.uniform1f(Depth, DepthBool);
	gl.uniform1f(hoverObj, hover);
	gl.uniform1f(switchProjection, orthoPersp);

	// Get the storage location of u_PointSize
	var u_PointSize = gl.getUniformLocation(gl.program, 'u_PointSize');
	if (!u_PointSize) {
		console.log('Failed to get the storage location of u_PointSize');
		return;
	}
	// Make point size 10.0
	gl.uniform1f(u_PointSize, 5.0);

	var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
	var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
	if (!u_ViewMatrix || !u_ProjMatrix) { 
		console.log('Failed to get the storage location of u_ViewMatrix and/or u_ProjMatrix');
		return;
	}

	var viewMatrix = new Matrix4();  // The view matrix
	var projMatrix = new Matrix4();  // The projection matrix
	// calculate the view matrix and projection matrix
	viewMatrix.setLookAt(eyeX, eyeY, eyeZ, 0, 0, 0, 0, 1, 0);  //setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ)
	projMatrix.setPerspective(30, canvas.width/canvas.height, 4, 100);  // fovy, aspect, near, far
	// Pass the view and projection matrix to u_ViewMatrix, u_ProjMatrix
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

	// Register function (event handler) to be called on a mouse press
	// canvas.onmousemove = function(ev){ rubberbandLine(ev, gl, canvas, g_points, pt_color); };
	canvas.onmousedown = function(ev){ click(ev, gl, canvas, a_Position, g_points, cyl_points1, cyl_points2, color, pt_color); };
	// colorBtn.onchange = function(ev){ changeLineColor(ev, gl, colorBtn, u_FragColor, g_points, cyl_points1, cyl_points2, color, pt_color, normals, normal_start); };
	// pointSlider.oninput = function(ev){ numberSides(ev, gl, pointSlider, g_points, cyl_points1, cyl_points2, color, pt_color, normals, normal_start); };
	radiusSlider.oninput = function(ev){ changeRadiusSize(ev, gl, radiusSlider, radiusSize, g_points, cyl_points1, cyl_points2, color, pt_color); };
	// left.onclick = function(ev){ shiftPoints(ev, gl, g_points, left, pt_color); };
	// right.onclick = function(ev){ shiftPoints(ev, gl, g_points, right, pt_color); };
	// up.onclick = function(ev){ shiftPoints(ev, gl, g_points, up, pt_color); };
	// down.onclick = function(ev){ shiftPoints(ev, gl, g_points, down, pt_color); };
	// document.getElementById('update_screen').onclick = function(){ updateScreen(canvas, gl, g_points, pt_color); };
	// document.getElementById('save_canvas').onclick = function(){ saveCanvas(g_points); };
	// document.getElementById('reset_canvas').onclick = function(){ resetCanvas(canvas, gl, g_points, a_Position, cyl_points1, cyl_points2, color, pt_color); };
    // document.getElementById('normals').onclick = function(){ showNormals(g_points, cyl_points1, cyl_points2, gl, color); };
	document.getElementById('shift_cyl').onclick = function(){ shiftCylinder(gl, g_points, cyl_points1, cyl_points2, color); };
	document.getElementById('shift_light').onclick = function(){ shiftLight(u_LightPosition, g_points, cyl_points1, cyl_points2, gl, color); };
	// document.getElementById('change_color').onclick = function(){ changeLightColor(g_points, cyl_points1, cyl_points2, gl, color); };
	// document.getElementById('light_off').onclick = function(){ turnOffLight(g_points, cyl_points1, cyl_points2, gl, color); };
	switchPhGo.onclick = function(){ switchPhongGouraud(switchPhGo, PhongTF, g_points, cyl_points1, cyl_points2, gl, color); };
	switchDepth.onclick = function(){ switchDepthGourand(Depth, switchDepth, g_points, cyl_points1, cyl_points2, gl, color); };
	changeAmbient.onclick = function(){ changeAmbientColor(u_AmbientLight, g_points, cyl_points1, cyl_points2, gl, color); };
	document.getElementById('changeSpec').onclick = function() { changeSpecularColor(u_SpecularLight, g_points, cyl_points1, cyl_points2, gl, color); };
	specularSlider.oninput = function(){ changeSpecularGlossiness(specularSlider, u_SpecExp, g_points, cyl_points1, cyl_points2, gl, color); };
	canvas.onclick = function(ev){ pixelColor(canvas, ev, gl, g_points, cyl_points1, cyl_points2, color, pickedObj); };
	nearSlider.oninput = function(){ changeNearPlane(nearInfo, nearSlider, u_ViewMatrix, u_ProjMatrix, g_points, cyl_points1, cyl_points2, gl, color, canvas); };
	canvas.onmousemove = function(ev){ hoverOverObj(canvas, ev, gl, g_points, cyl_points1, cyl_points2, color, hoverObj); };
	switchOrthoPersp.onclick = function(){ toggleProjection(switchOrthoPersp, g_points, cyl_points1, cyl_points2, gl, color, switchProjection); };
	moveView.onclick = function(){ moveCameraView(moveView, g_points, cyl_points1, cyl_points2, gl, color, u_ViewMatrix, u_ProjMatrix, canvas); };

	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	//gl.enable(gl.DEPTH_TEST);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);
	// setup SOR object reading/writing
	// setupIOSOR("fileinput");
}

var Phong = 0.0;  // 0 is false: Gouraud
var DepthBool = 0.0;  // 0.0 is Depth off, 1.0 is on
var normals = []; // Array for normals for each triangle (normalized to  0.7)
var normal_start = [];
// var trueNormals = []; // Array for normalized to one surface normals
var stopClick = false;  // Becomes true on right click
var sides = 12; // Set number of sides
var radius = 0.09;  // Set the radius of the polygonal face
var drawNorms = false; // Don't draw normals unless true
var light_point = [0.0, 1.0, 1.0]; // point light is coming from
var light_color = [1.0, 1.0, 1.0]; // color of light (white)
// var light_point2 = [-1.0, 1.0, 0.0]; // light two: magenta
//var light_color2 = [1.0, 0.0, 1.0];
var ambient = [0.0, 0.0, 0.2];  //ambient light
var specular = [0.0, 1.0, 0.0];  //specular light
var specExp = 20;  // exponent for specular light calcs
var picked = 0.0;  // object was clicked: 1.0 is true
var hover = 0.0;   // mouse is hovering over object: 1.0 is true
var orthoPersp = 0.0;  // persp = 0.0, ortho = 1.0
var eyeX = 0;
var eyeY = 0;
var eyeZ = 5;

function updateScreen(canvas, gl, g_points, pt_color) {
	// make a call to readFile() that returns SOR object, use object to update the screen
	canvas.onmousedown = null; // disable mouse
	var sor = readFile();      // get SOR from file
	// var size = sor.vertices.length;
	// initVertexBuffers(canvas, gl, sor.vertices, size);
	g_points = sor.vertices;
	drawPointsLines(gl, g_points, pt_color);
	// setVertexBuffer(gl, new Float32Array(sor.vertices));
	// setIndexBuffer(gl, new Uint16Array(sor.indexes));
	// clear canvas    
	// gl.clear(gl.COLOR_BUFFER_BIT); 
}

function saveCanvas(g_points) {
	var sor = new SOR();
	sor.objName = "model";
	sor.vertices = g_points;
	sor.indexes = [];
	for (i = 0; i < g_points.length/2; i++)
	sor.indexes.push(i);
	console.log(sor.indexes);
	saveFile(sor);
}

// clears canvas and allows for drawing new cylinders
function resetCanvas(canvas, gl, g_points, a_Position, cyl_points1, cyl_points2, color, pt_color) {
	// canvas.onmousemove = function(ev){ rubberbandLine(ev, gl, canvas, g_points, pt_color); };
	canvas.onmousedown = function(ev){ click(ev, gl, canvas, a_Position, g_points, cyl_points1, cyl_points2, color, pt_color); };
	g_points = [];
	pt_color = [];
	gl.clear(gl.COLOR_BUFFER_BIT);
}

function hoverOverObj(canvas, ev, gl, g_points, cyl_points1, cyl_points2, color, hoverObj) {
	if (stopClick == true) {
		var x = ev.clientX;
		var y = ev.clientY;
		var rect = ev.target.getBoundingClientRect();
		if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
			var x_in_canvas = x - rect.left;
			var y_in_canvas = rect.bottom - y;
			var pixels = new Uint8Array(4);
			drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
			gl.readPixels(x_in_canvas, y_in_canvas, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
			if (pixels[0] == 0 && pixels[1] == 0 && pixels[2] == 0) {
				// hovering over background
				hover = 0.0;
				gl.uniform1f(hoverObj, hover);
				drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
			}
			else {
				// hovering over object
				hover = 1.0;
				gl.uniform1f(hoverObj, hover);
				drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
			}
		}
	}
	return;
}

function pixelColor(canvas, ev, gl, g_points, cyl_points1, cyl_points2, color, pickedObj) {
	// console.log(stopClick);
	if (stopClick == true) {
		var pixels = new Uint8Array(4);
		var x = ev.clientX;
		var y = ev.clientY;
		var rect = ev.target.getBoundingClientRect();
		if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
			var x_in_canvas = x - rect.left;
			var y_in_canvas = rect.bottom - y;
			var picked = false;
			drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
			gl.readPixels(x_in_canvas, y_in_canvas, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
			if (pixels[0] == 0 && pixels[1] == 0 && pixels[2] == 0) {
				// Clicked the background, un-highlight object
				// console.log("Clicked background");
				picked = 0.0;
				gl.uniform1f(pickedObj, picked);
				drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
			}
			else {			
				// Clicked the object: re-draw highlighted
				// console.log("Clicked object");
				// console.log(pixels);
				picked = 1.0;
				gl.uniform1f(pickedObj, picked);
				drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
			}
			console.log("Pixel color: " + pixels[0] + ", " + pixels[1] + ", " + pixels[2]);
		}
	}
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

function toggleProjection(switchOrthoPersp, g_points, cyl_points1, cyl_points2, gl, color, switchProjection) {
	if (orthoPersp == 0.0) {
		orthoPersp = 1.0;
		switchOrthoPersp.innerText = "Switch to Perspective";
	}
	else {
		orthoPersp = 0.0;
		switchOrthoPersp.innerText = "Switch to Orthographic";
	}
	gl.uniform1f(switchProjection, orthoPersp);
	drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
	return;
}

function changeNearPlane(nearInfo, nearSlider, u_ViewMatrix, u_ProjMatrix, g_points, cyl_points1, cyl_points2, gl, color, canvas) {
	var nearChoice = nearSlider.value; 	
	nearChoice = 4 + nearChoice/25;
	var viewMatrix = new Matrix4();  // The view matrix
	var projMatrix = new Matrix4();  // The projection matrix
	// calculate the view matrix and projection matrix
	viewMatrix.setLookAt(0, 0, eyeZ, 0, 0, -100, 0, 1, 0);  //setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ)
	projMatrix.setPerspective(30, canvas.width/canvas.height, nearChoice, 100);  // fovy, aspect, near, far
	// Pass the view and projection matrix to u_ViewMatrix, u_ProjMatrix
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

	drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
	// Print point size to page
	nearInfo.innerHTML = 'Current near plane: ' + nearChoice;
	return;
}

function changeSpecularGlossiness(specularSlider, u_SpecExp, g_points, cyl_points1, cyl_points2, gl, color) {
	var glossChoice = specularSlider.value; 
	specExp = glossChoice;
	gl.uniform1f(u_SpecExp, specExp);
	drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
	// Print point size to page
	document.getElementById('glossiness').innerHTML = 'Current glossiness: ' + glossChoice;
}

function changeSpecularColor(u_SpecularLight, g_points, cyl_points1, cyl_points2, gl, color) {
	if (specular[1] == 1.0) {
		specular = [0.0, 0.0, 1.0];
		gl.uniform3f(u_SpecularLight, specular[0], specular[1], specular[2]);
		drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
	}
	else {
		specular = [0.0, 1.0, 0.0];
		gl.uniform3f(u_SpecularLight, specular[0], specular[1], specular[2]);
		drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
	}
}

function changeAmbientColor(u_AmbientLight, g_points, cyl_points1, cyl_points2, gl, color) {
	if (ambient[2] == 0.2) {
		ambient = [0.0, 0.2, 0.0];
		gl.uniform3f(u_AmbientLight, ambient[0], ambient[1], ambient[2]);
		drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
	}
	else {
		ambient = [0.0, 0.0, 0.2];
		gl.uniform3f(u_AmbientLight, ambient[0], ambient[1], ambient[2]);
		drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
	}
	return;
}

function switchDepthGourand(Depth, switchDepth, g_points, cyl_points1, cyl_points2, gl, color) {
	if (DepthBool == 0.0) {
		DepthBool = 1.0;  // Switch to Depth shading
		gl.uniform1f(Depth, DepthBool);
		drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
		switchDepth.innerText = "Switch back to no depth shading";
	}
	else {
		DepthBool = 0.0;  // Switch to normal Gouraud shading
		gl.uniform1f(Depth, DepthBool);
		drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
		switchDepth.innerText = "Switch to Depth";
	}
	return;
}

function switchPhongGouraud(switchPhGo, PhongTF, g_points, cyl_points1, cyl_points2, gl, color) {
	if (Phong == 0.0) {
		Phong = 1.0;  // Switch to Phong
		gl.uniform1f(PhongTF, Phong);
		drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
		switchPhGo.innerText = "Switch to Gouraud";
	}
	else {
		Phong = 0.0; // Switch to Gouraud
		gl.uniform1f(PhongTF, Phong);
		drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
		switchPhGo.innerText = "Switch to Phong";
	}
	return;
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

// Show and hide normals on button click
function showNormals(g_points, cyl_points1, cyl_points2, gl, color) {
	drawNorms = !drawNorms;
	drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
	return;
}

// Draw surface normals for each (rectangular) face
function drawNormals(gl) {
	// console.log("Normals: " + normals.length + " Normal start: " + normal_start.length);
	var len = normals.length;
	var lines = [];
	var line_colors = [];
	var l_color = [1.0, 0.0, 0.0, 1.0];
	for (var j = 0; j < len; j++) {
		lines.push(normal_start[j][0]);
		lines.push(normal_start[j][1]);
		lines.push(normal_start[j][2]);
		lines.push(normals[j][0]);
		lines.push(normals[j][1]);
		lines.push(normals[j][2]);
		// Add colors for two points
		for (var a = 0; a < 2; a++) {
			line_colors.push(l_color[0]);  line_colors.push(l_color[1]);
			line_colors.push(l_color[2]);  line_colors.push(l_color[3]);
		}
	}
	var line_pts = lines.length;
	var num = initVertexBuffers(gl, line_pts, lines, 3, line_colors);
	if (num < 0) {
			console.log('Failed to set positions of normal vertices');
			return;
		}
	gl.drawArrays(gl.LINES, 0, line_pts/3);	
}

function initVertexBuffers(gl, n, points, size, colors, norms) {
	var pt_data = new Float32Array(points);
	var color_data = new Float32Array(colors);
	var normal_data = new Float32Array(norms);
	
	// Create buffer object
	var vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) {
		console.log('Failed to create vertex buffer object');
		return -1;
	}
	// Write vertices and color to buffer
	if (!initArrayBuffer(gl, pt_data, size, gl.FLOAT, 'a_Position')) return -1;
	if (!initArrayBuffer(gl, color_data, 4, gl.FLOAT, 'a_Color')) return -1;
	if (!initArrayBuffer(gl, normal_data, 3, gl.FLOAT, 'a_Normal')) return -1;
	return n;
}

function initArrayBuffer(gl, data, num, type, attribute) {
	var buffer = gl.createBuffer();
	if (!buffer) {
		console.log('Failed to create buffer object in initArrayBuffer');
		return false;
	}
	// Write data into buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
	// Assign buffer to the attribute variable
	var a_attribute = gl.getAttribLocation(gl.program, attribute);
	if (a_attribute < 0) {
		console.log('Failed to get storage location of ' + attribute);
		return false;
	}
	gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
	// Enable assignment of buffer to the attribute var
	gl.enableVertexAttribArray(a_attribute);
	// console.log("Made buffer for " + attribute);
	return true;
}


function click(ev, gl, canvas, a_Position, g_points, cyl_points1, cyl_points2, color, pt_color) {
	if (stopClick == false) {
		var x = ev.clientX; // x coordinate of mouse click
		var y = ev.clientY; // y coordinate of mouse click

		// Covert coordinates to canvas location
		var rect = ev.target.getBoundingClientRect();
		x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
		y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

		// Store the coordinates to g_points array and colors to pt_color array
		g_points.push(x); g_points.push(y);		
		pt_color.push(0.0); pt_color.push(20.0); pt_color.push(0.0); pt_color.push(1.0);
		var len = g_points.length;

		drawPointsLines(gl, g_points, pt_color);

		// Print clicks to console
		if (ev.button == 0) {
			// console.log('x:' + g_points[len - 2] + ' y:' + g_points[len - 1] + ' left click');
		}
		else if (ev.button == 2) {
			// console.log('x:' + g_points[len - 2] + ' y:' + g_points[len - 1] + ' right click');
			stopDrawing(g_points);  // On a right click, prevent further user input
			makeCylinders(g_points, cyl_points1, cyl_points2, gl);
			drawCylinders(g_points, cyl_points1, cyl_points2, gl, color); // Draw surrounding cylinders
		}
	}
}

function makeCylinders(g_points, cyl_points1, cyl_points2, gl) {
	// console.log("make cylinders");
	var len = g_points.length;
	for (var i = 0; i < len - 2; i += 2) {
		cylinderCircleOne(g_points, i, cyl_points1, cyl_points2);
	}
	cylinderCircleTwo(g_points, cyl_points1, cyl_points2);
	return;
}

function shiftLight(u_LightPosition, g_points, cyl_points1, cyl_points2, gl, color) {
	light_point[0] -= 0.10;
	gl.uniform3f(u_LightPosition, light_point[0], light_point[1], light_point[2]);
	drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
	return;
}

function changeLightColor(g_points, cyl_points1, cyl_points2, gl, color) {
	light_color = [1.0, 1.3, 1.0];
	drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
	return;
}

function turnOffLight(g_points, cyl_points1, cyl_points2, gl, color) {
	light_color2 = [0.0, 0.0, 0.0];
	drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
	return;
}

function shiftCylinder(gl, g_points, cyl_points1, cyl_points2, color) {
	var right = 0.07;
	var glen = g_points.length;
	var cyl_len = cyl_points1.length;
	for (var i = 0; i < glen; i += 2) {
		g_points[i] = g_points[i] + right;
	}
	for (var j = 0; j < cyl_len; j++) {
		cyl_points1[j][0] += right;
		cyl_points2[j][0] += right;
	}
	drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
	return;
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

function drawCylinders(g_points, cyl_points1, cyl_points2, gl, color) {
	// console.log("called draw cyls");
	normals = [];
	normal_start = [];
	var t_color = [1.0, 0.0, 0.0, 1.0];  // color of cylinder: red
	var len = g_points.length;
	var clen = cyl_points1.length;
	var clen2 = cyl_points2.length;
	var num_cyls = cyl_points2.length / 12;
	
	for (var d = 0; d < num_cyls; d++) {
		var tempArr = [];
		var tempArr2 = [];
		var cyl_color = [];
		var trueNormals = [];
		for (var ntemp = 0; ntemp < 12; ntemp++) {
			tempArr[ntemp] = cyl_points1[ntemp + d*12];
			tempArr2[ntemp] = cyl_points2[ntemp + d*12];
		}
		var cylinder = [];	
		// draw rectangles (add the points so that the array is flattened)
		for (var j = 11; j > 0; j--) {
			// console.log("rects");
			// triangle 1
			// Find the normal for the triangle
			var norm = surface_normal(tempArr[j], tempArr2[j], tempArr[j - 1]);
			var surf_norm = norm;
			var trueNorm = normalize(norm[0], norm[1], norm[2], 1.0);
			trueNormals.push(trueNorm);
			norm = normalize(norm[0], norm[1], norm[2], 0.07);
			var midpoint = [(tempArr2[j - 1][0] + tempArr[j][0]) / 2,
							(tempArr2[j - 1][1] + tempArr[j][1]) / 2,
							(tempArr2[j - 1][2] + tempArr[j][2]) / 2];
			norm = [norm[0] + midpoint[0], norm[1] + midpoint[1], norm[2] + midpoint[2]];
			normals.push(norm);
			normal_start.push(midpoint);
			// console.log("Norm" + j + ": " + normals[normals.length - 1] + " Start: " + normal_start[normal_start.length - 1]);
			
			cylinder.push(tempArr[j][0]); // Point 1
			cylinder.push(tempArr[j][1]);
			cylinder.push(tempArr[j][2]);
			// console.log("Point1: " + j + ": " + tempArr[j]);
			
			cyl_color.push(t_color[0]);
			cyl_color.push(t_color[1]);
			cyl_color.push(t_color[2]);
			cyl_color.push(t_color[3]);

			cylinder.push(tempArr2[j][0]); // Point 2
			cylinder.push(tempArr2[j][1]);
			cylinder.push(tempArr2[j][2]);
			// console.log("Point2: " + j + ": " + tempArr2[j]);

			cyl_color.push(t_color[0]);
			cyl_color.push(t_color[1]);
			cyl_color.push(t_color[2]);
			cyl_color.push(t_color[3]);

			cylinder.push(tempArr[j - 1][0]); // Point 3
			cylinder.push(tempArr[j - 1][1]);
			cylinder.push(tempArr[j - 1][2]);
			// console.log("Point3: " + j + ": " + tempArr[j - 1]);
		
			cyl_color.push(t_color[0]);
			cyl_color.push(t_color[1]);
			cyl_color.push(t_color[2]);
			cyl_color.push(t_color[3]);

			// triangle 2 ----------------------
			// Normal for this triangle is same as triangle 1			
			normals.push(norm);
			trueNormals.push(trueNorm);
			normal_start.push(midpoint);
			// console.log("Norm: " + normals[normals.length - 1] + " Start: " + normal_start[normal_start.length - 1]);

			cylinder.push(tempArr[j - 1][0]);
			cylinder.push(tempArr[j - 1][1]);
			cylinder.push(tempArr[j - 1][2]);
			// console.log("Point4: " + j + ": " + tempArr[j]);

			cyl_color.push(t_color[0]);
			cyl_color.push(t_color[1]);
			cyl_color.push(t_color[2]);
			cyl_color.push(t_color[3]);

			cylinder.push(tempArr2[j][0]);
			cylinder.push(tempArr2[j][1]);
			cylinder.push(tempArr2[j][2]);
			// console.log("Point5: " + j + ": " + tempArr2[j]);

			cyl_color.push(t_color[0]);
			cyl_color.push(t_color[1]);
			cyl_color.push(t_color[2]);
			cyl_color.push(t_color[3]);

			cylinder.push(tempArr2[j - 1][0]);
			cylinder.push(tempArr2[j - 1][1]);
			cylinder.push(tempArr2[j - 1][2]);
			// console.log("Point6: " + j + ": " + tempArr2[j-1]);

			cyl_color.push(t_color[0]);
			cyl_color.push(t_color[1]);
			cyl_color.push(t_color[2]);
			cyl_color.push(t_color[3]);		
		}
		// For last triangles in cylinder --------------------------
		// console.log("last rect");
		// triangle 1
		// Find the normal for the triangle
		norm = surface_normal(tempArr[j], tempArr2[j], tempArr[11]);
		surf_norm = norm;
		trueNorm = normalize(norm[0], norm[1], norm[2], 1.0);
		trueNormals.push(trueNorm);
		norm = normalize(norm[0], norm[1], norm[2], 0.07);
		midpoint = [(tempArr2[11][0] + tempArr[j][0]) / 2,
					(tempArr2[11][1] + tempArr[j][1]) / 2,
					(tempArr2[11][2] + tempArr[j][2]) / 2];
		norm = [norm[0] + midpoint[0], norm[1] + midpoint[1], norm[2] + midpoint[2]];
		normals.push(norm);
		normal_start.push(midpoint);
		// console.log("Norm: " + normals[normals.length - 1] + " Start: " + normal_start[normal_start.length - 1]);

		cylinder.push(tempArr[j][0]); // Point 1
		cylinder.push(tempArr[j][1]);
		cylinder.push(tempArr[j][2]);
		// console.log("Point1: " + j + ": " + tempArr[j]);

		cyl_color.push(t_color[0]);
		cyl_color.push(t_color[1]);
		cyl_color.push(t_color[2]);
		cyl_color.push(t_color[3]);

		cylinder.push(tempArr2[j][0]); // Point 2
		cylinder.push(tempArr2[j][1]);
		cylinder.push(tempArr2[j][2]);
		// console.log("Point2: " + j + ": " + tempArr2[0]);

		cyl_color.push(t_color[0]);
		cyl_color.push(t_color[1]);
		cyl_color.push(t_color[2]);
		cyl_color.push(t_color[3]);

		cylinder.push(tempArr[11][0]); // Point 3
		cylinder.push(tempArr[11][1]);
		cylinder.push(tempArr[11][2]);
		// console.log("Point3: " + j + ": " + tempArr2[j]);
		
		cyl_color.push(t_color[0]);
		cyl_color.push(t_color[1]);
		cyl_color.push(t_color[2]);
		cyl_color.push(t_color[3]);

		// triangle 2 ----------------------			
		normal_start.push(midpoint);  // Normal is the same as before for this triangle
		normals.push(norm);	
		trueNormals.push(trueNorm);
		cylinder.push(tempArr[11][0]);
		cylinder.push(tempArr[11][1]);
		cylinder.push(tempArr[11][2]);
		// console.log("Point4: " + j + ": " + tempArr[11]);

		cyl_color.push(t_color[0]);
		cyl_color.push(t_color[1]);
		cyl_color.push(t_color[2]);
		cyl_color.push(t_color[3]);

		cylinder.push(tempArr2[j][0]);
		cylinder.push(tempArr2[j][1]);
		cylinder.push(tempArr2[j][2]);
		// console.log("Point5: " + j + ": " + tempArr2[j]);

		cyl_color.push(t_color[0]);
		cyl_color.push(t_color[1]);
		cyl_color.push(t_color[2]);
		cyl_color.push(t_color[3]);

		cylinder.push(tempArr2[11][0]);
		cylinder.push(tempArr2[11][1]);
		cylinder.push(tempArr2[11][2]);
		// console.log("Point6: " + j + ": " + tempArr2[11]);

		cyl_color.push(t_color[0]);
		cyl_color.push(t_color[1]);
		cyl_color.push(t_color[2]);
		cyl_color.push(t_color[3]);
		// End last triangle code -----------------------------
	
		var total_length = cylinder.length;
		// console.log("cylinder length: " + total_length/3);
		var num = initVertexBuffers(gl, total_length, cylinder, 3, cyl_color, vertexNormals(trueNormals));
		if (num < 0) {
			console.log('Failed to set positions of cylinder vertices');
			return;
		}
		// var float_norms =  new Float32Array(vertexNormals(trueNormals));
		// if (!initArrayBuffer(gl, float_norms, 3, gl.FLOAT, 'a_Normal')) return -1;
		gl.drawArrays(gl.TRIANGLES, 0, total_length/3);
	}
	if (drawNorms == true) {
		drawNormals(gl);
	}
}

function vertexNormals(trueNormals) {
	var vNormals = []; 
	var tempNorm = [];
	var len = trueNormals.length;
	// console.log("True Norms: " + len);
	var vert1 = [];
	vert1[0] = (trueNormals[0][0] + trueNormals[23][0]) / 2;  // First triangle
	vert1[1] = (trueNormals[0][1] + trueNormals[23][1]) / 2;
	vert1[2] = (trueNormals[0][2] + trueNormals[23][2]) / 2;
	vert1 = normalize(vert1[0], vert1[1], vert1[2], 1);
	tempNorm.push(vert1);
	for (var i = 1; i < len; i += 2) {
		var vert = [];
		if (i == 23) {
			vert[0] = (trueNormals[0][0] + trueNormals[23][0]) / 2;  // Last triangle
			vert[1] = (trueNormals[0][1] + trueNormals[23][1]) / 2;
			vert[2] = (trueNormals[0][2] + trueNormals[23][2]) / 2;
		}
		else {
			vert[0] = (trueNormals[i][0] + trueNormals[i + 1][0]) / 2;
			vert[1] = (trueNormals[i][1] + trueNormals[i + 1][1]) / 2;
			vert[2] = (trueNormals[i][2] + trueNormals[i + 1][2]) / 2;
		}
		vert = normalize(vert[0], vert[1], vert[2], 1);
		tempNorm.push(vert);
	}
	// console.log("tempNorm: " + tempNorm.length);
	for (var j = 0; j < tempNorm.length - 1; j++) {
		// Normals for 1 triangle
		vNormals.push(tempNorm[j][0]);  // Point 1: T1
		vNormals.push(tempNorm[j][1]);
		vNormals.push(tempNorm[j][2]);
		vNormals.push(tempNorm[j][0]);  // Point 2: T1
		vNormals.push(tempNorm[j][1]);
		vNormals.push(tempNorm[j][2]);
		vNormals.push(tempNorm[j + 1][0]);  // Point 3: T1
		vNormals.push(tempNorm[j + 1][1]);
		vNormals.push(tempNorm[j + 1][2]);
		vNormals.push(tempNorm[j + 1][0]);  // Point 1: T2
		vNormals.push(tempNorm[j + 1][1]);
		vNormals.push(tempNorm[j + 1][2]);
		vNormals.push(tempNorm[j][0]);  // Point 2: T2
		vNormals.push(tempNorm[j][1]);
		vNormals.push(tempNorm[j][2]);
		vNormals.push(tempNorm[j + 1][0]);  // Point 3: T2
		vNormals.push(tempNorm[j + 1][1]);
		vNormals.push(tempNorm[j + 1][2]);
	}
	// console.log("V len: " + vNormals.length/3);
	return vNormals;
}


// Find the points to make the start circle for the cylinders
// Index: which point in g_points to start cylinder at
function cylinderCircleOne(g_points, index, cyl_points1, cyl_points2) {
	// console.log("called cyls circle one");
	var point1x = g_points[index];
	var point1y = g_points[index + 1];
	var point2x = g_points[index + 2];
	var point2y = g_points[index + 3];
	var pt1 = [point1x, point1y, 0];
	var pt2 = [point2x, point2y, 0];
	
	// Find the line perpendicular to the clicked line
	var perpX = point2x - point1x;
	var perpY = point2y - point1y;

	// Find point to rotate
	var temp = perpX;
	perpX = -1 * perpY;
	perpY = temp;

	var scaled = normalize(perpX, perpY, 0, radius);
	perpX = scaled[0] + point1x;
	perpY = scaled[1] + point1y;
	var pts = [perpX, perpY, 0];  // first point
	// cyl_points1[cyl_points1.length] = pts; // Add first point as array to cyl_points1
	cyl_points1.push(pts);
	// console.log("first: " + pts[0] + " " + pts[1]);

	// Find the other 11 points of the end circle
	var clen;
	for (var i = 0; i < 11; i++) {
		clen = cyl_points1.length;
		// console.log("clen " + clen);
		// console.log("rotated c: " + cyl_points1[clen - 1][0] + ", " + cyl_points1[clen - 1][1] + ", " + cyl_points1[clen - 1][2]);
		var rotate_pt = rotatePoint(pt1, pt2, cyl_points1[clen-1]);
		cyl_points1.push(rotate_pt);
	}
	// clen = cyl_points1.length;
	// for (var blah = 0; blah < clen; blah++) {
	// 	console.log("cyl1 x: " + cyl_points1[blah][0] + " y: " + cyl_points1[blah][1] + " z: " + cyl_points1[blah][2]);
	// }
	return;
}

// Find the points to make the end circle for the cylinders
function cylinderCircleTwo(g_points, cyl_points1, cyl_points2) {
	// console.log("called cyls circle two");
	var len1 = cyl_points1.length;
	var glen = g_points.length;

	var point1x;
	var point1y;
	var point2x;
	var point2y;
	var lineX;
	var lineY;

	for (var i = 0; i < glen - 2; i += 2) {
		// Find length of central line of cylinder
		point1x = g_points[i];
		point1y = g_points[i + 1];
		point2x = g_points[i + 2];
		point2y = g_points[i + 3];
		lineX = point2x - point1x;
		lineY = point2y - point1y;
		// console.log("lineX" + lineX);
		// console.log("lineY" + lineY);

		var cyl = i / 2;
		// Find points at other end of cylinder by adding lineX and lineY
		for (var j = 0; j < 12; j++) {
			var temp = [];
			temp[0] = cyl_points1[(cyl * 12) + j][0] + lineX;
			// console.log("temp[0]" + temp[0]);
			temp[1] = cyl_points1[(cyl * 12) + j][1] + lineY;
			temp[2] = cyl_points1[(cyl * 12) + j][2];
			cyl_points2.push(temp);
		}
	}
	// var clen = cyl_points1.length;
	// for (var blah = 0; blah < clen; blah++) {
	// 	console.log("cy1 x: " + cyl_points1[blah][0] + " y: " + cyl_points1[blah][1] + " z: " + cyl_points1[blah][2]);
	// }
	return;
}

// Change number of sides in cylinder
function numberSides(ev, gl, pointSlider, g_points, cyl_points1, cyl_points2, color, pt_color) {
	// Get chosen size
	var numChoice = pointSlider.value; 
	// Assign to u_PointSize
	sides = numChoice;
	// Print point size to page
	ptsize.innerHTML = 'Current number of sides: ' + numChoice;
	drawPointsLines(gl, g_points, pt_color);
	// Re-calculate the cylinder points with new number of sides
	cyl_points1 = [];
	cyl_points2 = [];
	makeCylinders(g_points, cyl_points1, cyl_points2, gl);
	drawCylinders(g_points, cyl_points1, cyl_points2, gl, color, normals, normal_start);
}


// Change cylinder radius size with slider
function changeRadiusSize(ev, gl, radiusSlider, radiusSize, g_points, cyl_points1, cyl_points2, color, pt_color) {
	// Get chosen size
	var sizeChoice = radiusSlider.value; 
	var dec = "0.";
	var sSize = sizeChoice.toString();
	if (sizeChoice > 9) {
		sizeChoice = dec.concat(sSize);
	}
	else {
		dec = "0.0";
		sizeChoice = dec.concat(sSize);
	}
	sizeChoice = parseFloat(sizeChoice);
	// Assign to radius
	radius = sizeChoice;
	// Print point size to page
	radiusSize.innerHTML = 'Current radius: ' + sizeChoice;
	drawPointsLines(gl, g_points, pt_color);
	// Re-calculate the cylinder points with new cylinder radius
	cyl_points1 = [];
	cyl_points2 = [];
	makeCylinders(g_points, cyl_points1, cyl_points2, gl);
	drawCylinders(g_points, cyl_points1, cyl_points2, gl, color);
}

    
function rotatePoint(mid_line1, mid_line2, rot_pt) {
	// Based on code from https://sites.google.com/site/glennmurray/Home/rotation-matrices-and-formulas
	var angle = (2 * Math.PI) / sides;  // angle between sides & angle of rotation
	// console.log("angle " + angle);
	var vec = [mid_line2[0] - mid_line1[0], mid_line2[1] - mid_line1[1], 0];
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


// Draw the rubber band line that follows the mouse cursor
function rubberbandLine(ev, gl, canvas, g_points, pt_color) { //a_Position,
	// only make the rubber band line if a point has been clicked and a right click has not occurred
	if (g_points.length > 0 && stopClick == false) {
		// do math to put points onto canvas
		var rect = ev.target.getBoundingClientRect();
		var x = ev.clientX;
		var y = ev.clientY;
		x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
		y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
		
		var gLen = g_points.length;

		// new array with last point clicked and mouse location
		var rubberband = [];
		rubberband[0] = g_points[gLen - 2];
		rubberband[1] = g_points[gLen - 1];
		rubberband[2] = x;
		rubberband[3] = y;

		var len = rubberband.length;

		drawPointsLines(gl, g_points, pt_color); // Re-draw points and lines

		var norms = [];
		for (var l = 0; l < 2; l++) {
			norms.push(0.0); norms.push(0.0); norms.push(0.0);
		}
		// Initialize array and buffers for rubberband line
		var num = initVertexBuffers(gl, len, rubberband, 2, pt_color, norms);
		if (num < 0) {
			console.log('Failed to set positions of vertices');
			return;
		}
		gl.drawArrays(gl.LINE_STRIP, 0, 2); //draw rubberband line	
	}
}

// On right click, stop user input and print clicked points
function stopDrawing(g_points) {
	stopClick = true;
	console.log('You have finished drawing');
	printPoints(g_points);
}

// On right click, print the points clicked with coordinates
function printPoints(g_points) {
	var len = g_points.length;
	var string = "Your Polyline:";
	var parenL = "(";
	var parenR = ") ";
	var comma = ",";
	// Interate through points array and get point coordinates
	for (var i = 0; i < len; i += 2) {
		var x = g_points[i];
		x = x.toString();
		var y = g_points[i+1];
		y = y.toString();
		// Add all elements to string
		string = string.concat(parenL);
		string = string.concat(x);
		string = string.concat(comma);
		string = string.concat(y);
		string = string.concat(parenR);
	}
	console.log(string);
}

function drawPointsLines(gl, g_points, pt_color) {
	// console.log("Starting drawPointsLines");
	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);
	// Initialize array and buffers for clicked points and vertices
	var gLen = g_points.length;
	var norms = [];
	for (var l = 0; l < gLen; l++) {
		norms.push(0.0); norms.push(0.0); norms.push(0.0);
	}
	num = initVertexBuffers(gl, gLen, g_points, 2, pt_color, norms);
	if (num < 0) {
		console.log('Failed to set positions of vertices');
		return;
	}		
	// draw clicked points and vertices
	// console.log("gLen/2 = " + gLen/2);
	// gl.drawArrays(gl.POINTS, 0, gLen/2);
	gl.drawArrays(gl.LINE_STRIP, 0, gLen/2);
	// console.log("Finished drawPointsLines");
}

// Change polyline color by clicking button
function changeLineColor(ev, gl, colorBtn, u_FragColor, g_points, cyl_points1, cyl_points2, color, pt_color) {
	// Get chosen color
	var colorChoice = colorBtn.value; 
	var red = [2.0, 0.0, 0.0, 1.0];
	var blue = [0.0, 0.0, 2.5, 1.0];
	var purple = [0.5, 0.0, 0.5, 1.0];
	var green = [0.0, 2.0, 0.0, 1.0];

	// Change shader based on which color user chose
	if (colorChoice == 'red') {
    	gl.uniform4f(u_FragColor, red[0], red[1], red[2], red[3]);
	}
	else if (colorChoice == 'blue') {
		gl.uniform4f(u_FragColor, blue[0], blue[1], blue[2], blue[3]);
	}
	else if (colorChoice == 'purple') {
		gl.uniform4f(u_FragColor, purple[0], purple[1], purple[2], purple[3]);
	}
	else if (colorChoice == 'green') {
		gl.uniform4f(u_FragColor, green[0], green[1], green[2], green[3]);
	}
	drawPointsLines(gl, g_points, pt_color);
	drawCylinders(g_points, cyl_points1, cyl_points2, gl, color); // Draw surrounding cylinders (w/o re-calculating)
}


// Move clicked points (and lines) in inputted direction
function shiftPoints(ev, gl, g_points, button, pt_color) {
	var direction = button.value;
	var leftDown = -0.050;
	var rightUp = 0.050;
	var len = g_points.length;

	if (direction == 1) {  //left
		for (var i = 0; i < len; i += 2) {
			g_points[i] = g_points[i] + leftDown;
		}
	}
	else if (direction == 2) {  //right
		for (var i = 0; i < len; i += 2) {
			g_points[i] = g_points[i] + rightUp;
		}
	}
	else if (direction == 3) {  //up
		for (var i = 1; i < len; i += 2) {
			g_points[i] = g_points[i] + rightUp;
		}
	}
	else if (direction == 4) {  //down
		for (var i = 1; i < len; i += 2) {
			g_points[i] = g_points[i] + leftDown;
		}
	}
	else {
		direction = 0;
	}
	drawPointsLines(gl, g_points, pt_color);
}