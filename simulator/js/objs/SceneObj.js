/**
 * Base class for objects (optical elements, decorations, etc.) in the scene.
 */
class SceneObj {

  /**
   * @param {Scene} scene - The scene the object belongs to.
   * @param {Object|null} jsonObj - The JSON object to be deserialized, if any.
   */
  constructor(scene, jsonObj) {
    /** @property {Scene} scene - The scene the object belongs to. */
    this.scene = scene;

    const defaultProperties = this.constructor.defaultProperties;
    for (const prop in defaultProperties) {
      if (jsonObj && jsonObj.hasOwnProperty(prop)) {
        this[prop] = jsonObj[prop];
      } else {
        this[prop] = defaultProperties[prop];
      }
    }
  }

  /**
   * Serializes the object to a JSON object.
   * @returns {Object} The serialized JSON object.
   */
  serialize() {
    const jsonObj = { type: this.constructor.type };
    const defaultProperties = this.constructor.defaultProperties;

    for (const prop in defaultProperties) {
      if (this[prop] !== defaultProperties[prop]) {
        jsonObj[prop] = this[prop];
      }
    }

    return jsonObj;
  }
  
  /**
   * Check whether the given properties of the object are all the default values.
   * @param {string[]} propertyNames - The property names to be checked.
   * @returns {boolean} Whether the properties are all the default values.
   */
  arePropertiesDefault(propertyNames) {
    const defaultProperties = this.constructor.defaultProperties;
    for (const propName of propertyNames) {
      if (this[propName] !== defaultProperties[propName]) {
        return false;
      }
    }
    return true;
  }
  
  /**
   * The type of the object.
   */
  static type = '';

  /**
   * The default properties of the object.
   */
  static defaultProperties = {};

  /**
   * Whether the object interacts with rays (i.e. is a light source or an optical element).
   */
  static interactsWithRays = false;

  /**
   * Whether the object supports surface merging.
   */
  static supportsSurfMerging = false;

  /**
   * Populate the object bar.
   * Called when the user selects the object (it is selected automatically when the user creates it, so the construction may not be completed at this stage).
   * @param {ObjBar} objBar - The object bar to be populated.
   */
  populateObjBar(objBar) {
    // Do nothing by default
  }

  /**
   * Get the z-index of the object for the sequence of drawing.
   * Called before the simulator starts to draw the scene.
   * @returns {number} The z-index. The smaller the number is, the earlier `draw` is called.
   */
  getZIndex() {
    return 0;
  }

  /**
   * Draw the object on the canvas.
   * Called once before the simulator renders the light with `isAboveLight === false` and once after with `isAboveLight === true`.
   * @param {CanvasRenderer} canvasRenderer - The canvas renderer.
   * @param {boolean} isAboveLight - Whether the rendering layer is above the light layer.
   * @param {boolean} isHovered - Whether the object is hovered by the mouse, which determines the style of the object to be drawn, e.g., with lighlighted color.
   */
  draw(canvasRenderer, isAboveLight, isHovered) {
    // Do nothing by default
  }

  /**
   * Move the object by the given displacement.
   * Called when the user use arrow keys to move the object.
   * @param {number} diffX - The x-coordinate displacement.
   * @param {number} diffY - The y-coordinate displacement.
   */
  move(diffX, diffY) {
    // Do nothing by default
  }

  /**
   * @typedef {Object} ConstructReturn
   * @property {boolean} [isDone] - Whether the construction is done.
   * @property {boolean} [requiresObjBarUpdate] - Whether the object bar should be updated.
   * @property {boolean} [requiresUndoPoint] - Whether a new undo point should be created.
   */

  /**
   * Mouse down event when the object is being constructed by the user.
   * @param {Mouse} mouse - The mouse object.
   * @param {boolean} ctrl - Whether the control key is pressed.
   * @param {boolean} shift - Whether the shift key is pressed.
   * @returns {ConstructReturn} The return value.
   */
  onConstructMouseDown(mouse, ctrl, shift) {
    // Do nothing by default
  }

  /**
   * Mouse move event when the object is being constructed by the user.
   * @param {Mouse} mouse - The mouse object.
   * @param {boolean} ctrl - Whether the control key is pressed.
   * @param {boolean} shift - Whether the shift key is pressed.
   * @returns {ConstructReturn} The return value.
   */
  onConstructMouseMove(mouse, ctrl, shift) {
    // Do nothing by default
  }

  /**
   * Mouse up event when the object is being constructed by the user.
   * @param {Mouse} mouse - The mouse object.
   * @param {boolean} ctrl - Whether the control key is pressed.
   * @param {boolean} shift - Whether the shift key is pressed.
   * @returns {ConstructReturn} The return value.
   */
  onConstructMouseUp(mouse, ctrl, shift) {
    // Do nothing by default
  }

  /* This typedef will eventually be moved to the `Editor` class. */
  /**
   * @typedef {Object} DragContext
   * @property {number} part - The index of the part within the object being dragged. 0 for the whole object.
   * @property {Point} [targetPoint] - The target point where the user is dragging. This is recognized by the editor so that it can be used for popping up the coordinate box (when the user double-clicks or right-clicks such a point), or binding to a handle (when the user holds Ctrl and clicks such a point).
   * @property {Point} [targetPoint_] - If this property is set instead of setting `targetPoint`, then the point will not be used for the coordinate box or handle, but is still recognized by the editor when deciding which part of which object the user want to interact with.
   * @property {boolean} [requiresObjBarUpdate] - Whether the object bar should be updated during the dragging.
   * @property {string} [cursor] - The cursor to be used during hovering and dragging.
   * @property {SnapContext} [snapContext] - The snap context.
   * @property {boolean} [hasDuplicated] - Whether the object is duplicated during the dragging. This is true when the user holds the Ctrl key and drags the whole object. Only set by the editor.
   * @property {SceneObj} [originalObj] - The original object when the dragging starts. Only set by the editor.
   * @property {boolean} [isByHandle] - Whether the dragging is initiated by dragging a handle. Only set by the editor.
   */

