import BaseSceneObj from '../BaseSceneObj.js';
import Simulator from '../../Simulator.js';
import geometry from '../../geometry.js';
import { getMsg } from '../../translations.js';

/**
 * 360 degree point source
 * 
 * Tools -> Light Source -> Point source (360deg)
 * @class
 * @extends BaseSceneObj
 * @memberof sceneObjs
 * @property {number} x - The x coordinate of the point source.
 * @property {number} y - The y coordinate of the point source.
 * @property {number} brightness - The brightness of the point source.
 * @property {number} wavelength - The wavelength of the light emitted by the point source in nm. Only effective when "Simulate Colors" is on.
 */
class PointSource extends BaseSceneObj {
  static type = 'PointSource';
  static isOptical = true;
  static serializableDefaults = {
    x: null,
    y: null,
    brightness: 0.5,
    wavelength: Simulator.GREEN_WAVELENGTH
  };

  populateObjBar(objBar) {
    objBar.createNumber(getMsg('brightness'), 0.01, 1, 0.01, this.brightness, function (obj, value) {
      obj.brightness = value;
    }, getMsg('brightness_note_popover'));
    if (this.scene.simulateColors) {
      objBar.createNumber(getMsg('wavelength'), Simulator.UV_WAVELENGTH, Simulator.INFRARED_WAVELENGTH, 1, this.wavelength, function (obj, value) {
        obj.wavelength = value;
      });
    }
  }

  draw(canvasRenderer, isAboveLight, isHovered) {
    const ctx = canvasRenderer.ctx;
    const ls = canvasRenderer.lengthScale;

    ctx.fillStyle = this.scene.simulateColors ? Simulator.wavelengthToColor(this.wavelength, 1) : isHovered ? 'cyan' : ('rgb(0,255,0)');
    ctx.fillRect(this.x - 2.5 * ls, this.y - 2.5 * ls, 5 * ls, 5 * ls);
    if (this.scene.simulateColors) {
      ctx.fillStyle = isHovered ? 'cyan' : ('rgb(255,255,255)');
      ctx.fillRect(this.x - 1.5 * ls, this.y - 1.5 * ls, 3 * ls, 3 * ls);
    }
  }

  move(diffX, diffY) {
    this.x += diffX;
    this.y += diffY;
  }

  onConstructMouseDown(mouse, ctrl, shift) {
    const mousePos = mouse.getPosSnappedToGrid();
    this.x = mousePos.x;
    this.y = mousePos.y;
  }

  onConstructMouseUp(mouse, ctrl, shift) {
    return {
      isDone: true
    };
  }

  checkMouseOver(mouse) {
    let dragContext = {};
    if (mouse.isOnPoint(this)) {
      dragContext.part = 0;
      dragContext.targetPoint = geometry.point(this.x, this.y);
      dragContext.snapContext = {};
      return dragContext;
    }
  }

  onDrag(mouse, dragContext, ctrl, shift) {
    if (shift) {
      var mousePos = mouse.getPosSnappedToDirection(dragContext.targetPoint, [{ x: 1, y: 0 }, { x: 0, y: 1 }], dragContext.snapContext);
    } else {
      var mousePos = mouse.getPosSnappedToGrid();
      dragContext.snapContext = {};
    }

    this.x = mousePos.x;
    this.y = mousePos.y;
  }

  onSimulationStart() {
    let newRays = [];

    var s = Math.PI * 2 / parseInt(this.scene.rayDensity * 500);
    var i0 = (this.scene.mode == 'observer') ? (-s * 2 + 1e-6) : 0;
    for (var i = i0; i < (Math.PI * 2 - 1e-5); i = i + s) {
      var ray1 = geometry.line(geometry.point(this.x, this.y), geometry.point(this.x + Math.sin(i), this.y + Math.cos(i)));
      ray1.brightness_s = Math.min(this.brightness / this.scene.rayDensity, 1) * 0.5;
      ray1.brightness_p = Math.min(this.brightness / this.scene.rayDensity, 1) * 0.5;
      ray1.isNew = true;
      if (this.scene.simulateColors) {
        ray1.wavelength = this.wavelength;
      }
      if (i == i0) {
        ray1.gap = true;
      }
      newRays.push(ray1);
    }

    return {
      newRays: newRays,
      brightnessScale: Math.min(this.brightness / this.scene.rayDensity, 1) / (this.brightness / this.scene.rayDensity)
    };
  }
};

export default PointSource;