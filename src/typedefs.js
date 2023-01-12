import { JobGraphModel } from "./model/visualizations/JobGraphModel";
import { ViewModes } from "./model/ViewModes";

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
 * @callback JobGraphSetter
 * @param {JobGraphModel} newVal
 */

/**
 * @callback ViewModeSetter
 * @param {ViewModes} newVal
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
 * @callback ElementSetter
 * @param {ElementRenderer} newRenderer
 */

/**
 * @callback ElementRenderer
 * @returns {Element} newVal
 */

/**
 * @callback PropertySetter
 * @param {PropertyCallback} newCallback
 */

/**
 * @callback FeatureMapSetter
 * @param {FeaturesMap} newVal
 */