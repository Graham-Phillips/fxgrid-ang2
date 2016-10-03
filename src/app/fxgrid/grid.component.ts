import { Component } from '@angular/core';
import { FxService } from '../service/fx.service'

@Component({
  selector: 'fx-grid',
  moduleId: __moduleName,
  templateUrl: 'grid.template.html',
  providers: [ FxService ]

})

export class GridComponent
{

static get UP_ARROW_UNICODE() { return '&#x25b2'; };
static get DOWN_ARROW_UNICODE() { return '&#x25bc'; };

  sortSelection : any;
  rows : any;
  _configObject : any;

  constructor(private fxService: FxService)
  {
    fxService.subscribeToUpdate(this._dataUpdateHandler.bind(this));
    this._configObject = fxService.getGridConfig();
    this.sortSelection = this._configObject.sortSelection; // hold a local copy of sort object
  }

  ngOnInit()
  {
    // initialise column headers and add click listeners  for the columns that are sortable
    let sortableHeaders = document.querySelectorAll('[data-columnName]');
    for(let i = 0; i < sortableHeaders.length; i++)
    {
      // add initial up or down sort icon to the sorted column
      if(sortableHeaders[i].getAttribute('data-columnName') === this._configObject.sortSelection.column)
      {
        if(this.sortSelection.ascending)
        {
          (sortableHeaders[i].getElementsByClassName("sort-button"))[0].innerHTML = GridComponent.UP_ARROW_UNICODE;
        }
        else
        {
          (sortableHeaders[i].getElementsByClassName("sort-button"))[0].innerHTML = GridComponent.DOWN_ARROW_UNICODE;
        }
      }

      // column header click handlers
      this._addHeaderClickHandler(sortableHeaders[i]);
    }
  }

  _dataUpdateHandler(data)
  {
    this.rows = data;
  }

  onClickSort()
  {
    this.fxService.sort({column: "data.column", ascending: true});
  }

  // click handler for column headings. Clear the existing sort icon, and either change sort direction
  // or change sorted column. Add in the correct sort icon, and then fire the event off so the model can sort the data
  _addHeaderClickHandler(sortableHeader)
  {
    sortableHeader.addEventListener('click', function(event) {
    // clear the sort arrow icons from all headers
      let sortableHeaders = document.querySelectorAll('[data-columnName]');
      for(let j = 0; j < sortableHeaders.length; j++)
      {
        (sortableHeaders[j].getElementsByClassName("sort-button"))[0].innerHTML = "";
      }

      // if we are clicking on the already selected column, toggle sort direction:
      let columnName = sortableHeader.getAttribute('data-columnName');
      if(columnName === this.sortSelection.column)
      {
        this.sortSelection.ascending = !this.sortSelection.ascending;
      }
      else
      {
        // if not toggling we are changing the selected column
        this.sortSelection.column = columnName;
      }
      // set the sort arrow icon on the clicked column
      if(this.sortSelection.ascending)
      {
        (sortableHeader.getElementsByClassName("sort-button"))[0].innerHTML = GridComponent.UP_ARROW_UNICODE;
      }
      else
      {
        (sortableHeader.getElementsByClassName("sort-button"))[0].innerHTML = GridComponent.DOWN_ARROW_UNICODE;
      }

      this.fxService.sort({column: columnName, ascending: this.sortSelection.ascending});
    }.bind(this), true);
  }

}
