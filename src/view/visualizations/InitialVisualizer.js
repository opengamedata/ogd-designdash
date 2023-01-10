// Global imports
import React from 'react';

export default function InitialVisualizer() {
   return (
      <div>
         <div>No data selected yet.</div>

         <div className="container pt-16">
            {/* {
                  {
                     'JobGraph':
                        <JobGraph
                              loading={false} />,
                     'PlayerTimeline':
                        <PlayerTimeline />
                  }['JobGraph']
            } */}
            <div className="mb-10 mx-10 pr-10 max-w-xl ">
                  {/* <p className="font-light text-4xl mb-3">Open Game Data</p> */}

                  <p>
                     v0.1.0
                     These anonymous data are provided in service of future educational data mining research.
                     They are made available under the <a
                        className="text-yellow-600"
                        href="https://creativecommons.org/publicdomain/zero/1.0/"
                        rel="noreferrer"
                        target="_blank">Creative Commons CCO 1.0 Universal license</a>.
                     Source code for this website and related data processing is available on <a
                        className="text-yellow-600"
                        href="https://github.com/opengamedata"
                        rel="noreferrer"
                        target="_blank">github</a>.
                  </p>
                  <p>
                     The feature extractor code may be modified to perform your own feature engineering.
                     If you derive any interesting features, please share them back with us!
                     <br />
                     <br />
                     We are actively looking for research collaborators. Reach out and we can discuss potential research project and funding options.
                  </p>
            </div>
         </div>
      </div>
   )
}