  /**
   * Check whether the mouse is over the object, which is called when the user moves the mouse over the scene. This is used for deciding the highlighting of the object, and also for deciding that if the user starts dragging at this position, which part of the object should be dragged.
   * @param {Mouse} mouse - The mouse object.
   * @returns {DragContext|null} The drag context if the user starts dragging at this position, or null if the mouse is not over the object.
   */
  checkMouseOver(mouse) {
    return null;
  }

  /**
   * The event when the user drags the object, which is fired on every step during the dragging. The object should be updated according to `DragContext` which is returned by `checkMouseOver`. `dragContext` can be modified during the dragging.
   * @param {Mouse} mouse - The mouse object.
   * @param {DragContext} dragContext - The drag context.
   * @param {boolean} ctrl - Whether the control key is pressed.
   * @param {boolean} shift - Whether the shift key is pressed.
   */
  onDrag(mouse, dragContext, ctrl, shift) {
    // Do nothing by default
  }

  /* This typedef will eventually be moved to the `Simulator` class. */
  /**
   * @typedef {Object} Ray
   * @property {Point} p1 - The starting point of the ray.
   * @property {Point} p2 - Another point on the ray.
   * @property {number} brightness_s - he intensity of the s-polarization component of the ray.
   * @property {number} brightness_p - The intensity of the p-polarization component of the ray. In this simulator the two polarization components are assumed to be of no phase coherence.
   * @property {number} [wavelength] - The wavelength of the ray in nanometers. Only has effect in color mode.
   * @property {boolean} gap - Whether the ray is the first ray in a bunch of "continuous" rays. This is for the detection of images to work correctly. The intersection of two rays is considered as a candidate of an image only if the second ray has `gap === false`.
   * @property {boolean} isNew - Whether the ray is just emitted by a source. This is to avoid drawing trivial initial extensions in the "Extended rays" mode.
   */

  /**
   * @typedef {Object} SimulationReturn
   * @property {boolean} [isAbsorbed] - Whether the object absorbs the ray.
   * @property {Array<Ray>} [newRays] - The new rays to be added to the scene.
   * @property {number} [truncation] - The brightness of truncated rays due to numerical cutoff.
   */

  /**
   * The event when the simulation starts.
   * If this object is a light source, it should emit rays here by setting `newRays`. If the object is a detector, it may do some initialization here.
   * @returns {SimulationReturn|null} The return value.
   */
  onSimulationStart() {
    // Do nothing by default
  }

  

  /**
   * Check whether the object intersects with the given ray.
   * Called during the ray tracing when `ray` is to be tested whether it intersects with the object. Find whether they intersect and find the nearset intersection if so. Implemented only by optical elements that affects or detect rays.
   * @param {Ray} ray - The ray.
   * @returns {Point|null} - The intersection (closest to the beginning of the ray) if they intersect.
   */
  checkRayIntersects(ray) {
    return null;
  }


  /**
   * The event when a ray is incident on the object.
   * Called during the ray tracing when `ray` has been calculated to be incident on the object at the `incidentPoint`. Perform the interaction between `ray` and the object. Implemented only by optical elements that affects or detect rays.
   * If `ray` is absorbed by the object, return `{ isAbsorbed: true }`.
   * If there is a primary outgoing ray, directly modify `ray` to be the outgoing ray. This includes the case when the object is a detector that does not modify the direction of the ray.
   * If there are secondary rays to be emitted, return `{ newRays: [ray1, ray2, ...] }`. Note that if there are more than one secondary rays, image detection does not work in the current version, and `rayN.gap` should be set to `true`. But for future support, the secondary ray which is to be of the same continuous bunch or rays should have consistent index in the `newRays` array.
   * Sometimes keeping tracks of all the rays may result in infinite loop (such as in a glass). Depending on the situation, some rays with brightness below a certain threshold (such as 0.01) may be truncated. In this case, the brightness of the truncated rays should be returned as `truncation`.
   * @param {Ray} ray - The ray.
   * @param {number} rayIndex - The index of the ray in the array of all rays currently in the scene in the simulator. In particular, in a bunch of continuous rays, the rays are ordered by the time they are emitted, and the index is the order of emission. This can be used to downsample the rays and increase the individual brightness if it is too low.
   * @param {Point} incidentPoint - The point where the ray is incident on the object, which is the intersection point found by `checkRayIntersects`.
   * @param {Array<SceneObj>} surfaceMergingObjs - The objects that are merged with the current object. If two or more objects with `supportSurfaceMerging === true` has overlapping surfaces (often acheived by using the grid), and if a ray is incident on those surfaces together, only one of the object will be have `onRayIncident` being called, and the other objects will be in `surfaceMergingObjs`. In this case, this function must also deal with the combination of the surface before doing the actual interaction. Note that treating them as two very close surfaces may not give the correct result due to an essential discontinuity of ray optics (which is smoothed out at the scale of the wavelength in reality).
   */
  onRayIncident(ray, rayIndex, incidentPoint, surfaceMergingObjs) {
    // Do nothing by default
  }




}