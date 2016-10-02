import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GridComponent } from './fxgrid/grid.component';
import { PriceFeed } from './service/pricefeed.service';
import { Sparkline } from './fxgrid/sparkline.component';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ GridComponent,
                  Sparkline ],
  providers:    [ PriceFeed ],
  bootstrap:    [ GridComponent ]
})

export class AppModule { }
