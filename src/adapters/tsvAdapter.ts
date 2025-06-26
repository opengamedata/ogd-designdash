import * as d3 from 'd3';

export async function parseTSV(file: File) {
  // TODO: implement TSV parsing

  // e.g. AQUALAB_20250107_to_20250107_6ee74c3_population-features.tsv
  const [game, startDate, _, endDate, OGDVersion, feature] =
    file.name.split('_');
  const featureLevel = feature.split('-')[0] as
    | 'population'
    | 'player'
    | 'session';
  const id = `${game}_${startDate}_${endDate}_${OGDVersion}_${featureLevel}`;

  const url = URL.createObjectURL(file);
  const extractedData = await d3.tsv(url, d3.autoType);

  const columnTypes: Record<string, string> = {};
  if (Object.hasOwn(extractedData, '0')) {
    const firstRow = extractedData[0];
    for (const [key, value] of Object.entries(firstRow)) {
      columnTypes[key] = typeof value;
    }
  }

  const dataset: GameData = {
    id,
    game,
    featureLevel,
    startDate,
    endDate,
    OGDVersion,
    source: 'file',
    data: extractedData,
    columnTypes: columnTypes,
  };

  return dataset;
}
