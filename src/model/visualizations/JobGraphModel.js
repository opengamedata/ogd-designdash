import VisualizerModel from "./VisualizerModel";

export class JobGraphModel extends VisualizerModel {
   /**
    * @typedef {object} JobGraphMeta
    * @property {object} playerSummary
    * @property {object} populationSummary
    * @property {number} maxAvgTime
    * @property {number} minAvgTime
    */

   /**
    * @param {string?} game_name 
    * @param {object?} raw_data 
    * @param {*} link_mode 
    */
   constructor(game_name, raw_data, link_mode) {
      console.log(`In JobGraphModel, got game name of ${game_name} and raw_data of ${JSON.stringify(raw_data)}`)
      super(game_name || "UNKNOWN GAME", raw_data)
      /** @type {object[]} */
      this.nodes = [];
      /** @type {object[]} */
      this.links = [];
      /** @type JobGraphMeta */
      this.meta = {
         playerSummary: {},
         populationSummary: {},
         maxAvgTime: 0,
         minAvgTime: Infinity
      }
      if (raw_data != null) {
         this.initializeFromRawData(raw_data, link_mode);
      }
   }

   /**
    * 
    * @param {object} raw_data 
    * @param {string} link_mode 
    */
   initializeFromRawData(raw_data, link_mode) {
      // console.log('rawData', rawData)

      // metadata
      /** @type JobGraphMeta */
      const meta = {
         playerSummary: JSON.parse(raw_data.PlayerSummary.replaceAll('\\', '')),
         populationSummary: JSON.parse(raw_data.PopulationSummary.replaceAll('\\', '').replaceAll('_', ' ')),
         maxAvgTime: 0,
         minAvgTime: Infinity
      }

      // nodes
      let nodeBuckets = JobGraphModel.genNodeBuckets(raw_data, meta);

      // links
      let l = JobGraphModel.genLinks(raw_data, link_mode)

      // filter out nodes w/ no edges
      const relevantNodes = Object.values(nodeBuckets).filter(
         ({ id }) => l.map(link => link.source).includes(id) || l.map(link => link.target).includes(id)
      );
      if (link_mode === 'ActiveJobs') {
         relevantNodes.forEach(n => {
            // console.log(rawLinks)
            const rawLinks = JSON.parse(raw_data[link_mode].replaceAll('\\', ''))
            n.players = rawLinks[n.id]
         }
         );

      this.nodes = relevantNodes;
      this.links = l;
      this.meta = meta
      // console.log('relevantNodes', relevantNodes)
      // console.log('links', l)
      }
   }

   /**
    * 
    * @param {object} rawData 
    * @param {object} meta 
    * @returns {object}
    */
   static genNodeBuckets(rawData, meta) {
      let nodeBuckets = {}
      for (const [key, value] of Object.entries(rawData)) {
         if (key.substring(0, 3) !== 'job' && key.substring(0, 7) !== 'mission') continue

         const [k, metric] = key.split('_')
         // console.log(`${k}'s ${metric}: ${value}`);
         if (metric === 'JobsAttempted-avg-time-per-attempt') {
            if (parseFloat(value) > meta.maxAvgTime) meta.maxAvgTime = parseFloat(value)
            if (parseFloat(value) < meta.minAvgTime) meta.minAvgTime = parseFloat(value)
         }

         if (!nodeBuckets.hasOwnProperty(k)) nodeBuckets[k] = {} // create node pbject
         if (metric === 'JobsAttempted-job-name') nodeBuckets[k].id = value // store job name as node id
         else if (metric === 'JobsAttempted') continue
         else nodeBuckets[k][metric] = value

         // parse job difficulty json
         if (metric === 'JobsAttempted-job-difficulties') {
            nodeBuckets[k][metric] = JSON.parse(nodeBuckets[k][metric])
         }
      }
      // console.log(nodeBuckets)
      return nodeBuckets;
   }

   /**
    * 
    * @param {object} rawData 
    * @param {string} linkMode 
    * @returns {object[]}
    */
   static genLinks(rawData, linkMode) {
      let l = []
      const rawLinks = JSON.parse(rawData[linkMode].replaceAll('\\', ''))

      switch (linkMode) {
         case 'TopJobCompletionDestinations':
            for (const [sourceKey, targets] of Object.entries(rawLinks)) {
               for (const [targetKey, players] of Object.entries(targets)) {
                  if (sourceKey === targetKey) continue // omit self-pointing jobs
                  l.push({
                     source: sourceKey,
                     sourceName: sourceKey,
                     target: targetKey,
                     targetName: targetKey,
                     value: players.length,
                     players: players
                  })
               }
            }
            break;
         case 'TopJobSwitchDestinations':
            for (const [sourceKey, targets] of Object.entries(rawLinks)) {
               for (const [targetKey, players] of Object.entries(targets)) {
                  if (sourceKey === targetKey) continue // omit self-pointing jobs
                  l.push({
                     source: sourceKey,
                     sourceName: sourceKey,
                     target: targetKey,
                     targetName: targetKey,
                     value: players.length,
                     players: players
                  })
               }
            }
            break;
         case 'ActiveJobs':
            const activeJobs = Object.keys(rawLinks)
            for (let i = 1; i < activeJobs.length; i++) {
               const target = activeJobs[i];
               l.push({
                  source: activeJobs[0],
                  sourceName: activeJobs[0],
                  target: target,
                  targetName: target
               })
            }
            break;
         default:
            alert('Something went wrong. Plase refresh the page and try again')
            break;
      }
      return l;
   }

   /**
    * @returns {object[]}
    */
   get Nodes() {
      return this.nodes;
   }
   /**
    * @returns {object[]}
    */
   get Links() {
      return this.links;
   }
   /**
    * @returns {object}
    */
   get Meta() {
      return this.meta;
   }
}