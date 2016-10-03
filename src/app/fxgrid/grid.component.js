System.register(['@angular/core', '../service/fx.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, fx_service_1;
    var GridComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (fx_service_1_1) {
                fx_service_1 = fx_service_1_1;
            }],
        execute: function() {
            GridComponent = (function () {
                function GridComponent(fxService) {
                    this.fxService = fxService;
                    fxService.subscribeToUpdate(this._dataUpdateHandler.bind(this));
                    this._configObject = fxService.getGridConfig();
                    this.sortSelection = this._configObject.sortSelection; // hold a local copy of sort object
                }
                Object.defineProperty(GridComponent, "UP_ARROW_UNICODE", {
                    get: function () { return '&#x25b2'; },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(GridComponent, "DOWN_ARROW_UNICODE", {
                    get: function () { return '&#x25bc'; },
                    enumerable: true,
                    configurable: true
                });
                ;
                GridComponent.prototype.ngOnInit = function () {
                    // initialise column headers and add click listeners  for the columns that are sortable
                    var sortableHeaders = document.querySelectorAll('[data-columnName]');
                    for (var i = 0; i < sortableHeaders.length; i++) {
                        // add initial up or down sort icon to the sorted column
                        if (sortableHeaders[i].getAttribute('data-columnName') === this._configObject.sortSelection.column) {
                            if (this.sortSelection.ascending) {
                                (sortableHeaders[i].getElementsByClassName("sort-button"))[0].innerHTML = GridComponent.UP_ARROW_UNICODE;
                            }
                            else {
                                (sortableHeaders[i].getElementsByClassName("sort-button"))[0].innerHTML = GridComponent.DOWN_ARROW_UNICODE;
                            }
                        }
                        // column header click handlers
                        this._addHeaderClickHandler(sortableHeaders[i]);
                    }
                };
                GridComponent.prototype._dataUpdateHandler = function (data) {
                    this.rows = data;
                };
                GridComponent.prototype.onClickSort = function () {
                    this.fxService.sort({ column: "data.column", ascending: true });
                };
                // click handler for column headings. Clear the existing sort icon, and either change sort direction
                // or change sorted column. Add in the correct sort icon, and then fire the event off so the model can sort the data
                GridComponent.prototype._addHeaderClickHandler = function (sortableHeader) {
                    sortableHeader.addEventListener('click', function (event) {
                        // clear the sort arrow icons from all headers
                        var sortableHeaders = document.querySelectorAll('[data-columnName]');
                        for (var j = 0; j < sortableHeaders.length; j++) {
                            (sortableHeaders[j].getElementsByClassName("sort-button"))[0].innerHTML = "";
                        }
                        // if we are clicking on the already selected column, toggle sort direction:
                        var columnName = sortableHeader.getAttribute('data-columnName');
                        if (columnName === this.sortSelection.column) {
                            this.sortSelection.ascending = !this.sortSelection.ascending;
                        }
                        else {
                            // if not toggling we are changing the selected column
                            this.sortSelection.column = columnName;
                        }
                        // set the sort arrow icon on the clicked column
                        if (this.sortSelection.ascending) {
                            (sortableHeader.getElementsByClassName("sort-button"))[0].innerHTML = GridComponent.UP_ARROW_UNICODE;
                        }
                        else {
                            (sortableHeader.getElementsByClassName("sort-button"))[0].innerHTML = GridComponent.DOWN_ARROW_UNICODE;
                        }
                        this.fxService.sort({ column: columnName, ascending: this.sortSelection.ascending });
                    }.bind(this), true);
                };
                GridComponent = __decorate([
                    core_1.Component({
                        selector: 'fx-grid',
                        moduleId: __moduleName,
                        templateUrl: 'grid.template.html',
                        providers: [fx_service_1.FxService]
                    }), 
                    __metadata('design:paramtypes', [fx_service_1.FxService])
                ], GridComponent);
                return GridComponent;
            }());
            exports_1("GridComponent", GridComponent);
        }
    }
});
//# sourceMappingURL=grid.component.js.map