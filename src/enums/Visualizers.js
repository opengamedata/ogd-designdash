import EnumType from "./EnumType";

export class Visualizers extends EnumType {
   static INITIAL = new Visualizers('INITIAL', 'Initial');
   static HISTOGRAM = new Visualizers('HISTOGRAM', 'Histogram');
   static SCATTERPLOT = new Visualizers('SCATTERPLOT', 'Scatterplot');
   static BARPLOT = new Visualizers('BARPLOT', 'Barplot');
   static JOB_GRAPH = new Visualizers('JOB_GRAPH', 'Job Graph');
   static PLAYER_TIMELINE = new Visualizers('PLAYER_TIMELINE', 'Player Timeline');

   
   static EnumList() {
      return [Visualizers.INITIAL, Visualizers.HISTOGRAM, Visualizers.SCATTERPLOT, Visualizers.BARPLOT, Visualizers.JOB_GRAPH, Visualizers.PLAYER_TIMELINE]
   }

   constructor(name, readable=name) {
      super(name, readable);
   }
}