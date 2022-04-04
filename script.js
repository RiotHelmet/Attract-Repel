var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var mousePos = {
  x: 0,
  y: 0,
};

ctx.lineWidth = "2";
var particles = [];
var showRadius = false;
var lines = [];
var grabList = [];

var xDiffList = [];
var yDiffList = [];
var size = 100;

class Particle {
  constructor(x, y, ia, oa, r, color) {
    this.pos = { x: x, y: y };
    this.r = r;
    this.ia = ia;
    this.oa = oa;
    this.mass = 50;
    this.color = `#${color}`;
    this.velocity = 0;
    particles.push(this);
  }
  show() {
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    if (showRadius === true) {
      ctx.beginPath();
      ctx.strokeStyle = "blue";
      ctx.arc(this.pos.x, this.pos.y, this.ia, 0, 2 * Math.PI);
      // ctx.fillStyle = "white";
      // ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
}
var circles = [];
class Circle {
  constructor(x, y, r) {
    this.pos = { x: x, y: y };
    this.r = r;
    circles.push(this);
  }
  show() {
    if (this.r > 0) {
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
      // ctx.fillStyle = "white";
      // ctx.fill();
      ctx.stroke();
    }
  }
}

class Line {
  constructor(x1, y1, x2, y2) {
    this.a = { x: x1, y: y1 };
    this.b = { x: x2, y: y2 };
    lines.push(this);
    this.color = randomColor()
  }
  show() {
    ctx.lineWidth = "1";
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);
    ctx.stroke();
  }
}

function randomColor() {
  return Math.floor(Math.random() * 16777215).toString(16);
}

function draw() {
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.stroke();
  for (var i = 0; i < particles.length; i++) {
    particles[i].show();
  }
  for (var i = 0; i < lines.length; i++) {
    lines[i].show();
  }
  for (var i = 0; i < circles.length; i++) {
    circles[i].show();
  }
}

function Dir(origin, other) {
  x = other.x;
  y = other.y;
  x1 = origin.x;
  y1 = origin.y;
  if (y > origin.y) {
    return Math.acos((x - origin.x) / getDist(origin, other));
  } else if (other.y <= origin.y) {
    return 2 * Math.PI - Math.acos((x - origin.x) / getDist(origin, other));
  }
}

function getDist(a, b) {
  x1 = a.x;
  y1 = a.y;
  x2 = b.x;
  y2 = b.y;
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function attract(origin, other) {
  var g = 0.005;
  var force = g * ((origin.mass * other.mass) / getDist(origin.pos, other.pos));
  return force;
}
function diff(a, b) {
  return Math.abs(a - b);
}

function repel(origin, other) {
  var g = 0.7;
  var force =
    g * ((origin.mass * other.mass) / getDist(origin.pos, other.pos) ** 2);
  return -force;
}

function forceMove(origin, force, dir) {
  origin.pos.x += force * Math.cos(dir);
  origin.pos.y += force * Math.sin(dir);
}

function particleForce(origin, other) {
  if (getDist(origin.pos, other.pos) < other.r) {
    forceMove(origin, repel(origin, other), Dir(origin.pos, other.pos));
  } else if (getDist(origin.pos, other.pos) < other.ia) {
    forceMove(origin, attract(origin, other), Dir(origin.pos, other.pos));
  } else if (getDist(origin.pos, other.pos) < other.oa) {
    forceMove(origin, attract(origin, other), Dir(origin.pos, other.pos));
  }
}
addCircle = new Circle(mousePos.x, mousePos.y, 5);
canvas.addEventListener("mousemove", function (e) {
  mousePos.x = e.offsetX;
  mousePos.y = e.offsetY;

  if (spaceSwitch === 1) {
    dragCircle.pos.x = mousePos.x;
    dragCircle.pos.y = mousePos.y;
  } else {
    addCircle.pos.y = mousePos.y;
    addCircle.pos.x = mousePos.x;
  }
});

canvas.addEventListener("click", function (e) {
  rayCircles = [];
  mousePos.x = e.offsetX;
  mousePos.y = e.offsetY;
  if (spaceSwitch === 0) {
    p = new Particle(mousePos.x, mousePos.y, 100, 100, 50, randomColor());
  }

  draw();
});

var mouseSwitch = 0;

canvas.addEventListener("mousedown", function (e) {
  mouseSwitch = 1;
  if (spaceSwitch === 1) {
    grabList = grab(size);
  }
});
canvas.addEventListener("mouseup", function (e) {
  mouseSwitch = 0;
  grabList = [];
  xDiffList = [];
  yDiffList = [];
  particle = null;
});

var spaceSwitch = 0;
var cSwitch = 1;

window.addEventListener("keydown", function (e) {
  if (e.key === "x") {
    if (spaceSwitch === 0) {
      circles = [];
      console.log("1");
      spaceSwitch = 1;
      dragCircle = new Circle(mousePos.x, mousePos.y, size);
    } else if (spaceSwitch === 1) {
      console.log("0");
      spaceSwitch = 0;
      circles = [];
      addCircle = new Circle(mousePos.x, mousePos.y, 5);
    }
  }
  if (e.key === "c") {
    if (cSwitch === 0) {
      cSwitch = 1;
      showRadius = false;
      draw();
    } else if (cSwitch === 1) {
      cSwitch = 0;
      showRadius = true;
      draw();
    }
  }
});

window.addEventListener("keydown", function (e) {});

window.addEventListener("wheel", function (e) {
  console.log(e.deltaY * 0.01);
  if (spaceSwitch === 1) {
    if (e.deltaY === -100) {
      size += 10;
      dragCircle.r = size;
      draw();
    } else if (e.deltaY === 100) {
      size -= 10;
      dragCircle.r = size;
      draw();
    }
  }
});

function getClosest(origin, pos) {
  minDist = Infinity;
  for (i = 0; i < particles.length; i++) {
    if (origin != particles[i]) {
      if (getDist(pos, particles[i].pos) < minDist) {
        minDist = getDist(pos, particles[i].pos);
        var index = i;
      }
    }
  }
  return index;
}

setInterval(() => {
  // particles.forEach((element) => {
  //   getVelocity(element);
  // });
  // particles[0].velocity = getVelocity(particles[0]);
  lines = [];
  particles.forEach((element) => {
    for (i = 0; i < particles.length; i++) {
      if (particles[i] != element) {
        particleForce(element, particles[i]);
      }
    }
  });
  if (grabList.length > 0) {
    for (i = 0; i < grabList.length; i++) {
      grabList[i].pos.x = mousePos.x - xDiffList[i];
      grabList[i].pos.y = mousePos.y - yDiffList[i];
    }
  }

  if (particles.length > 1) {
    particles.forEach((element) => {
      for (j = 0; j < particles.length; j++) {
        if (particles[j] != element) {
          var current = getDist(element.pos, particles[j].pos);
          var closest = getDist(
            element.pos,
            particles[getClosest(element, element.pos)].pos
          );
          if (current <= closest + closest / 3) {
            line = new Line(
              element.pos.x,
              element.pos.y,
              particles[j].pos.x,
              particles[j].pos.y
            );
          }
        }
      }
    });
  }

  draw();
}, 10);

function grab(size) {
  particles.forEach((element) => {
    if (getDist(element.pos, mousePos) < size) {
      grabList.push(element);
    }
  });

  if (grabList.length > 0) {
    grabList.forEach((element) => {
      particle = particles[particles.indexOf(element)];

      xDiff = mousePos.x - particle.pos.x;
      yDiff = mousePos.y - particle.pos.y;

      xDiffList.push(xDiff);
      yDiffList.push(yDiff);
    });
  }

  return grabList;
}

posList = [];