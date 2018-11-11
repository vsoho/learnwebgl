function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function setTexture(gl, image) {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0
  ]), gl.STATIC_DRAW);

  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
}

function setGeometry(gl) {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 0,
    256, 0,
    0, 256,
    0, 256,
    256, 0,
    256, 256
  ]), gl.STATIC_DRAW);
}

function setColors(gl) {
  var r1 = Math.random();
  var g1 = Math.random();
  var b1 = Math.random();

  var r2 = Math.random();
  var g2 = Math.random();
  var b2 = Math.random();

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(
    [ r1, g1, b1, 1,
      r1, g1, b1, 1,
      r1, g1, b1, 1,
      r2, g2, b2, 1,
      r2, g2, b2, 1,
      r2, g2, b2, 1]),
    gl.STATIC_DRAW);
}

var canvas = document.getElementById("c");
var gl = canvas.getContext("webgl");
if (gl) {
  main();
  // var vertexShaderSource = document.getElementById("2d-vertex-shader").text;
  // var fragmentShaderSource = document.getElementById("2d-fragment-shader").text;
  // var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  // var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  // var program = createProgram(gl, vertexShader, fragmentShader);
  // var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  // var colorLocation = gl.getAttribLocation(program, "a_color");

  // var colorBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // setColors(gl);



  // var positionBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // // var positions = [
  // //   0, 0,
  // //   0, 0.5,
  // //   0.7, 0
  // // ];
  // // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  // setGeometry(gl);

  // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // gl.clearColor(0, 0, 0, 0);
  // gl.clear(gl.COLOR_BUFFER_BIT);
  // gl.useProgram(program);

  // gl.enableVertexAttribArray(positionAttributeLocation);
  // gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // gl.enableVertexAttribArray(colorLocation);
  // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

  // gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function main() {
  var image = new Image();
  image.src = "chess.png";
  image.onload = function() {
    render(image);
  }
}

function render(image) {

  var vertexShaderSource = document.getElementById("2d-vertex-shader").text;
  var fragmentShaderSource = document.getElementById("2d-fragment-shader").text;
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  var program = createProgram(gl, vertexShader, fragmentShader);
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var colorLocation = gl.getAttribLocation(program, "a_color");
  var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var texturesizeLocation = gl.getUniformLocation(program, "u_textureSize");

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeometry(gl);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl);
  gl.enableVertexAttribArray(colorLocation);
  //gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

  var texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  setTexture(gl, image);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(texcoordLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
  gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
  
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform2f(texturesizeLocation, image.width, image.height);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function drawScene() {
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
}