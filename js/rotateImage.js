/* Define globals */
// Web gl
var gl;
// Shaders
var shaderProgram;
// Shape Vertices
var arrayOfVertices;
var arrayOfTexCoords;
// Indices for triangle vertices
var indexList;
// Rotation values x, y, z
var theta;
var textureImage;
var image;

/* Initializes WebGL and globals */
function init() {

  // Init webgl and specify clipspace.
  var canvas = document.getElementById("gl-canvas");
  image = document.getElementById("rotateIt");
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {alert("Web gl is not available");}
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.enable(gl.DEPTH_TEST);

  theta = 0.0;

  // Assign shape vertices.
  arrayOfTexCoords = getTexCoords();
  arrayOfVertices = getVertices();
  indexList = getIndexList();

  // Initialize shaders and start shader program.
  shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(shaderProgram);


  textureImage = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureImage);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  var indexBuffer  = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indexList), gl.STATIC_DRAW);

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrayOfVertices), gl.STATIC_DRAW);

  var vertexPositionLocation = gl.getAttribLocation(shaderProgram, "vertexPosition");
  gl.vertexAttribPointer(vertexPositionLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPositionLocation);

  var texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrayOfTexCoords), gl.STATIC_DRAW);

  var texCoordLocation = gl.getAttribLocation(shaderProgram, "texCoord");
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texCoordLocation);

  render();
}

/* Draws buffer contents to the screen and calculates vertex transformations. */
function render() {
  // gl.activeTexture(gl.TEXTURE0);
  // gl.bindTexture(gl.TEXTURE_2D, textureImage);
  // gl.uniform1i(gl.getUniformLocation(shaderProgram, "texMap"), 0);
  textureImage = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureImage);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  var vertexCount = indexList.length;

  var matrixRotZ = [Math.cos(theta), -Math.sin(theta), 0, 0, Math.sin(theta), Math.cos(theta), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  var matrixRotY = [Math.cos(theta), 0, -Math.sin(theta), 0, 0, 1, 0, 0, Math.sin(theta), 0, Math.cos(theta), 0, 0, 0, 0, 1];
  var matrixRotX = [1, 0, 0, 0, 0, Math.cos(theta), -Math.sin(theta), 0, 0, Math.sin(theta), Math.cos(theta), 0, 0, 0, 0, 1];

  theta += 0.015;

  var matrixRotXLoc = gl.getUniformLocation(shaderProgram, "MRotX");
  gl.uniformMatrix4fv(matrixRotXLoc, false, matrixRotX);
  var matrixRotYLoc = gl.getUniformLocation(shaderProgram, "MRotY");
  gl.uniformMatrix4fv(matrixRotYLoc, false, matrixRotY);
  var matrixRotZLoc = gl.getUniformLocation(shaderProgram, "MRotZ");
  gl.uniformMatrix4fv(matrixRotZLoc, false, matrixRotZ);

  gl.drawElements( gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);
  requestAnimFrame(render);
}

/* Returns an array of vertices */
function getVertices() {
  var vertices = [
    -0.6, -0.6,  0.6,
     0.6, -0.6,  0.6,
     0.6,  0.6,  0.6,
    -0.6,  0.6,  0.6,

    // Back face
    -0.6, 0.6, -0.6,
     0.6,  0.6, -0.6,
     0.6,  -0.6, -0.6,
     -0.6, -0.6, -0.6,

    // Top face
     -0.6, 0.6, 0.6,
      0.6, 0.6, 0.6,
      0.6, 0.6, -0.6,
     -0.6, 0.6, -0.6,

    // Bottom face
    -0.6, -0.6, -0.6,
     0.6, -0.6, -0.6,
     0.6, -0.6,  0.6,
    -0.6, -0.6,  0.6,

    // Right face
     0.6, -0.6, -0.6,
     0.6,  0.6, -0.6,
     0.6,  0.6,  0.6,
     0.6, -0.6,  0.6,

    // left face
    -0.6, -0.6, -0.6,
    -0.6, -0.6,  0.6,
    -0.6,  0.6,  0.6,
    -0.6,  0.6, -0.6
  ];
  return vertices;
}

function getTexCoords() {
  var vertices = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0
  ];
  return vertices;
}

function getIndexList() {
  var indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left
  ];
  return indices;
}
