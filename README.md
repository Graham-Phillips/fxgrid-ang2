# fxgrid-ang2
Angular 2 data grid with forex data. Work in progress.
Naive implementation that assumes a small number of records.

TO USE:
Ensure you have Git, gulp and Node/npm installed. 

run npm i

run gulp
- this will build the project and open a browser at http://localhost:8000/ however you will get a "Cannot GET /" on the first run as the build has not yet completed. Please wait until gulp reports that the Typescript build is complete, ctrl-c out of the gulp process, and then restart gulp.

ABOUT:
Displays mock fx market data, columns are sortable. 

The last 3 (unsortable) columns are a form of sparkline- they are a bit unusual as they start with a flat line which gradually gains data points over time, as opposed to a time-series style sparkline that grows along the y-axis. The intention is to give a stronger visual indication of the relative price movements when there are only a few data points.


TODOs:

- Unit tests.
- click handler for sorting is currently a non-Angular solution.
- Highlight the updated line.
- Replace the callbacks that are being used to pass data from services to the view with a decent solution, investigate RXJS Observables, Reflux or similar.
- replace mock service with a Node server and websocket.
- Type annotations - too many 'any's used for a quick win. Go back and add better Typescript type annotations.
- Styling: flex used instead of the more traditional table for the grid, to investigate finding a more responsive solution to datagrids. Needs work, layout isn't bulletproof across browsers. Investigate the new css grid layout.
- investigate cannot find name _moduleName error - TS complains, yet if we remove if from moduleId then we get a 404 on the template.
