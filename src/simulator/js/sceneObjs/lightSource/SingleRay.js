import BaseSceneObj from '../BaseSceneObj.js';
import LineObjMixin from '../LineObjMixin.js';
import Simulator from '../../Simulator.js';
import geometry from '../../geometry.js';
import { getMsg } from '../../translations.js';

/**
 * A single ray of light.
 * 
 * Tools -> Light source -> Single ray
 * @class
 * @extends BaseSceneObj
 * @memberof sceneObjs
 * @property {Point} p1 - The start point of the ray.
 * @property {Point} p2 - Another point on the ray.
 * @property {number} brightness - The brightness of the ray.
 * @property {number} wavelength - The wavelength of the ray in nm. Only effective when "Simulate Colors" is on.
 */
class SingleRay extends LineObjMixin(BaseSceneObj) {
  static type = 'SingleRay';
  static isOptical = true;
  static serializableDefaults = {
    p1: null,
    p2: null,
    brightness: 1,
    wavelength: Simulator.GREEN_WAVELENGTH
  };

  populateObjBar(objBar) {
    objBar.createNumber(getMsg('brightness'), 0.01, 1, 0.01, this.brightness, function (obj, value) {
      obj.brightness = value;
    });
    if (this.scene.simulateColors) {
      objBar.createNumber(getMsg('wavelength'), Simulator.UV_WAVELENGTH, Simulator.INFRARED_WAVELENGTH, 1, this.wavelength, function (obj, value) {
        obj.wavelength = value;
      });
    }
  }

  draw(canvasRenderer, isAboveLight, isHovered) {
    const ctx = canvasRenderer.ctx;
    const ls = canvasRenderer.lengthScale;

    ctx.fillStyle = isHovered ? 'cyan' : (this.scene.simulateColors ? Simulator.wavelengthToColor(this.wavelength, 1) : 'rgb(255,0,0)');
    ctx.fillRect(this.p1.x - 2.5 * ls, this.p1.y - 2.5 * ls, 5 * ls, 5 * ls);
    ctx.fillStyle = isHovered ? 'cyan' : ('rgb(255,0,0)');
    ctx.fillRect(this.p2.x - 1.5 * ls, this.p2.y - 1.5 * ls, 3 * ls, 3 * ls);
  }

  onSimulationStart() {
    var ray1 = geometry.line(this.p1, this.p2);
    ray1.brightness_s = 0.5 * this.brightness;
    ray1.brightness_p = 0.5 * this.brightness;
    if (this.scene.simulateColors) {
      ray1.wavelength = this.wavelength;
    }
    ray1.gap = true;
    ray1.isNew = true;
    return {
      newRays: [ray1]
    };
  }
};

export default SingleRay;