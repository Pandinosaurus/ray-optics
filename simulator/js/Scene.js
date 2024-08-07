/**
 * The version of the JSON data format of the scene, which matches the major version number of the app starting from version 5.0.
 * @const {number}
 */
const DATA_VERSION = 5;

/**
 * Represents the scene in this simulator.
 * @class Scene
 * @property {string} name - The name of the scene.
 * @property {Object<string,ModuleDef>} modules - The definitions of modules used in the scene.
 * @property {Array<BaseSceneObj>} objs - The objects (optical elements and/or decorations created by the user with "Tools") in the scene.
 * @property {string} mode - The mode of the scene. Possible values: 'rays' (Rays), 'extended' (Extended Rays), 'images' (All Images), 'observer' (Seen by Observer).
 * @property {number} rayModeDensity - The density of rays in 'rays' and 'extended' modes.
 * @property {number} imageModeDensity - The density of rays in 'images' and 'observer' modes.
 * @property {boolean} showGrid - The "Grid" option indicating if the grid is visible.
 * @property {boolean} snapToGrid - The "Snap to Grid" option indicating if mouse actions are snapped to the grid.
 * @property {boolean} lockObjs - The "Lock Objects" option indicating if the objects are locked.
 * @property {number} gridSize - The size of the grid.
 * @property {Circle|null} observer - The observer of the scene, null if not set.
 * @property {number} lengthScale - The length scale used in line width, default font size, etc in the scene.
 * @property {Point} origin - The origin of the scene in the viewport.
 * @property {number} scale - The scale factor (the viewport CSS pixel per internal length unit) of the scene.
 * @property {number} width - The width (in CSS pixels) of the viewport.
 * @property {number} height - The height (in CSS pixels) of the viewport.
 * @property {boolean} simulateColors - The "Simulate Color" option indicating if the color (wavelength) of the rays is simulated (also affecting whether the options of color filtering or Cauchy coefficients of some objects are shown.)
 * @property {boolean} symbolicBodyMerging - The "Symbolic body-merging" option in the gradient-index glass objects (which is a global option), indicating if the symbolic math is used to calculate the effective refractive index resulting from the "body-merging" of several gradient-index glass objects.
 * @property {Object|null} backgroundImage - The background image of the scene, null if not set.
 */
class Scene {
  static serializableDefaults = {
    name: '',
    modules: {},
    objs: [],
    mode: 'rays',
    rayModeDensity: 0.1,
    imageModeDensity: 1,
    showGrid: false,
    snapToGrid: false,
    lockObjs: false,
    gridSize: 20,
    observer: null,
    lengthScale: 1,
    origin: { x: 0, y: 0 },
    scale: 1,
    width: 1500,
    height: 900,
    simulateColors: false,
    symbolicBodyMerging: false
  };

  constructor() {
    this.backgroundImage = null;
    this.error = null;
    this.warning = null;
    this.fromJSON(JSON.stringify({ version: DATA_VERSION }), () => { });
  }

  /**
  * Set the size (in CSS pixels) for the viewport of the scene.
  * @method setViewportSize
  * @param {number} width
  * @param {number} height
  */
  setViewportSize(width, height) {
    this.width = width;
    this.height = height;
  }


  /** @property {number} rayDensity - The mode-dependent ray density. */
  get rayDensity() {
    return this.mode == 'rays' || this.mode == 'extended' ? this.rayModeDensity : this.imageModeDensity;
  }

  set rayDensity(val) {
    if (this.mode == 'rays' || this.mode == 'extended') {
      this.rayModeDensity = val;
    } else {
      this.imageModeDensity = val;
    }
  }

  /** @property {Array<BaseSceneObj>} opticalObjs - The objects in the scene which are optical. Module objects are expanded recursively. If the user edits only the non-optical part of the scene, then the content of this array will not change. */
  get opticalObjs() {
    function expandObjs(objs) {
      let expandedObjs = [];
      for (let obj of objs) {
        if (obj.constructor === objTypes['ModuleObj']) {
          expandedObjs = expandedObjs.concat(expandObjs(obj.objs));
        } else {
          expandedObjs.push(obj);
        }
      }
      return expandedObjs;
    }

    return expandObjs(this.objs).filter(obj => obj.constructor.isOptical);
  }

  /**
   * The callback function when the entire scene or a resource (e.g. image) is loaded.
   * @callback fromJSONCallback
   * @param {boolean} needFullUpdate - Whether the scene needs a full update.
   * @param {boolean} completed - Whether the scene is completely loaded.
   */

