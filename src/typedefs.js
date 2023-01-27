/**
 * @typedef {import('./model/visualizations/JobGraphModel').JobGraphModel} JobGraphModel
 * @typedef {import('./model/enums/ViewModes').ViewModes} ViewModes
 * @typedef {import('./model/enums/Visualizers').Visualizers} Visualizers
 * @typedef {import('./model/Timedelta').default} Timedelta
 */

/**
 * @typedef {Object.<string, any>} AnyMap
 */

/**
 * @typedef {Object.<string, string[]>} FeaturesMap
 */

/**
 * @typedef {Object.<string, SetterCallback>} SetterMap
 */

/**
 * @callback SetterCallback
 * @param {object} newVal
 */

/**
 * @callback MapSetter
 * @param {AnyMap} newVal
 */

/**
 * @callback StringSetter
 * @param {string} newVal
 */

/**
 * @callback StringListSetter
 * @param {string[]} newVal
 */

/**
 * @callback Validator
 * @param {AnyMap} valueMap
 * @returns {boolean}
 */

/**
 * @callback StateUpdater
 * @param {string} key
 * @param {any} value
 */

/**
 * @callback PropertyCallback
 */

/**
 * @callback PropertySetter
 * @param {PropertyCallback} newCallback
 */

/**
 * @callback TimedeltaSetter
 * @param {Timedelta} newVal
 */

/**
 * @callback ElementSetter
 * @param {ElementRenderer} newRenderer
 */

/**
 * @callback ElementRenderer
 * @returns {Element} newVal
 */

/**
 * @callback ViewModeSetter
 * @param {ViewModes} newVal
 */

/**
 * @callback VisualizerSetter
 * @param {Visualizers} newVal
 */

/**
 * @callback JobGraphSetter
 * @param {JobGraphModel} newVal
 */

/**
 * @callback FeatureMapSetter
 * @param {FeaturesMap} newVal
 */

export default function typedefs() {return true};