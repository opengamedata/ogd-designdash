export const EdgeMode = {
  ActiveJobs: 'Still in progress',
  TopJobCompletionDestinations: 'Completed the job',
  TopJobSwitchDestinations: 'Switched to another job',
} as const;

/**
 * Create the edges for the graph
 * @param data - The data to get the edges from
 * @param edgeMode - The edge mode to use
 * @returns The edges
 */
export const getEdges = (data: any, edgeMode: keyof typeof EdgeMode) => {
  let edges = [];

  console.log(data);

  const rawLinks: Record<string, Record<string, string[]>> = JSON.parse(
    data[edgeMode],
  );

  switch (edgeMode) {
    case 'TopJobCompletionDestinations':
    case 'TopJobSwitchDestinations':
      console.log(edgeMode);
      for (const [sourceKey, targets] of Object.entries(rawLinks)) {
        for (const [targetKey, players] of Object.entries(targets)) {
          if (sourceKey === targetKey) continue; // omit self-pointing jobs
          edges.push({
            source: sourceKey,
            sourceName: sourceKey,
            target: targetKey,
            targetName: targetKey,
            value: players.length,
            players: players,
          });
        }
      }
      break;
    case 'ActiveJobs':
      const activeJobs = Object.keys(rawLinks);
      for (let i = 1; i < activeJobs.length; i++) {
        const target = activeJobs[i];
        edges.push({
          source: activeJobs[0],
          sourceName: activeJobs[0],
          target: target,
          targetName: target,
          value: 1, // Default value for ActiveJobs edges
        });
      }
      break;
    default:
      alert('Something went wrong. Plase refresh the page and try again');
      break;
  }
  console.log('edges', edges);
  return edges;
};

/**
 * Create the nodes for the graph
 * @param data - The data to get the nodes from
 * @returns The nodes
 */
export const getNodes = (data: any) => {
  let nodes: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (
      key.substring(0, 3) !== 'job' &&
      key.substring(0, 6) !== 'county' &&
      key.substring(0, 7) !== 'mission'
    )
      continue;

    const [jobNumber, jobFeature] = key.split('_');

    if (!nodes.hasOwnProperty(jobNumber)) nodes[jobNumber] = {}; // create node pbject
    if (jobFeature === 'JobsAttempted-job-name')
      nodes[jobNumber].id = value; // store job name as node id
    else if (jobFeature === 'JobsAttempted') continue;
    else nodes[jobNumber][jobFeature] = value;

    // AQUALAB specific: parse job difficulty json
    if (jobFeature === 'JobsAttempted-job-difficulties') {
      nodes[jobNumber][jobFeature] = JSON.parse(nodes[jobNumber][jobFeature]);
    }
  }
  console.log('nodes', nodes);
  return nodes;
};
