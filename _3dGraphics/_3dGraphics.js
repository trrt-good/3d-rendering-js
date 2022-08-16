/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class _3dGraphics extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("costume1", "./_3dGraphics/costumes/costume1.png", {
        x: 1,
        y: 1
      })
    ];

    this.sounds = [new Sound("pop", "./_3dGraphics/sounds/pop.wav")];

    this.triggers = [
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked),
      new Trigger(Trigger.KEY_PRESSED, { key: "any" }, this.whenKeyAnyPressed),
      new Trigger(Trigger.KEY_PRESSED, { key: "h" }, this.whenKeyHPressed),
      new Trigger(
        Trigger.KEY_PRESSED,
        { key: "space" },
        this.whenKeySpacePressed
      )
    ];

    this.vars.currentTriangleIndex = 733;
    this.vars.triangletempX = 0;
    this.vars.i = -0.13357;
    this.vars.j = 0.42025;
    this.vars.k = 0.19057000000000002;
    this.vars.dotresult = 0.7461426113426557;
    this.vars.temp = 0.6215271299392131;
  }

  *fillResolution(ax, ay, bx, by, cx, cy, res) {
    this.stage.vars.lena = Math.sqrt(
      (bx - cx) * (bx - cx) + (by - cy) * (by - cy)
    );
    this.stage.vars.lenb = Math.sqrt(
      (ax - cx) * (ax - cx) + (ay - cy) * (ay - cy)
    );
    this.stage.vars.lenc = Math.sqrt(
      (ax - bx) * (ax - bx) + (ay - by) * (ay - by)
    );
    this.stage.vars.peri =
      1 / (this.stage.vars.lena + this.stage.vars.lenb + this.stage.vars.lenc);
    this.stage.vars.incx =
      (this.stage.vars.lena * ax +
        this.stage.vars.lenb * bx +
        this.stage.vars.lenc * cx) *
      this.stage.vars.peri;
    this.stage.vars.incy =
      (this.stage.vars.lena * ay +
        this.stage.vars.lenb * by +
        this.stage.vars.lenc * cy) *
      this.stage.vars.peri;
    this.stage.vars.ind = Math.sqrt(
      (this.stage.vars.lenb + this.stage.vars.lenc - this.stage.vars.lena) *
        (this.stage.vars.lenc + this.stage.vars.lena - this.stage.vars.lenb) *
        (this.stage.vars.lena + this.stage.vars.lenb - this.stage.vars.lenc) *
        this.stage.vars.peri
    );
    this.stage.vars.aox = this.stage.vars.incx - ax;
    this.stage.vars.aoy = this.stage.vars.incy - ay;
    this.stage.vars.box = this.stage.vars.incx - bx;
    this.stage.vars.boy = this.stage.vars.incy - by;
    this.stage.vars.cox = this.stage.vars.incx - cx;
    this.stage.vars.coy = this.stage.vars.incy - cy;
    if (
      this.stage.vars.lena < this.stage.vars.lenb &&
      this.stage.vars.lena < this.stage.vars.lenc
    ) {
      this.stage.vars.td = Math.sqrt(
        this.stage.vars.aox * this.stage.vars.aox +
          this.stage.vars.aoy * this.stage.vars.aoy
      );
    } else {
      if (
        this.stage.vars.lenb > this.stage.vars.lena ||
        this.stage.vars.lenb > this.stage.vars.lenc
      ) {
        this.stage.vars.td = Math.sqrt(
          this.stage.vars.cox * this.stage.vars.cox +
            this.stage.vars.coy * this.stage.vars.coy
        );
      } else {
        this.stage.vars.td = Math.sqrt(
          this.stage.vars.box * this.stage.vars.box +
            this.stage.vars.boy * this.stage.vars.boy
        );
      }
    }
    this.stage.vars.rate =
      (this.stage.vars.td * 2 - this.stage.vars.ind) / (this.stage.vars.td * 4);
    this.stage.vars.td = 1 + 0;
    this.goto(
      Math.round(this.stage.vars.incx),
      Math.round(this.stage.vars.incy)
    );
    this.penSize = this.stage.vars.ind;
    this.penDown = true;
    for (
      let i = 0;
      i <
      Math.ceil(
        Math.log10(res / this.stage.vars.ind) / Math.log10(this.stage.vars.rate)
      );
      i++
    ) {
      this.stage.vars.td = this.stage.vars.td * this.stage.vars.rate;
      this.penSize = this.stage.vars.ind * this.stage.vars.td;
      this.goto(
        this.stage.vars.aox * this.stage.vars.td + ax,
        this.stage.vars.aoy * this.stage.vars.td + ay
      );
      this.goto(
        this.stage.vars.box * this.stage.vars.td + bx,
        this.stage.vars.boy * this.stage.vars.td + by
      );
      this.goto(
        this.stage.vars.cox * this.stage.vars.td + cx,
        this.stage.vars.coy * this.stage.vars.td + cy
      );
      this.goto(
        this.stage.vars.aox * this.stage.vars.td + ax,
        this.stage.vars.aoy * this.stage.vars.td + ay
      );
    }
    this.penSize = res;
    this.goto(ax, ay);
    this.goto(bx, by);
    this.goto(cx, cy);
    this.goto(ax, ay);
    this.penDown = false;
  }

  *whenGreenFlagClicked() {
    yield* this.startSequence();
    while (true) {
      this.stage.vars.deltatime = this.timer;
      this.restartTimer();
      this.stage.vars.fps = 60 / this.stage.vars.deltatime;
      this.stage.vars.camMovementSpeed =
        this.stage.vars.camdefaultspeed *
        (this.stage.vars.deltatime * this.stage.vars.deltatime);
      this.stage.vars.camSensitivity =
        this.stage.vars.camDefaultSensitivity *
        (this.stage.vars.deltatime * this.stage.vars.deltatime);
      this.stage.vars.camSmoothness =
        this.stage.vars.camDefaultSmoothness * this.stage.vars.deltatime;
      yield* this.lerpCam();
      yield* this.mouseMovement();
      yield* this.calculateAndDrawTriangles();
      yield* this.wait(0);
      yield;
    }
  }

  *calculateAndDrawTriangles() {
    this.penColor.h = this.stage.vars.color;
    this.penColor.a = 1 - this.stage.vars.transparency / 100;
    this.penColor.s = this.stage.vars.saturation;
    this.warp(this.calculatePpu)();
    this.warp(this.createRotQuaternion)();
    this.vars.currentTriangleIndex = 1;
    this.clearPen();
    for (let i = 0; i < this.stage.vars.x1List.length; i++) {
      this.warp(this.cullTriangle)();
      if (this.stage.vars.passedCulling == 1) {
        this.warp(this.calculateScreenCoordinates)();
        if (this.stage.vars.passedCulling == 1) {
          this.penColor.v =
            50 -
            this.stage.vars.brightnesses[this.vars.currentTriangleIndex - 1];
          this.warp(this.fillResolution)(
            this.stage.vars.screentriangleX1,
            this.stage.vars.screentriangleY1,
            this.stage.vars.screentriangleX2,
            this.stage.vars.screentriangleY2,
            this.stage.vars.screentriangleX3,
            this.stage.vars.screentriangleY3,
            11 - this.stage.vars.sharpness
          );
        }
      }
      this.vars.currentTriangleIndex += 1;
    }
  }

  *inittriangles() {
    yield* this.createTriangle(-1, 0, 4, 0, 1, 4, 1, 0, 4);
    yield* this.createTriangle(-3, 0, 5, -2, 1, 5, -1, -1, 5);
    yield* this.createTriangle(3, 0, 5, 2, 1, 5, 1, -1, 5);
  }

  *createTriangle(x2, y2, z1, x3, y3, z2, x4, y4, z3) {
    this.stage.vars.x1List.push(x2);
    this.stage.vars.y1List.push(y2);
    this.stage.vars.z1List.push(z1);
    this.stage.vars.x2List.push(x3);
    this.stage.vars.y2List.push(y3);
    this.stage.vars.z2List.push(z2);
    this.stage.vars.x3List.push(x4);
    this.stage.vars.y3List.push(y4);
    this.stage.vars.z3List.push(z3);
  }

  *clearTriangles() {
    this.stage.vars.x1List = [];
    this.stage.vars.x2List = [];
    this.stage.vars.x3List = [];
    this.stage.vars.y1List = [];
    this.stage.vars.y2List = [];
    this.stage.vars.y3List = [];
    this.stage.vars.z1List = [];
    this.stage.vars.z2List = [];
    this.stage.vars.z3List = [];
  }

  *setcamdirection(pitch, yaw) {
    this.stage.vars.campich = pitch;
    this.stage.vars.camyaw = yaw;
    this.stage.vars.camlookX =
      Math.sin(this.degToRad(yaw)) * Math.cos(this.degToRad(pitch));
    this.stage.vars.camlookY = Math.sin(this.degToRad(pitch));
    this.stage.vars.camlookZ =
      Math.cos(this.degToRad(yaw)) * Math.cos(this.degToRad(pitch));
  }

  *calculateScreenCoordinates() {
    this.vars.i =
      this.stage.vars.x1List[this.vars.currentTriangleIndex - 1] -
      this.stage.vars.camX;
    this.vars.j =
      this.stage.vars.y1List[this.vars.currentTriangleIndex - 1] -
      this.stage.vars.camY;
    this.vars.k =
      this.stage.vars.z1List[this.vars.currentTriangleIndex - 1] -
      this.stage.vars.camZ;
    yield* this.dotprod(
      this.vars.i,
      this.vars.j,
      this.vars.k,
      this.stage.vars.camlookX,
      this.stage.vars.camlookY,
      this.stage.vars.camlookZ
    );
    this.vars.i = this.vars.i / this.vars.dotresult - this.stage.vars.camlookX;
    this.vars.j = this.vars.j / this.vars.dotresult - this.stage.vars.camlookY;
    this.vars.k = this.vars.k / this.vars.dotresult - this.stage.vars.camlookZ;
    yield* this.rotationcalc();
    this.stage.vars.screentriangleX1 =
      (this.stage.vars.qW * this.stage.vars.x -
        this.stage.vars.w * this.stage.vars.qX -
        this.stage.vars.y * this.stage.vars.qZ +
        this.stage.vars.z * this.stage.vars.qY) *
      this.stage.vars.pixelsPerUnit;
    this.stage.vars.screentriangleY1 =
      (this.stage.vars.qW * this.stage.vars.y -
        this.stage.vars.w * this.stage.vars.qY -
        this.stage.vars.z * this.stage.vars.qX +
        this.stage.vars.x * this.stage.vars.qZ) *
      this.stage.vars.pixelsPerUnit;
    this.vars.i =
      this.stage.vars.x2List[this.vars.currentTriangleIndex - 1] -
      this.stage.vars.camX;
    this.vars.j =
      this.stage.vars.y2List[this.vars.currentTriangleIndex - 1] -
      this.stage.vars.camY;
    this.vars.k =
      this.stage.vars.z2List[this.vars.currentTriangleIndex - 1] -
      this.stage.vars.camZ;
    yield* this.dotprod(
      this.vars.i,
      this.vars.j,
      this.vars.k,
      this.stage.vars.camlookX,
      this.stage.vars.camlookY,
      this.stage.vars.camlookZ
    );
    this.vars.i = this.vars.i / this.vars.dotresult - this.stage.vars.camlookX;
    this.vars.j = this.vars.j / this.vars.dotresult - this.stage.vars.camlookY;
    this.vars.k = this.vars.k / this.vars.dotresult - this.stage.vars.camlookZ;
    yield* this.rotationcalc();
    this.stage.vars.screentriangleX2 =
      (this.stage.vars.qW * this.stage.vars.x -
        this.stage.vars.w * this.stage.vars.qX -
        this.stage.vars.y * this.stage.vars.qZ +
        this.stage.vars.z * this.stage.vars.qY) *
      this.stage.vars.pixelsPerUnit;
    this.stage.vars.screentriangleY2 =
      (this.stage.vars.qW * this.stage.vars.y -
        this.stage.vars.w * this.stage.vars.qY -
        this.stage.vars.z * this.stage.vars.qX +
        this.stage.vars.x * this.stage.vars.qZ) *
      this.stage.vars.pixelsPerUnit;
    this.vars.i =
      this.stage.vars.x3List[this.vars.currentTriangleIndex - 1] -
      this.stage.vars.camX;
    this.vars.j =
      this.stage.vars.y3List[this.vars.currentTriangleIndex - 1] -
      this.stage.vars.camY;
    this.vars.k =
      this.stage.vars.z3List[this.vars.currentTriangleIndex - 1] -
      this.stage.vars.camZ;
    yield* this.dotprod(
      this.vars.i,
      this.vars.j,
      this.vars.k,
      this.stage.vars.camlookX,
      this.stage.vars.camlookY,
      this.stage.vars.camlookZ
    );
    this.vars.i = this.vars.i / this.vars.dotresult - this.stage.vars.camlookX;
    this.vars.j = this.vars.j / this.vars.dotresult - this.stage.vars.camlookY;
    this.vars.k = this.vars.k / this.vars.dotresult - this.stage.vars.camlookZ;
    yield* this.rotationcalc();
    this.stage.vars.screentriangleX3 =
      (this.stage.vars.qW * this.stage.vars.x -
        this.stage.vars.w * this.stage.vars.qX -
        this.stage.vars.y * this.stage.vars.qZ +
        this.stage.vars.z * this.stage.vars.qY) *
      this.stage.vars.pixelsPerUnit;
    this.stage.vars.screentriangleY3 =
      (this.stage.vars.qW * this.stage.vars.y -
        this.stage.vars.w * this.stage.vars.qY -
        this.stage.vars.z * this.stage.vars.qX +
        this.stage.vars.x * this.stage.vars.qZ) *
      this.stage.vars.pixelsPerUnit;
    if (
      (Math.abs(this.stage.vars.screentriangleX1) > 240 &&
        Math.abs(this.stage.vars.screentriangleX2) > 240 &&
        Math.abs(this.stage.vars.screentriangleX3) > 240) ||
      (Math.abs(this.stage.vars.screentriangleY1) > 180 &&
        Math.abs(this.stage.vars.screentriangleY2) > 180 &&
        Math.abs(this.stage.vars.screentriangleY3) > 180)
    ) {
      this.stage.vars.passedCulling = 0;
    } else {
      this.stage.vars.passedCulling = 1;
    }
  }

  *dotprod(x5, y5, z4, x6, y6, z5) {
    this.vars.dotresult = x5 * x6 + y5 * y6 + z4 * z5;
  }

  *setCamPosition(x7, y7, z6) {
    this.stage.vars.camX = x7;
    this.stage.vars.camY = y7;
    this.stage.vars.camZ = z6;
  }

  *createRotQuaternion() {
    this.stage.vars.temp1 = Math.sin(
      this.degToRad(this.stage.vars.campich / 2)
    );
    this.stage.vars.temp2 = Math.cos(
      this.degToRad(this.stage.vars.campich / 2)
    );
    this.stage.vars.temp3 = Math.sin(
      this.degToRad(this.stage.vars.camyaw / -2)
    );
    this.stage.vars.temp4 = Math.cos(
      this.degToRad(this.stage.vars.camyaw / -2)
    );
    this.stage.vars.qW = this.stage.vars.temp2 * this.stage.vars.temp4;
    this.stage.vars.qX = this.stage.vars.temp4 * this.stage.vars.temp1;
    this.stage.vars.qY = this.stage.vars.temp2 * this.stage.vars.temp3;
    this.stage.vars.qZ = this.stage.vars.temp1 * this.stage.vars.temp3;
  }

  *rotationcalc() {
    this.stage.vars.w =
      -1 *
      (this.stage.vars.qX * this.vars.i +
        this.stage.vars.qY * this.vars.j +
        this.stage.vars.qZ * this.vars.k);
    this.stage.vars.x =
      this.stage.vars.qW * this.vars.i +
      this.stage.vars.qY * this.vars.k -
      this.stage.vars.qZ * this.vars.j;
    this.stage.vars.y =
      this.stage.vars.qW * this.vars.j +
      this.stage.vars.qZ * this.vars.i -
      this.stage.vars.qX * this.vars.k;
    this.stage.vars.z =
      this.stage.vars.qW * this.vars.k +
      this.stage.vars.qX * this.vars.j -
      this.stage.vars.qY * this.vars.i;
  }

  *startSequence() {
    this.penDown = false;
    this.clearPen();
    this.visible = false;
    this.goto(0, 0);
    yield* this.setCamPosition(-1.885, 0.876, 1.85);
    yield* this.setDesiredCamPos(-1.885, 0.876, 1.85);
    yield* this.setcamdirection(-8.321, 135.534);
    this.stage.vars.camDesiredPitch = -8.321;
    this.stage.vars.camDesiredYaw = 135.534;
    yield* this.setlightingdirection(-90, 0);
    this.stage.vars.brightness = 40;
    this.stage.vars.darkness = 30;
    this.stage.vars.camDefaultSensitivity = 40;
    this.stage.vars.camDefaultSmoothness = 5;
    this.stage.vars.camdefaultspeed = 10;
    yield* this.calculateLighting();
    this.stage.vars.mousePrevX = this.mouse.x;
    this.stage.vars.mousePrevY = this.mouse.y;
    this.stage.vars.settingstoggle = 1;
    this.stage.watchers.color.visible = true;
    this.stage.watchers.fov.visible = true;
    this.stage.watchers.saturation.visible = true;
    this.stage.watchers.sharpness.visible = true;
    this.stage.watchers.transparency.visible = true;
  }

  *whenKeyAnyPressed() {
    while (!!this.keyPressed("any")) {
      if (this.keyPressed("w")) {
        this.stage.vars.camdesiredX +=
          this.stage.vars.camlookX * this.stage.vars.camMovementSpeed;
        this.stage.vars.camdesiredY +=
          this.stage.vars.camlookY * this.stage.vars.camMovementSpeed;
        this.stage.vars.camdesiredZ +=
          this.stage.vars.camlookZ * this.stage.vars.camMovementSpeed;
      }
      if (this.keyPressed("s")) {
        this.stage.vars.camdesiredX +=
          -1 * (this.stage.vars.camlookX * this.stage.vars.camMovementSpeed);
        this.stage.vars.camdesiredY +=
          -1 * (this.stage.vars.camlookY * this.stage.vars.camMovementSpeed);
        this.stage.vars.camdesiredZ +=
          -1 * (this.stage.vars.camlookZ * this.stage.vars.camMovementSpeed);
      }
      if (this.keyPressed("d")) {
        this.stage.vars.camdesiredX +=
          Math.sin(this.degToRad(this.stage.vars.camyaw + 90)) *
          Math.cos(this.degToRad(this.stage.vars.campich)) *
          this.stage.vars.camMovementSpeed;
        this.stage.vars.camdesiredZ +=
          Math.cos(this.degToRad(this.stage.vars.camyaw + 90)) *
          Math.cos(this.degToRad(this.stage.vars.campich)) *
          this.stage.vars.camMovementSpeed;
      }
      if (this.keyPressed("a")) {
        this.stage.vars.camdesiredX +=
          Math.sin(this.degToRad(this.stage.vars.camyaw + -90)) *
          Math.cos(this.degToRad(this.stage.vars.campich)) *
          this.stage.vars.camMovementSpeed;
        this.stage.vars.camdesiredZ +=
          Math.cos(this.degToRad(this.stage.vars.camyaw + -90)) *
          Math.cos(this.degToRad(this.stage.vars.campich)) *
          this.stage.vars.camMovementSpeed;
      }
      if (this.keyPressed("e")) {
        this.stage.vars.camdesiredX +=
          Math.sin(this.degToRad(this.stage.vars.camyaw)) *
          Math.cos(this.degToRad(this.stage.vars.campich + 90)) *
          this.stage.vars.camMovementSpeed;
        this.stage.vars.camdesiredY +=
          Math.sin(this.degToRad(this.stage.vars.campich + 90)) *
          this.stage.vars.camMovementSpeed;
        this.stage.vars.camdesiredZ +=
          Math.cos(this.degToRad(this.stage.vars.camyaw)) *
          Math.cos(this.degToRad(this.stage.vars.campich + 90)) *
          this.stage.vars.camMovementSpeed;
      }
      if (this.keyPressed("q")) {
        this.stage.vars.camdesiredX +=
          Math.sin(this.degToRad(this.stage.vars.camyaw)) *
          Math.cos(this.degToRad(this.stage.vars.campich + -90)) *
          this.stage.vars.camMovementSpeed;
        this.stage.vars.camdesiredY +=
          Math.sin(this.degToRad(this.stage.vars.campich + -90)) *
          this.stage.vars.camMovementSpeed;
        this.stage.vars.camdesiredZ +=
          Math.cos(this.degToRad(this.stage.vars.camyaw)) *
          Math.cos(this.degToRad(this.stage.vars.campich + -90)) *
          this.stage.vars.camMovementSpeed;
      }
      yield;
    }
  }

  *calculatePpu() {
    this.stage.vars.pixelsPerUnit =
      480 / (2 * Math.tan(this.degToRad(this.stage.vars.fov / 2)));
  }

  *setDesiredCamPos(x8, y8, z7) {
    this.stage.vars.camdesiredX = x8;
    this.stage.vars.camdesiredY = y8;
    this.stage.vars.camdesiredZ = z7;
  }

  *lerpCam() {
    this.stage.vars.camX =
      this.stage.vars.camX +
      (this.stage.vars.camdesiredX - this.stage.vars.camX) *
        this.stage.vars.camSmoothness;
    this.stage.vars.camY =
      this.stage.vars.camY +
      (this.stage.vars.camdesiredY - this.stage.vars.camY) *
        this.stage.vars.camSmoothness;
    this.stage.vars.camZ =
      this.stage.vars.camZ +
      (this.stage.vars.camdesiredZ - this.stage.vars.camZ) *
        this.stage.vars.camSmoothness;
  }

  *mouseMovement() {
    if (this.mouse.down) {
      this.stage.vars.camDesiredYaw +=
        (this.mouse.x - this.stage.vars.mousePrevX) *
        this.stage.vars.camSensitivity;
      this.stage.vars.camDesiredPitch +=
        (this.mouse.y - this.stage.vars.mousePrevY) *
        this.stage.vars.camSensitivity;
      if (this.stage.vars.camDesiredPitch > 85) {
        this.stage.vars.camDesiredPitch = 85;
      } else {
        if (this.stage.vars.camDesiredPitch < -85) {
          this.stage.vars.camDesiredPitch = -85;
        }
      }
    }
    this.stage.vars.mousePrevX = this.mouse.x;
    this.stage.vars.mousePrevY = this.mouse.y;
    this.warp(this.setcamdirection)(
      this.stage.vars.campich +
        (this.stage.vars.camDesiredPitch - this.stage.vars.campich) *
          this.stage.vars.camSmoothness,
      this.stage.vars.camyaw +
        (this.stage.vars.camDesiredYaw - this.stage.vars.camyaw) *
          this.stage.vars.camSmoothness
    );
  }

  *cullTriangle() {
    this.vars.i =
      (this.stage.vars.x1List[this.vars.currentTriangleIndex - 1] +
        this.stage.vars.x2List[this.vars.currentTriangleIndex - 1] +
        this.stage.vars.x3List[this.vars.currentTriangleIndex - 1]) /
      3;
    this.vars.j =
      (this.stage.vars.y1List[this.vars.currentTriangleIndex - 1] +
        this.stage.vars.y2List[this.vars.currentTriangleIndex - 1] +
        this.stage.vars.y3List[this.vars.currentTriangleIndex - 1]) /
      3;
    this.vars.k =
      (this.stage.vars.z1List[this.vars.currentTriangleIndex - 1] +
        this.stage.vars.z2List[this.vars.currentTriangleIndex - 1] +
        this.stage.vars.z3List[this.vars.currentTriangleIndex - 1]) /
      3;
    this.warp(this.dotprod)(
      this.vars.i - this.stage.vars.camX,
      this.vars.j - this.stage.vars.camY,
      this.vars.k - this.stage.vars.camZ,
      this.stage.vars.normalsX[this.vars.currentTriangleIndex - 1],
      this.stage.vars.normalsY[this.vars.currentTriangleIndex - 1],
      this.stage.vars.normalsZ[this.vars.currentTriangleIndex - 1]
    );
    if (this.vars.dotresult > 0) {
      this.stage.vars.passedCulling = 0;
    } else {
      this.warp(this.dotprod)(
        this.vars.i - this.stage.vars.camX,
        this.vars.j - this.stage.vars.camY,
        this.vars.k - this.stage.vars.camZ,
        this.stage.vars.camlookX,
        this.stage.vars.camlookY,
        this.stage.vars.camlookZ
      );
      if (this.vars.dotresult < 0) {
        this.stage.vars.passedCulling = 0;
      } else {
        this.stage.vars.passedCulling = 1;
      }
    }
  }

  *calculateLighting() {
    this.stage.vars.brightnesses = [];
    this.vars.currentTriangleIndex = 1;
    this.stage.vars.normalsX = [];
    this.stage.vars.normalsY = [];
    this.stage.vars.normalsZ = [];
    for (let i = 0; i < this.stage.vars.x1List.length; i++) {
      this.warp(this.crossProd)(
        this.stage.vars.x1List[this.vars.currentTriangleIndex - 1] -
          this.stage.vars.x2List[this.vars.currentTriangleIndex - 1],
        this.stage.vars.y1List[this.vars.currentTriangleIndex - 1] -
          this.stage.vars.y2List[this.vars.currentTriangleIndex - 1],
        this.stage.vars.z1List[this.vars.currentTriangleIndex - 1] -
          this.stage.vars.z2List[this.vars.currentTriangleIndex - 1],
        this.stage.vars.x2List[this.vars.currentTriangleIndex - 1] -
          this.stage.vars.x3List[this.vars.currentTriangleIndex - 1],
        this.stage.vars.y2List[this.vars.currentTriangleIndex - 1] -
          this.stage.vars.y3List[this.vars.currentTriangleIndex - 1],
        this.stage.vars.z2List[this.vars.currentTriangleIndex - 1] -
          this.stage.vars.z3List[this.vars.currentTriangleIndex - 1]
      );
      this.warp(this.dotprod)(
        this.stage.vars.lightDirX,
        this.stage.vars.lightDirY,
        this.stage.vars.lightDirZ,
        this.stage.vars.crossX,
        this.stage.vars.crossY,
        this.stage.vars.crossZ
      );
      this.vars.temp = Math.sqrt(
        this.stage.vars.crossX * this.stage.vars.crossX +
          this.stage.vars.crossY * this.stage.vars.crossY +
          this.stage.vars.crossZ * this.stage.vars.crossZ
      );
      this.stage.vars.normalsX.push(this.stage.vars.crossX / this.vars.temp);
      this.stage.vars.normalsY.push(this.stage.vars.crossY / this.vars.temp);
      this.stage.vars.normalsZ.push(this.stage.vars.crossZ / this.vars.temp);
      this.vars.temp = this.vars.dotresult / this.vars.temp;
      if (this.vars.temp > 0) {
        this.stage.vars.brightnesses.push(
          this.vars.temp * this.stage.vars.brightness
        );
      } else {
        if (0 > this.vars.temp) {
          this.stage.vars.brightnesses.push(
            this.vars.temp * this.stage.vars.darkness
          );
        }
      }
      this.vars.currentTriangleIndex += 1;
    }
  }

  *crossProd(x9, y9, z8, x10, y10, z9) {
    this.stage.vars.crossX = y9 * z9 - z8 * y10;
    this.stage.vars.crossY = z8 * x10 - x9 * z9;
    this.stage.vars.crossZ = x9 * y10 - y9 * x10;
  }

  *setlightingdirection(pitch2, yaw2) {
    this.stage.vars.lightPitch = pitch2;
    this.stage.vars.lightYaw = yaw2;
    this.stage.vars.lightDirX =
      Math.sin(this.degToRad(yaw2)) * Math.cos(this.degToRad(pitch2));
    this.stage.vars.lightDirY = Math.sin(this.degToRad(pitch2));
    this.stage.vars.lightDirZ =
      Math.cos(this.degToRad(yaw2)) * Math.cos(this.degToRad(pitch2));
  }

  *whenKeyHPressed() {
    if (this.stage.vars.settingstoggle == 1) {
      this.stage.watchers.saturation.visible = false;
      this.stage.watchers.sharpness.visible = false;
      this.stage.watchers.fov.visible = false;
      this.stage.watchers.transparency.visible = false;
      this.stage.watchers.color.visible = false;
      this.stage.vars.settingstoggle = 0;
    } else {
      this.stage.vars.settingstoggle = 1;
      this.stage.watchers.color.visible = true;
      this.stage.watchers.fov.visible = true;
      this.stage.watchers.saturation.visible = true;
      this.stage.watchers.sharpness.visible = true;
      this.stage.watchers.transparency.visible = true;
    }
  }

  *whenKeySpacePressed() {
    if (this.stage.vars.camposToggle == 1) {
      yield* this.setDesiredCamPos(-1.885, 0.876, 1.85);
      this.stage.vars.camDesiredPitch = -8.321;
      this.stage.vars.camDesiredYaw = 135.534;
      this.stage.vars.camposToggle = 0;
    } else {
      yield* this.setDesiredCamPos(-2.753, 0.971, -0.1);
      this.stage.vars.camDesiredPitch = -8.721;
      this.stage.vars.camDesiredYaw = 90;
      this.stage.vars.camposToggle = 1;
    }
  }
}
