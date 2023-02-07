import VisualizerRequest from "./VisualizerRequest";
import { AvailableGames } from "../../model/enums/AvailableGames";
import { FilterRequest, RangeItem, DropdownItem, SeparatorItem, ValueModes } from "./FilterRequest";
import { JobGraphModel } from "../../model/visualizations/JobGraphModel";
import { APIRequest, PopulationAPIRequest } from "./APIRequest";
import RequestModes from "../../model/enums/RequestModes";

/**
 * @typedef {import("../../model/visualizations/VisualizerModel").default} VisualizerModel
 * @typedef {import('../../typedefs').FeaturesMap} FeaturesMap
 * @typedef {import("../../typedefs").MapSetter} MapSetter
 * @typedef {import("../../typedefs").Validator} Validator
 */

export default class JobGraphRequest extends VisualizerRequest {
   constructor() {
      super();
      this.filter_request = new FilterRequest("JobGraph");
      this.filter_request.AddItem(
         new DropdownItem("Game", ValueModes.ENUM, AvailableGames, AvailableGames.FromName("AQUALAB"))
      )
      let two_days_ago = new Date();
      two_days_ago.setDate(two_days_ago.getDate() - 2);
      let startDate = two_days_ago;
      let endDate = two_days_ago;
      /** @type {Validator} */
      this.filter_request.AddItem(
         new RangeItem("DateRange", ValueModes.DATE, startDate, endDate, JobGraphRequest.DateValidator)
      )
      this.filter_request.AddItem(
         new RangeItem("AppVersionRange", ValueModes.TEXT, "*", "*", JobGraphRequest.VersionValidator("App"))
      )
      this.filter_request.AddItem(
         new RangeItem("LogVersionRange", ValueModes.TEXT, "*", "*", JobGraphRequest.VersionValidator("Log"))
      )
      this.filter_request.AddItem(
         new SeparatorItem("JobFilterSeparator")
      )
      this.filter_request.AddItem(
         new RangeItem("MinimumJobs", ValueModes.NUMBER, 0, null, JobGraphRequest.MinJobsValidator)
      )
      this.viz_model = new JobGraphModel(AvailableGames.EnumList()[0].asString, null, null)
   }

   /**
    * @type {Validator}
    */
   static GameValidator(vals) {
      const gameSelected = vals['selected'];
      if (!gameSelected) {
            // prompt user
            alert('make sure a game has been selected!');
            return false;
      }
      else {
         return true;
      }
   }

   /**
    * @type {Validator}
    */
   static DateValidator(vals) {
      // if empty fields, prompt user to fill in the blanks & return
      // if (!(game && version && startDate && endDate && minPlaytime >= 0 && maxPlaytime)) {
      const startDate = vals['min'];
      const endDate = vals['max']
      const today = new Date();
      const queryEnd = new Date(endDate)
      // console.log(today, queryEnd)
      // console.log(today - queryEnd)
      if (startDate == null || endDate == null) {
         alert("Need to select both a start and an end date!")
         return false;
      }
      if (startDate > endDate) {
         alert("The start date must not be later than the end date!")
         return false;
      }
      else if (today.getTime() - queryEnd.getTime() <= 1000 * 60 * 60 * 24) {
            alert('select an end date that\'s prior to yesterday')
            return false;
      }
      else {
         return true;
      }
   }

   /**
    * 
    * @param {string} name 
    * @returns {Validator}
    */
   static VersionValidator(name) {
      return (vals) => {
         const minVersion = vals['min'];
         const maxVersion = vals['max']
         if (minVersion !== null && maxVersion !== null && minVersion > maxVersion) {
            alert(`The minimum ${name} version must be less than the maximum!`)
            return false;
         }
         else {
            return true;
         }
      }
   }

   /**
    * @type {Validator}
    */
   static MinJobsValidator(vals) {
         const minPlaytime = vals['min'];
         const maxPlaytime = vals['max']
      if (minPlaytime != null && maxPlaytime != null && minPlaytime > maxPlaytime) {
         alert('The minimum play time must be less than the maximum!')
         return false;
      }
      else {
         return true;
      }
   }

   /**
    * @param {object} requesterState
    * @returns {APIRequest?} The API request that gets the visualizer's required data.
    */
   GetAPIRequest(requesterState) {
      const RequiredExtractors = {
         "AQUALAB": [
            'ActiveJobs',
            'JobsAttempted-avg-time-per-attempt',
            'JobsAttempted-job-name',
            'JobsAttempted-job-difficulties',
            'TopJobCompletionDestinations',
            'TopJobSwitchDestinations',
            'PlayerSummary',
            'PopulationSummary',
         ],
         "SHIPWRECKS": [
            'ActiveJobs',
            'JobsAttempted',
            'PlayerSummary',
            'PopulationSummary'
         ]
      };
      const game = requesterState['GameSelected'].Name;
      console.log(`In JobGraphRequest, the game name selected is ${game}`)
      return new PopulationAPIRequest(RequestModes.POPULATION, RequiredExtractors[game], game,
                                   requesterState['AppVersionRangeMin'], requesterState['AppVersionRangeMax'],
                                   requesterState['LogVersionRangeMin'], requesterState['LogVersionRangeMax'],
                                   requesterState['DateRangeMin'], requesterState['DateRangeMax']
      )
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
         this.viz_model = new JobGraphModel(requesterState['GameSelected'], rawData, 'TopJobCompletionDestinations');
      }
      return this.viz_model;
   }
}