import * as d3 from 'd3';

declare global {
  interface GameData {
    id: string;
    game: string;
    featureLevel: 'population' | 'player' | 'session';
    startDate: string;
    endDate: string;
    OGDVersion: string;
    source: 'file' | 'api';
    data: d3.DSVRowArray<string>;
  }

  type VizType = 'bar' | 'histogram' | 'scatter' | 'timeline' | 'forceGraph';
}
