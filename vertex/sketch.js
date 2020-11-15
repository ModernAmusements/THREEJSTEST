let canvas;
let ctx;
let ratio;

const numShapes = 6;
let shps = [];

let loc;
let tloc;

let w, h; // substitute width and height

const msg = "Tod geworden der Zerstörer der Welten";
const str1 = "Meine Zigarette anzünde mit dem Glüher, dann schalte.";
const str2 = "Gehört die Minute, wenn ich eine Gesellschaft verlassen.";

let bgCol;
let boxCol;
let boxCols = [];
let txtCol;
let boxShaCol;
let txtShaCol;

let speed;
let totalFrames;

function setup() {
  ratio = 1 / 1.4142;
  const dim = calcDimensionFromRatio(ratio);
  // 1080 x 1920 = 540 x 960 = 390 x 640
  canvas = createCanvas(dim.x, dim.y);
  canvas.position(
    (windowWidth - canvas.width) / 2,
    (windowHeight - canvas.height) / 2
  );
  noSmooth();
  w = width;
  h = height;
  colorMode(HSB, 360, 100, 100, 100);

  ctx = canvas.drawingContext;

  for (let i = 0; i < numShapes; i++) {
    shps[i] = new Compound();
  }

  //	textFont('moderno - fb ');
  //	textFont('serif');
  textFont("Helvetica");
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
  noStroke();

  loc = createVector(w / 2, h / 2);
  tloc = loc.copy();
  vel = createVector();
  acc = createVector();

  bgCol = color(26, 89, 100);
  
  boxCol = color(26, 89, 100);
  
  boxCols[0] = color(26, 89, 100);
  boxCols[1] = color(29, 13, 100);
  boxCols[2] = color(32, 39, 100);
  boxCols[3] = color(23, 51, 100);
  boxCols[4] = color(25, 75, 100);
  boxCols[5] = color(26, 89, 100);

  txtCol = color(0, 0, 0);

  boxShaCol = color(0, 0, 0, 70);

  txtShaCol = color(0, 0, 0, 30);

  totalFrames = 30 * 12; // 12 seconds at 30fps

  /***************************************** device orientation test **********/
  createPermissionModal(); // hidden by default
  let permissionGranted = false;
  let nonios13device = false;
  let permissionModal;
  //	let rotationX = 0;
  //	let rotationY = 0; // for device orientation event

  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    DeviceOrientationEvent.requestPermission()
      .catch(() => {
        // show permission dialog only the first time
        permissionModal = document.querySelector(".permission-modal-container");
        permissionModal.style.display = "block";

        const cancelButton = document.querySelector("#button-cancel");
        cancelButton.addEventListener("click", function () {
          permissionModal.remove();
        });
        const allowButton = document.querySelector("#button-allow");
        allowButton.addEventListener("click", onAskButtonClicked);

        throw error; // keep the promise chain as rejected
      })
      .then(() => {
        // this runs on subsequent visits
        permissionGranted = true;
      });
  } else {
    // it's up to you how to handle non ios 13 devices
    nonios13device = true;
    console.log("non iOS 13 device is being used.");
  }

  // will handle first time visiting to grant access
  function onAskButtonClicked() {
    permissionModal.remove();
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          permissionGranted = true;
        } else {
          permissionGranted = false;
        }
      })
      .catch(console.error);
  }
}

