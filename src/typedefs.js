import { JobGraphModel } from "./model/visualizations/JobGraphModel";
import { ViewModes } from "./model/enums/ViewModes";
import Timedelta from "./model/Timedelta";

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
 * @callback StringSetter
 * @param {string} newVal
 */

/**
 * @callback StringListSetter
 * @param {string[]} newVal
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
 * @callback JobGraphSetter
 * @param {JobGraphModel} newVal
 */

/**
 * @callback FeatureMapSetter
 * @param {FeaturesMap} newVal
 */