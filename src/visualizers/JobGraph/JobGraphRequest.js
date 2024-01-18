import VisualizerRequest from "../BaseVisualizer/VisualizerRequest";
import {
  FilterRequest,
  RangeItem,
  DropdownItem,
  SeparatorItem,
} from "../../requests/FilterRequest";
import { PopulationMetricsRequest } from "../../requests/apis/population/PopulationMetrics";
// import { AvailableGames } from "../../enums/AvailableGames";
import { AllowedGames } from "./AllowedGames";
import ValueModes from "../../enums/ValueModes";
import { RESTTypes } from "../../enums/RESTTypes"
import { JobGraphModel } from "./JobGraphModel";
import { ISODatetimeFormat } from "../../utils/TimeFormat";

/**
 * @typedef {import("../../requests/APIRequest").APIRequest} APIRequest
 * @typedef {import("../BaseVisualizer/VisualizerModel").default} VisualizerModel
 * @typedef {import('../../typedefs').FeaturesMap} FeaturesMap
 * @typedef {import("../../typedefs").MapSetter} MapSetter
 * @typedef {import("../../typedefs").Validator} Validator
 */

export default class JobGraphRequest extends VisualizerRequest {
  constructor() {
    super();
    this.filter_request = JobGraphRequest._genFilterRequest();
    this.viz_model = new JobGraphModel(
      AllowedGames.EnumList()[0].asString,
      null,
      null
    );
  }

  static _genFilterRequest() {
    /**
     * @type {Validator}
     */
    const DateValidator = (vals) => {
      // if empty fields, prompt user to fill in the blanks & return
      // if (!(game && version && startDate && endDate && minPlaytime >= 0 && maxPlaytime)) {
      const startDate = vals["min"];
      const endDate = vals["max"];
      const today = new Date();
      const queryEnd = new Date(endDate);
      // console.log(today, queryEnd)
      // console.log(today - queryEnd)
      // if (startDate == null || endDate == null) {
      //    alert("Need to select both a start and an end date!")
      //    return false;
      // }
      if (startDate > endDate) {
        alert("The start date must not be later than the end date!");
        return false;
      } else if (today.getTime() - queryEnd.getTime() <= 1000 * 60 * 60 * 24) {
        alert("select an end date that's prior to yesterday");
        return false;
      } else {
        return true;
      }
    };
    /**
     * @param {string} name
     * @returns {Validator}
     */
    const VersionValidator = (name) => {
      return (vals) => {
        const minVersion = vals["min"];
        const maxVersion = vals["max"];
        if (
          minVersion !== null &&
          maxVersion !== null &&
          minVersion > maxVersion
        ) {
          alert(`The minimum ${name} version must be less than the maximum!`);
          return false;
        } else {
          return true;
        }
      };
    };
    /**
     * @type {Validator}
     */
    const MinJobsValidator = (vals) => {
      const minPlaytime = vals["min"];
      const maxPlaytime = vals["max"];
      if (
        minPlaytime != null &&
        maxPlaytime != null &&
        minPlaytime > maxPlaytime
      ) {
        alert("The minimum play time must be less than the maximum!");
        return false;
      } else {
        return true;
      }
    };

    let ret_val = new FilterRequest("JobGraph");
    ret_val.AddItem(
      new DropdownItem(
        "Game",
        ValueModes.ENUM,
        AllowedGames,
        AllowedGames.FromName("AQUALAB")
      )
    );
    let two_days_ago = new Date();
    two_days_ago.setDate(two_days_ago.getDate() - 2);
    let startDate = two_days_ago;
    let endDate = two_days_ago;
    // console.log(`In JobGraphRequest, the initial date range is ${ISODatetimeFormat(startDate)} to ${ISODatetimeFormat(endDate)}`)
    /** @type {Validator} */
    ret_val.AddItem(
      new RangeItem(
        "DateRange",
        ValueModes.DATE,
        startDate,
        endDate,
        DateValidator
      )
    );
    ret_val.AddItem(
      new RangeItem(
        "AppVersionRange",
        ValueModes.TEXT,
        "*",
        "*",
        VersionValidator("App")
      )
    );
    ret_val.AddItem(
      new RangeItem(
        "LogVersionRange",
        ValueModes.TEXT,
        "*",
        "*",
        VersionValidator("Log")
      )
    );
    ret_val.AddItem(new SeparatorItem("JobFilterSeparator"));
    ret_val.AddItem(
      new RangeItem("MinimumJobs", ValueModes.NUMBER, 0, null, MinJobsValidator)
    );
    return ret_val;
  }

  /**
   * @param {object} requesterState
   * @returns {APIRequest?} The API request that gets the visualizer's required data.
   */
  GetAPIRequest(requesterState) {
    const RequiredExtractors = {
      AQUALAB: [
        "ActiveJobs",
        "JobsAttempted",
        // 'JobsAttempted-avg-time-per-attempt',
        // 'JobsAttempted-job-name',
        // 'JobsAttempted-job-difficulties',
        "TopJobCompletionDestinations",
        "TopJobSwitchDestinations",
        "PlayerSummary",
        "PopulationSummary",
      ],
      SHIPWRECKS: [
        "ActiveJobs",
        "JobsAttempted",
        "PlayerSummary",
        "PopulationSummary",
      ],
    };
    const selected_dict = requesterState["GameSelected"];
    const game =
    AllowedGames.FromDict(selected_dict) ?? AllowedGames.Default();
    /** @type {Date} */
    let min_date = new Date(requesterState["DateRangeMin"]);
    min_date.setHours(0, 0, 0, 0);
    let max_date = new Date(requesterState["DateRangeMax"]);
    max_date.setHours(23, 59, 59, 0);
    return new PopulationMetricsRequest(
      RequiredExtractors[game.asString],
      RESTTypes.POST,
      game,
      requesterState["AppVersionRangeMin"],
      requesterState["AppVersionRangeMax"],
      requesterState["LogVersionRangeMin"],
      requesterState["LogVersionRangeMax"],
      min_date,
      max_date
    );
  }

  /**
   * @returns {FilterRequest}
   */
  GetFilterRequest() {
    return this.filter_request;
  }

  /**
   * @param {object} requesterState
   * @param {object} rawData
   * @returns {VisualizerModel} A model of the kind expected by the visualizer.
   */
  GetVisualizerModel(requesterState, rawData) {
    if (this.viz_model.dataNotEqual(rawData)) {
      this.viz_model = new JobGraphModel(
        requesterState["GameSelected"].asString,
        rawData,
        "TopJobCompletionDestinations"
      );
    }
    return this.viz_model;
  }
}