  /**
  * Load the scene from JSON.
  * @param {string} json
  * @param {fromJSONCallback} callback - The callback function when the entire scene or a resource (e.g. image) is loaded.
  */
  fromJSON(json, callback) {
    this.error = null;
    this.warning = null;
    try {
      let jsonData = JSON.parse(json);

      // Convert the scene from old versions if necessary.
      if (!jsonData.version || jsonData.version < DATA_VERSION) {
        jsonData = versionUpdate(jsonData);
      } else if (jsonData.version > DATA_VERSION) {
        // Newer than the current version
        throw new Error('The version of the scene is newer than the current version of the simulator.');
      }

      const serializableDefaults = Scene.serializableDefaults;

      // Take the approximated size of the current viewport, which may be different from that of the scene to be loaded.
      const approximatedWidth = Math.ceil((this.width || serializableDefaults.width) / 100) * 100;
      const approximatedHeight = Math.ceil((this.height || serializableDefaults.height) / 100) * 100;

      // Set the properties of the scene. Use the default properties if the JSON data does not contain them.
      for (let key in serializableDefaults) {
        if (!(key in jsonData)) {
          jsonData[key] = JSON.parse(JSON.stringify(serializableDefaults[key]));
        }
        this[key] = jsonData[key];
      }

      // Rescale the scene to fit the current viewport.
      let rescaleFactor = 1;

      if (jsonData.width / jsonData.height > approximatedWidth / approximatedHeight) {
        rescaleFactor = jsonData.width / approximatedWidth;
      } else {
        rescaleFactor = jsonData.height / approximatedHeight;
      }

      this.scale = jsonData.scale / rescaleFactor;
      this.origin.x = jsonData.origin.x / rescaleFactor;
      this.origin.y = jsonData.origin.y / rescaleFactor;

      // Load the objects in the scene.
      this.objs = jsonData.objs.map(objData =>
        new objTypes[objData.type](this, objData)
      );

      // Load the background image.
      if (jsonData.backgroundImage) {
        this.backgroundImage = new Image();
        this.backgroundImage.src = "../gallery/" + jsonData.backgroundImage;
        this.backgroundImage.onload = function (e1) {
          callback(false, true);
        }
        callback(true, false);
      } else {
        // The JSON data does not contain the background image. Currently this does not mean that we should clear the background image (as the undo/redo history does not currently store it). However, this may change in the future.
        callback(true, true);
      }
    } catch (e) {
      this.error = e.toString();
      this.objs = [];
      callback(true, true);
    }
  }

  /**
   * Convert the scene to JSON.
   * @method toJSON
   * @returns {string} The JSON string representing the scene.
   */
  toJSON() {
    let jsonData = { version: DATA_VERSION };

    // Put the name of the scene first.
    if (this.name) {
      jsonData.name = this.name;
    }

    // And then the module definitions.
    if (Object.keys(this.modules).length > 0) {
      jsonData.modules = this.modules;
    }

    // Serialize the objects in the scene.
    jsonData.objs = this.objs.map(obj => obj.serialize());

    // Use approximated size of the current viewport.
    const approximatedWidth = Math.ceil(this.width / 100) * 100;
    const approximatedHeight = Math.ceil(this.height / 100) * 100;
    jsonData.width = approximatedWidth;
    jsonData.height = approximatedHeight;

    // Export the rest of non-default properties.
    const serializableDefaults = Scene.serializableDefaults;
    for (let propName in serializableDefaults) {
      if (!jsonData.hasOwnProperty(propName)) {
        const stringifiedValue = JSON.stringify(this[propName]);
        const stringifiedDefault = JSON.stringify(serializableDefaults[propName]);
        if (stringifiedValue !== stringifiedDefault) {
          jsonData[propName] = JSON.parse(stringifiedValue);
        }
      }
    }

    return JSON.stringify(jsonData, null, 2);
  }

  /**
   * Add a module definition.
   * @param {string} moduleName
   * @param {ModuleDef} moduleDef
   * @returns {boolean} Whether the module is successfully added.
   */
  addModule(moduleName, moduleDef) {
    this.modules[moduleName] = moduleDef;

    // Update all module objects.
    for (let i in this.objs) {
      if (this.objs[i].constructor.type === "ModuleObj") {
        this.objs[i] = new objTypes.ModuleObj(this, this.objs[i].serialize());
      }
    }

    return true;
  }

  /**
   * Remove a given module and demodulize all corresponding module objects.
   * @param {string} moduleName 
   */
  removeModule(moduleName) {
    mainLoop: while (true) {
      for (let obj of this.objs) {
        if (obj.constructor.type === "ModuleObj" && obj.module === moduleName) {
          obj.demodulize();
          continue mainLoop;
        }
      }
      break;
    }

    delete this.modules[moduleName];
  }
};