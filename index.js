import { Project } from "https://unpkg.com/leopard@^1/dist/index.esm.js";

import Stage from "./Stage/Stage.js";
import _3dGraphics from "./_3dGraphics/_3dGraphics.js";

const stage = new Stage({ costumeNumber: 6 });

const sprites = {
  _3dGraphics: new _3dGraphics({
    x: 12.079201573793169,
    y: 2.5735820450437794,
    direction: 90,
    costumeNumber: 1,
    size: 1000,
    visible: false,
    layerOrder: 1
  })
};

const project = new Project(stage, sprites, {
  frameRate: 30 // Set to 60 to make your project run faster
});
export default project;
