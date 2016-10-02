import { Component, Input } from '@angular/core';

@Component({
  selector: 'sparkline',
  template: `<svg width="100" height="20">
              <polyline
                 fill="none"
                 stroke="#1605EB"
                 stroke-width="1"
                 attr.points="{{coordsArray}}"/>
            </svg>`

})

export class Sparkline
{
  @Input()
  dataString : string;

  coordsArray : any;

  constructor()
  {
  }

  ngOnInit()
  {
    this._computeSparklinePoints();
  }

  ngOnChanges()
  {
    this._computeSparklinePoints();
  }

  // sparkline has a series of co-ords given to it to draw
  _computeSparklinePoints()
  {
    let arr = this.dataString.split(',');
    //TODO: xMax, yMax, same as values hardwired in the template for width, height... better to pass these through from parent container
    let xMax = 100;
    let yMax = 20;
    if(arr.length < 2)
    {
      // if we don't have enough data yet, the sparkline is a flatline
      this.coordsArray = "0," + Math.floor(yMax/2) + " " + xMax +"," + Math.floor(yMax/2);
    }
    else
    {
      // first rescale the array to get relative values for the y-axis
      let yValueArray = this._rescaleArrayToRange(0, yMax, arr);
        // then generate svg coordinates fom the yValueArray
      this.coordsArray = this._convertDataArrayToSVGCoords(xMax, yValueArray);
    }
  }

  _rescaleArrayToRange(rangeMin, rangeMax, array)
  {
    // find the min & max values in the array
    let min = Math.min(...array);
    let max = Math.max(...array);
    // algorithm: newVal = (newMax - newMin)/(max-min)*(value-max)+newMax
    return array.map(value =>
      Math.round((rangeMax - rangeMin) / (max - min) * (value - max) + rangeMax)
    );
  }

  /**
  * Given an array of y-axis data, convert each element to a co-ordinate by computing
  * the x values, over a simple linear range. For simplicity assume the min of the
  * range is zero.
  **/
  _convertDataArrayToSVGCoords(rangeMax, yValueArray)
  {
    // first derive the x values from the values in the array against the range [0 - rangeMax]
    // eg, given [3, 6, 2] and a rangeMax of 100, we want : [[0,3],[50,6],[100,2]]
    let coordsArray = yValueArray.map((value, index, yValueArray) => {
      let xCoord = Math.round(rangeMax / (yValueArray.length - 1) * index);
      return [xCoord, value];
    });
    // and finally convert the array to the format required by the svg element, a space-
    // seperated series of x,y pairs, eg: "0,10 50,12 100,20"
    return coordsArray.join(" ");
  }

}
