import { Component } from '@angular/core';
import { FxService } from '../service/fx.service';

@Component({
  selector: 'fx-grid',
  moduleId: __moduleName,
  templateUrl: 'grid.template.html',
  providers: [ FxService ]
})

export class GridComponent
{
  sortSelection : any;
  rows : any;
  _configObject : any;

  constructor(private fxService: FxService)
  {

    this.sortSelection = {};
    fxService.subscribeToUpdate(this._dataUpdateHandler.bind(this));
    let config = fxService.getGridConfig();
    this.sortSelection.column = config.sortSelection.column;
    this.sortSelection.ascending = config.sortSelection.ascending;
  }

  _dataUpdateHandler(data)
  {
    this.rows = data;
  }

  onHeaderSortClick(event)
  {
    // if we are clicking on the already selected column, toggle sort direction:
    let columnName = event.currentTarget.getAttribute('data-columnName');
    if(columnName === this.sortSelection.column)
    {
      this.sortSelection.ascending = !this.sortSelection.ascending;
    }
    else
    {
      // if not toggling we are changing the selected column
      this.sortSelection.column = columnName;
    }
    this.fxService.sort({column: columnName, ascending: this.sortSelection.ascending});
  }
}