function draw() {
	
  background(bgCol);

  noStroke();
  // DOTS
  fill(26, 89, 100);
  
  let rnum = 0;
  for (let j = 0; j < h; j += h / 20) {
    for (let i = 0; i < w; i += w / 10) {
      if (rnum % 2 == 0) ellipse(i, j, 20, 20);
      else ellipse(i + w / 20, j, 20, 20);
    }
    rnum++;
  }

  speed = (frameCount / totalFrames) * TWO_PI;

  if (mouseIsPressed) {
    tloc.x = mouseX;
    tloc.y = mouseY;
  } else {
    // for mobile
    tloc.x =
      w / 2 + constrain(map(rotationY, -30, 30, -w / 2, w / 2), -w / 2, w / 2);
    tloc.y =
      h / 2 + constrain(map(rotationX, -30, 30, -h / 2, h / 2), -h / 2, h / 2);
  }
  loc.x = lerp(loc.x, tloc.x, 0.1);
  loc.y = lerp(loc.y, tloc.y, 0.1);

  ctx.shadowColor = txtShaCol;
  ctx.shadowBlur = w * 0.02;
  ctx.shadowOffsetX = (w / 2 - loc.x) * 0.5;
  ctx.shadowOffsetY = (h / 2 - loc.y) * 0.5;
  push();
  translate(w / 2, h / 2);
  fill(txtCol);
  textCircle(h * 0.1, h * 0.1, w * 0.05);
  pop();

  const bw = w - w * 0.125; // first box width
  const bh = h - w * 0.125; // first box height

  for (let i = numShapes - 1; i >= 0; i--) {
	  
    const lx = lerp(w / 2, loc.x, i / numShapes);
	const ly = lerp(h / 2, loc.y, i / numShapes);
	
	let shp = shps[i];
	
    // Shapes Offset
    shp.setContourRect(lx, ly, bw - i * w * 0.13, bh - i * h * 0.13);

    ctx.shadowColor = boxShaCol;
    ctx.shadowBlur = w * 0.1;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
	fill(boxCol);
	// Gradient algo 
    // fill(90 + i * 20, i * 20, 100 - i * 6);
	fill(boxCols[i]);
    // if (i == 0) fill(txtCol);
    shp.display();

    ctx.shadowColor = txtShaCol;
    ctx.shadowBlur = w * 0.02;
    ctx.shadowOffsetX = (w / 2 - loc.x) * 0.35;
    ctx.shadowOffsetY = (h / 2 - loc.y) * 0.35;
    fill(txtCol);

    push();
	translate(w / 2, h / 2);
	
	fill(txtCol);
	// h = height, h = width, w = size;
    if (i == 1) {
      textCircle(h * 0.36, h * 0.36, w * 0.16); //.14
    } else if (i == 3) {
      textCircle(h * 0.2, h * 0.2, w * 0.1); // .1
    }
    pop();
  }

  ctx.shadowColor = "transparent";

  textSize(w * 0.033);
  textAlign(CENTER, TOP);
  fill(0, 0, 0);

  const toffx = w * 0.013;
  const toffy = w * 0.013;

  push();
  translate(w * 0.5, toffy);
  text(str1, 0, 0);
  pop();

  push();
  translate(w - toffx, h * 0.5);
  rotate(PI / 2);
  text(str2, 0, 0);
  pop();

  push();
  translate(w * 0.5, h - toffy);
  rotate(PI);
  text(str1, 0, 0);
  pop();

  push();
  translate(toffy, h * 0.5);
  rotate(-PI / 2);
  text(str2, 0, 0);
  pop();

  stroke(0, 0, 0);
  line(w * 0.15, h * 0.032, w - w * 0.15, h * 0.032); // t
  line(w * 0.952, h * 0.18, w * 0.952, h - h * 0.18); // r
  line(w * 0.15, h - h * 0.032, w - w * 0.15, h - h * 0.032); // b
  line(w - w * 0.952, h * 0.18, w - w * 0.952, h - h * 0.18); // l
}

function textCircle(wi, hi, tsz) {
  textAlign(CENTER, CENTER);
//   textStyle(ITALIC);
  for (let i = 0; i < msg.length; i++) {
    const x = 0.7 * cos((i * TWO_PI) / msg.length - speed) * wi;
    const y = 1.2 * sin((i * TWO_PI) / msg.length - speed) * hi;
    push();
    translate(x, y);
    const angle = atan2(y, x);
    rotate(PI / 2 + angle);
    textSize(tsz);
    text(msg[(i + floor(tsz)) % msg.length], 0, 0);
    pop();
  }
}

