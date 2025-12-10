import { DSVParsedArray } from 'd3';
import { DatasetResponse } from '../services/apiService';
import { getColumnTypes, getSupportedChartTypes } from './adapterUtils';

export function normalizeApiResponse(
  responseBody: DatasetResponse,
  selectedGame: string,
  selectedDataset: string,
  level: 'population' | 'player' | 'session',
) {
  const rows = responseBody.val.rows as Record<string, any>[];

  rows.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (row[key] === null) {
        row[key] = 'null';
      }
    });
  });

  // Convert the rows and columns to a DSVParsedArray
  const dsvParsedArray = Object.assign(rows, {
    columns: responseBody.val.columns,
  }) as DSVParsedArray<object>;

  const dataset: GameData = {
    id: generateAPIDatasetID(selectedGame, selectedDataset, level),
    game: selectedGame,
    featureLevel: level,
    startDate: selectedDataset,
    endDate: selectedDataset,
    OGDVersion: 'api',
    source: 'api',
    data: dsvParsedArray,
    columnTypes: getColumnTypes(dsvParsedArray),
    supportedChartTypes: getSupportedChartTypes(dsvParsedArray, level),
  };

  return dataset;
}

export function generateAPIDatasetID(
  game: string,
  dataset: string,
  level: 'population' | 'player' | 'session',
) {
  return `${game}_${dataset}_${dataset}_api_${level}`;
}
