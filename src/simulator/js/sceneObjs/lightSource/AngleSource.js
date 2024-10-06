import BaseSceneObj from '../BaseSceneObj.js';
import LineObjMixin from '../LineObjMixin.js';
import Simulator from '../../Simulator.js';
import geometry from '../../geometry.js';
import { getMsg } from '../../translations.js';

/**
 * Finite angle point source
 * 
 * Tools -> Light source -> Point source (<360deg)
 * @class
 * @extends BaseSceneObj
 * @memberof sceneObjs
 * @property {Point} p1 - The position of the point source.
 * @property {Point} p2 - Another point on the reference line.
 * @property {number} brightness - The brightness of the point source.
 * @property {number} wavelength - The wavelength of the point source in nm. Only effective when "Simulate Colors" is on.
 * @property {number} emisAngle - The angle of emission in degrees.
 * @property {boolean} symmetric - Whether the emission is symmetric about the reference line. If not, the emission is only on one side of the reference line.
 */
class AngleSource extends LineObjMixin(BaseSceneObj) {
  static type = 'AngleSource';
  static isOptical = true;
  static serializableDefaults = {
    p1: null,
    p2: null,
    brightness: 0.5,
    wavelength: Simulator.GREEN_WAVELENGTH,
    emisAngle: 36.001,
    symmetric: true
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
    objBar.createNumber(getMsg('emisAngle'), 0, 180, 1, this.emisAngle, function (obj, value) {
      obj.emisAngle = value;
    });
    if (objBar.showAdvanced(!this.arePropertiesDefault(['symmetric']))) {
      objBar.createBoolean(getMsg('symmetric'), this.symmetric, function (obj, value) {
        obj.symmetric = value;
      });
    }
  }

  draw(canvasRenderer, isAboveLight, isHovered) {
    const ctx = canvasRenderer.ctx;
    const ls = canvasRenderer.lengthScale;

    ctx.fillStyle = isHovered ? 'cyan' : (this.scene.simulateColors ? Simulator.wavelengthToColor(this.wavelength, 1) : 'rgb(0,255,0)');
    ctx.fillRect(this.p1.x - 2.5 * ls, this.p1.y - 2.5 * ls, 5 * ls, 5 * ls);
    if (this.scene.simulateColors) {
      ctx.fillStyle = isHovered ? 'cyan' : ('rgb(255,255,255)');
      ctx.fillRect(this.p1.x - 1.5 * ls, this.p1.y - 1.5 * ls, 3 * ls, 3 * ls);
    }
    ctx.fillStyle = isHovered ? 'cyan' : ('rgb(255,0,0)');
    ctx.fillRect(this.p2.x - 1.5 * ls, this.p2.y - 1.5 * ls, 3 * ls, 3 * ls);
  }

  onSimulationStart() {
    var s = Math.PI * 2 / parseInt(this.scene.rayDensity * 500);
    var i0 = (this.scene.mode == 'observer') ? (-s * 2 + 1e-6) : 0;

    var ang, x1, y1, iStart, iEnd;
    if (this.symmetric) {
      iStart = (i0 - (Math.PI / 180.0 * this.emisAngle) / 2.0);
      iEnd = (i0 + (Math.PI / 180.0 * this.emisAngle) / 2.0 - 1e-5);
    } else {
      iStart = i0;
      iEnd = (i0 + (Math.PI / 180.0 * this.emisAngle) - 1e-5);
    }

    let newRays = [];

    for (var i = iStart; i < iEnd; i = i + s) {
      var r = Math.sqrt((this.p2.x - this.p1.x) * (this.p2.x - this.p1.x) + (this.p2.y - this.p1.y) * (this.p2.y - this.p1.y));

      ang = i + Math.atan2(this.p2.y - this.p1.y, this.p2.x - this.p1.x);

      x1 = this.p1.x + r * Math.cos(ang);
      y1 = this.p1.y + r * Math.sin(ang);

      var ray1 = geometry.line(geometry.point(this.p1.x, this.p1.y), geometry.point(x1, y1));

      ray1.brightness_s = Math.min(this.brightness / this.scene.rayDensity, 1) * 0.5;
      ray1.brightness_p = Math.min(this.brightness / this.scene.rayDensity, 1) * 0.5;
      if (this.scene.simulateColors) {
        ray1.wavelength = this.wavelength;
      }
      ray1.isNew = true;
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

export default AngleSource;