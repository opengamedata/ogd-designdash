import VisualizerModel from "./VisualizerModel";
import { color_20 } from "../../config";

export class PlayerTimelineModel extends VisualizerModel {
   /**
    * 
    * @param {string} game_name
    * @param {object} raw_data 
    */
   constructor(game_name, raw_data) {
      super(game_name, raw_data);

      const event_list = JSON.parse(raw_data["EventList"] ?? "{}")
      const sess_count = raw_data["SessionCount"]

      const events = event_list.map((evt) => {
         return {
               level:     evt.job_name,
               detail:    evt.event_primary_detail,
               type:      evt.name,
               timestamp: ((new Date(evt.timestamp)).getTime() / 1000).toFixed(0),
               date:      (new Date(evt.timestamp)).toLocaleString(),
               sessionID: evt.session_id
         }
      })

      // a dictionary-like stucture that stores timestamp -> event(s) mappings
      let timestamps = {}
      event_list.forEach((evt, i) => {
         const timestamp = ((new Date(evt.timestamp)).getTime() / 1000).toFixed(0)

         // if timestamp already in the dictionary 
         if (timestamp in timestamps) {
               if (typeof timestamps[timestamp] === 'number') {
                  timestamps[timestamp] = [timestamps[timestamp]]
               }
               timestamps[timestamp].push(i)
         }
         // base case: add timestamp to dictionary
         else timestamps[timestamp] = i
      });


      // calculate derived values
      const playerID = event_list[0].user_id
      const startTimestamp = events[0].timestamp
      const endTimestamp = events[events.length - 1].timestamp
      let minDuration = Infinity
      // let minDuration = 1000000
      const typeList = new Set()
      for (let i = 0; i < events.length; i++) {

         // calculate duration
         let duration = 0
         if (i < events.length - 1) duration = events[i + 1].timestamp - events[i].timestamp
         events[i].duration = duration
         if (duration > 0 && duration < minDuration) minDuration = duration // update minimum duration

         // normalize timestamps
         events[i].timestamp = events[i].timestamp - startTimestamp

         // construct list of types
         typeList.add(events[i].type)

         // lump extra features into one field
         let extra = []
         for (const [k, v] of Object.entries(event_list[i])) {
               if (!['user_id', 'index'].includes(k)) // put what you don't want to show in this array
                  extra.push(`${k}: ${v}`)
         }
         extra.push(`duration: ${duration}`)
         events[i].extra = extra
      }

      // assign colors to types
      const types = {}
      let count = 0
      typeList.forEach((t) => {
         types[t] = color_20[count % color_20.length]
         count++
      });


      // extract primary values
      const meta = {
         playerID: playerID,
         sessionCount: sess_count,
         minDuration: minDuration,
         startTime: events[0].date,
         endTime: events[events.length-1].date,
         totalTime: endTimestamp - startTimestamp,
         types: types
      }

      // console.log(meta)
      // console.log(events)
      // console.log(types)
      // console.log(timestamps)

      this.meta = meta;
      this.events = events;
      this.timestamps = Object.entries(timestamps)
   }

   get ConvertedData() {
      return { meta: this.meta, events: this.events, timestamps: this.timestamps }
   }
}