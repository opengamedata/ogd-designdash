import * as d3 from 'd3';

declare global {
  interface GameData {
    id: string;
    game: string;
    featureLevel: 'population' | 'player' | 'session' | 'unknown';
    startDate: string;
    endDate: string;
    OGDVersion: string;
    source: 'file' | 'api';
    data: d3.DSVRowArray<Object>;
    columnTypes: Record<string, string>;
    supportedChartTypes: VizTypeKey[];
  }
}
