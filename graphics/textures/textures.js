
// Based on given starter code
v_shaders = {}
f_shaders = {}

var camera;
var scene;
var lastMouseX = 0;
var lastMouseY = 0;

// called when page is loaded
function main() {
    // retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    v_shaders["skybox"] = "";
    f_shaders["skybox"] = "";
    v_shaders["cube"] = "";
    f_shaders["cube"] = "";
    v_shaders["sphere"] = "";
    f_shaders["sphere"] = "";
    v_shaders["triang"] = "";
    f_shaders["triang"] = "";
    v_shaders["plane"] = "";
    f_shaders["plane"] = "";

	// load shader files (calls 'setShader' when done loading)
    loadFile("shaders/skybox_shader.vert", function(shader_src) {
        setShader(gl, canvas, "skybox", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/skybox_shader.frag", function(shader_src) {
        setShader(gl, canvas, "skybox", gl.FRAGMENT_SHADER, shader_src);
    });

    // load shader files (calls 'setShader' when done loading)
    loadFile("shaders/cube_shader.vert", function(shader_src) {
        setShader(gl, canvas, "cube", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/cube_shader.frag", function(shader_src) {
        setShader(gl, canvas, "cube", gl.FRAGMENT_SHADER, shader_src);
    });

    // load shader files (calls 'setShader' when done loading)
    loadFile("shaders/sphere_shader.vert", function(shader_src) {
        setShader(gl, canvas, "sphere", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/sphere_shader.frag", function(shader_src) {
        setShader(gl, canvas, "sphere", gl.FRAGMENT_SHADER, shader_src);
    });

    // load shader files (calls 'setShader' when done loading)
    loadFile("shaders/triang_shader.vert", function(shader_src) {
        setShader(gl, canvas, "triang", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/triang_shader.frag", function(shader_src) {
        setShader(gl, canvas, "triang", gl.FRAGMENT_SHADER, shader_src);
    });

    // load shader files (calls 'setShader' when done loading)
    loadFile("shaders/plane_shader.vert", function(shader_src) {
        setShader(gl, canvas, "plane", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/plane_shader.frag", function(shader_src) {
        setShader(gl, canvas, "plane", gl.FRAGMENT_SHADER, shader_src);
    });

    window.onkeydown = function(ev) {
        var key = ev.keyCode;
        //console.log(key);
        if (key == 38 || key == 40 || key == 37 || key == 39 || key == 188 || key == 190) {
            moveCamera(key);  // Move +/- Z
        }
    };

    var mouseDownPosX = 0;
    var mouseDownPosY = 0;
    var mouseDown = 0;
    canvas.onmousedown = function(ev) { 
        mouseDown = 1;
        mouseDownPosX = ev.clientX;
        mouseDownPosY = ev.clientY; 
        lastMouseX = mouseDownPosX;
        lastMouseY = mouseDownPosY;
    };
    canvas.onmousemove = function(ev) { 
        if (mouseDown == 1) {
            rotateCamera(ev, mouseDownPosX, mouseDownPosY);
        }
    };
    canvas.onmouseup = function() {
        mouseDown = 0;
    };
}

function rotateCamera(ev, mouseDownPosX, mouseDownPosY) {
    //var curCamPos = camera.position;
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
    if (pastMouseY >= mouseY) {
        diffY = pastMouseY - mouseY;
        diffY = diffY * -1;
    }
    else {
        diffY = mouseY - pastMouseY;
    }
    //console.log("diffX: " + diffX + ", diffY: " + diffY);
	if (diffX  != 0 && diffY != 0) {
        camera.rotate(3, -diffY, -diffX, 0);
        scene.draw();
    }
	return;
}

function moveCamera(key) {
    if (key == 38) { // up arrow: z neg
        camera.move(-0.1, 0, 0, 1);
    }
    else if (key == 40) {  // down arrow: z pos
        camera.move(0.1, 0, 0, 1);
    }
    else if (key == 37) {  // left arrow: x neg
        camera.move(-0.1, 1, 0, 0);
    }
    else if (key == 39) {  // right arrow: x pos
        camera.move(0.1, 1, 0, 0);
    }
    else if (key == 188) {  // ,/< key: y neg
        camera.move(-0.1, 0, 1, 0);
    }
    else if (key == 190) {  // ./> key: y pos
        camera.move(0.1, 0, 1, 0);
    }
    scene.draw();
    return;
}

// set appropriate shader and start if both are loaded
function setShader(gl, canvas, name, shader, shader_src) {
    if (shader == gl.VERTEX_SHADER)
       v_shaders[name] = shader_src;

    if (shader == gl.FRAGMENT_SHADER)
	   f_shaders[name] = shader_src;

    vShadersLoaded = 0;
    for (var shader in v_shaders) {
       if (v_shaders.hasOwnProperty(shader) && v_shaders[shader] != "") {
           vShadersLoaded += 1;
       }
    }

    fShadersLoaded = 0;
    for (var shader in f_shaders) {
        if (f_shaders.hasOwnProperty(shader) && f_shaders[shader] != "") {
            fShadersLoaded += 1;
        }
    }

    if(vShadersLoaded == Object.keys(v_shaders).length &&
       fShadersLoaded == Object.keys(f_shaders).length) {
        start(gl, canvas);
    }
}

function start(gl, canvas) {

    // Create camera
    camera = new PerspectiveCamera(60, 1, 1, 100);
    camera.move(10,0,0,1);
    camera.move(2,1,0,0);
    camera.rotate(10,0,1,0);

    // Create scene
    scene = new Scene(gl, camera);

    // Create skybox
    var skybox = new CubeGeometry(20);
    skybox.setVertexShader(v_shaders["skybox"]);
    skybox.setFragmentShader(f_shaders["skybox"]);
    skybox.setPosition(new Vector3([0.0,0.0,0.0]));
    scene.addGeometry(skybox);

    // Create a cube
    var cube = new CubeGeometry(1);
    cube.setVertexShader(v_shaders["cube"]);
    cube.setFragmentShader(f_shaders["cube"]);
    cube.setRotation(new Vector3([1,45,45]));
    cube.setPosition(new Vector3([3,0.0,0.0]));
    cube.setScale(new Vector3([0.75,0.75,0.75]));
    scene.addGeometry(cube);

    var triang = new Geometry();
    triang.vertices = [-1, -1, 0.0, 0.0, 1.0, 0.0, 1.0, -1, 0.0];
    triang.indices = [0, 1, 2];
    var uvs = [0.0, 0.0, 0.0, 0.5, 1.0, 0.0, 1.0, 0.0, 0.0];
    triang.addAttribute("a_uv", uvs);

    triang.setVertexShader(v_shaders["triang"]);
    triang.setFragmentShader(f_shaders["triang"]);
    //scene.addGeometry(triang);

    // Create a plane
    var plane = new Geometry();
    plane.vertices = [-1, -1, 0.0, -1, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, -1.0, 0.0];
    plane.indices = [0, 2, 1, 0, 3, 2];
    var uvsPlane = [0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 2.0, 1.0, 0.0, 2.0, 0.0, 0.0];
    plane.addAttribute("a_uv", uvsPlane);
    plane.setPosition(new Vector3([-3,0.0,0.0]));

    plane.setVertexShader(v_shaders["plane"]);
    plane.setFragmentShader(f_shaders["plane"]);
    scene.addGeometry(plane);

    // Create a Sphere
    var sphere = new SphereGeometry(1, 32, 20);
    sphere.v_shader = v_shaders["sphere"];
    sphere.f_shader = f_shaders["sphere"];
    sphere.setPosition(new Vector3([0.0,0.0,0.0]));
    sphere.addUniform("u_EyePosition", "vec3", camera.position);
    scene.addGeometry(sphere);

    scene.draw();

    var texSky = new Texture3D(gl, [
        'img/beach/negx.jpg',
        'img/beach/posx.jpg',
        'img/beach/negy.jpg',
        'img/beach/posy.jpg',
        'img/beach/negz.jpg',
        'img/beach/posz.jpg'
    ], function(texSky) {
        skybox.addUniform("u_cubeTex", "t3", texSky);
        scene.draw();
    });

    var texPlane = new Texture2D(gl, 'img/beach/sunset.jpg', function(tex) {
        //console.log(tex);
        plane.addUniform("u_tex", "t2", tex);
        scene.draw();
    });

    var tex = new Texture3D(gl, [        
        'img/beach/sunset.jpg',
        'img/beach/sunset.jpg',
        'img/beach/sunset.jpg',
        'img/beach/sunset.jpg',
        'img/beach/sunset.jpg',
        'img/beach/sunset.jpg'
    ], function(tex) {
        cube.addUniform("u_cubeTex", "t3", tex);
        //console.log(tex);
        scene.draw();
    });

    var texReflectSphere = new Texture3D(gl, [
        'img/beach/negx.jpg',
        'img/beach/posx.jpg',
        'img/beach/negy.jpg',
        'img/beach/posy.jpg',
        'img/beach/negz.jpg',
        'img/beach/posz.jpg'
    ], function(texReflectSphere) {
        sphere.addUniform("u_sphereTex", "t3", texReflectSphere);
        //console.log(texReflectSphere);
        scene.draw();
    });

}