function calcDimensionFromRatio(ratio) {
  const curRatio = windowWidth / windowHeight;
  let sz = createVector();
  if (curRatio > ratio) {
    // wide
    sz.y = windowHeight;
    sz.x = sz.y * ratio;
  } else {
    // tall
    sz.x = windowWidth;
    sz.y = (sz.x * 1) / ratio;
  }
  return createVector(sz.x, sz.y);
}

function windowResized() {
  const dim = calcDimensionFromRatio(ratio);
  resizeCanvas(dim.x, dim.y);
  canvas.position(
    (windowWidth - canvas.width) / 2,
    (windowHeight - canvas.height) / 2
  );
  w = width;
  h = height;
}

class Compound {
  constructor() {
    this.ct = createVector(); // center
    this.ctrW = 0;
    this.ctrH = 0;
  }

  setContourRect(cx, cy, w, h) {
    this.ct.x = cx;
    this.ct.y = cy;
    this.ctrW = w;
    this.ctrH = h;
  }

  display() {
	// for contour corner points
	
    // const offx = this.ctrW * 0.1;
    // const offy = this.ctrW * 0.1;

    beginShape();
    vertex(0, 0);
    vertex(width, 0);
    vertex(width, height);
    vertex(0, height);

    beginContour();
    vertex(this.ct.x - this.ctrW / 2, this.ct.y);
    bezierVertex(
      this.ct.x - this.ctrW / 2,
      this.ct.y + this.ctrH / 2,
      this.ct.x - this.ctrW / 2,
      this.ct.y + this.ctrH / 2,
      this.ct.x - this.ctrW / 2,
      this.ct.y + this.ctrH / 2
    );
    bezierVertex(
      this.ct.x - this.ctrW / 2,
      this.ct.y + this.ctrH / 2,
      this.ct.x - this.ctrW / 2,
      this.ct.y + this.ctrH / 2,
      this.ct.x,
      this.ct.y + this.ctrH / 2
    );
    bezierVertex(
      this.ct.x + this.ctrW / 2,
      this.ct.y + this.ctrH / 2,
      this.ct.x + this.ctrW / 2,
      this.ct.y + this.ctrH / 2,
      this.ct.x + this.ctrW / 2,
      this.ct.y + this.ctrH / 2
    );
    bezierVertex(
      this.ct.x + this.ctrW / 2,
      this.ct.y + this.ctrH / 2,
      this.ct.x + this.ctrW / 2,
      this.ct.y + this.ctrH / 2,
      this.ct.x + this.ctrW / 2,
      this.ct.y
    );
    bezierVertex(
      this.ct.x + this.ctrW / 2,
      this.ct.y - this.ctrH / 2,
      this.ct.x + this.ctrW / 2,
      this.ct.y - this.ctrH / 2,
      this.ct.x + this.ctrW / 2,
      this.ct.y - this.ctrH / 2
    );
    bezierVertex(
      this.ct.x + this.ctrW / 2,
      this.ct.y - this.ctrH / 2,
      this.ct.x + this.ctrW / 2,
      this.ct.y - this.ctrH / 2,
      this.ct.x,
      this.ct.y - this.ctrH / 2
    );
    bezierVertex(
      this.ct.x - this.ctrW / 2,
      this.ct.y - this.ctrH / 2,
      this.ct.x - this.ctrW / 2,
      this.ct.y - this.ctrH / 2,
      this.ct.x - this.ctrW / 2,
      this.ct.y - this.ctrH / 2
    );
    bezierVertex(
      this.ct.x - this.ctrW / 2,
      this.ct.y - this.ctrH / 2,
      this.ct.x - this.ctrW / 2,
      this.ct.y - this.ctrH / 2,
      this.ct.x - this.ctrW / 2,
      this.ct.y
    );
    endContour();

    endShape();
  }
}
