import VisualizerRequest from "../BaseVisualizer/VisualizerRequest";
import {
  FilterRequest,
  RangeItem,
  DropdownItem,
  SeparatorItem,
} from "../../requests/FilterRequest";
import { PlayerListRequest } from "../../requests/apis/player/PlayerList"
import { PlayersMetricsRequest } from "../../requests/apis/player/PlayersMetrics"
// import { AvailableGames } from "../../visualizers/BaseVisualizer/AvailableGames";
import { AvailableGames } from "../BaseVisualizer/AvailableGames";
import ValueModes from "../../enums/ValueModes";
import { RESTTypes } from "../../enums/RESTTypes"
// import { JobGraphModel } from "./JobGraphModel";
// import { ISODatetimeFormat } from "../../utils/TimeFormat";
import { BarplotModel } from "./BarplotModel";
import { OGDAPI } from "../../apis/OGDAPI";
/**
 * @typedef {import("../../requests/APIRequest").APIRequest} APIRequest
 * @typedef {import("../BaseVisualizer/VisualizerModel").default} VisualizerModel
 * @typedef {import('../../typedefs').FeaturesMap} FeaturesMap
 * @typedef {import("../../typedefs").MapSetter} MapSetter
 * @typedef {import("../../typedefs").Validator} Validator
 */

export default class BarplotRequest extends VisualizerRequest {
  constructor() {
    super();
    this.filter_request = BarplotRequest._genFilterRequest();
    
    this.viz_model = new BarplotModel(
      AvailableGames.EnumList()[0].asString,
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
    

    let ret_val = new FilterRequest("Scatterplot");
    ret_val.AddItem(
      new DropdownItem(
        "Game",
        ValueModes.ENUM,
        AvailableGames,
        AvailableGames.FromName("AQUALAB")
      )
    );
    let two_days_ago = new Date();
    two_days_ago.setDate(two_days_ago.getDate() - 2);
    let startDate = two_days_ago;
    let endDate = two_days_ago;
    // console.log(`In ScatterplotRequest, the initial date range is ${ISODatetimeFormat(startDate)} to ${ISODatetimeFormat(endDate)}`)
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
    
    ret_val.AddItem(new SeparatorItem("JobFilterSeparator"));
    
    return ret_val;
  }

  /**
   * @param {object} requesterState
   * @returns {APIRequest?} The API request that gets the visualizer's required data.
   */
  GetAPIRequest(requesterState) {
  // 1. Set up variables for the request
    const RequiredExtractors = {
      AQUALAB: [
        "SessionJobsCompleted",
        "SwitchJobsCount",
        "SessionDiveSitesCount"
      ],
      SHIPWRECKS: [
        "EvidenceBoardCompleteCount"
      ],
    };
    const selected_game = requesterState["GameSelected"];
    const game = AvailableGames.FromDict(selected_game) ?? AvailableGames.Default();
    /** @type {Date} */
    let min_date = new Date(requesterState["DateRangeMin"]);
    min_date.setHours(0, 0, 0, 0);
    let max_date = new Date(requesterState["DateRangeMax"]);
    max_date.setHours(23, 59, 59, 0);
  // 2. Create a request for player list, which we need in order to grab values across players
    const population_request = new PlayerListRequest(
      RESTTypes.GET,
      game,
      requesterState["AppVersionRangeMin"],
      requesterState["AppVersionRangeMax"],
      requesterState["LogVersionRangeMin"],
      requesterState["LogVersionRangeMax"],
      min_date,
      max_date
    )
    let ret_val = OGDAPI.fetch(population_request)
    .then((api_result) => {
      console.log(`Result object from fetching player list request has structure:\n${result}`)
      return new PlayersMetricsRequest(
        RequiredExtractors[game.asString][0],
        api_result.Values,
        RESTTypes.POST,
        game,
        requesterState["AppVersionRangeMin"],
        requesterState["AppVersionRangeMax"],
        requesterState["LogVersionRangeMin"],
        requesterState["LogVersionRangeMax"],
      );
    })
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
      this.viz_model = new BarplotModel(
        requesterState["GameSelected"].asString,
        rawData
      );
    }
    return this.viz_model;
  }
}
