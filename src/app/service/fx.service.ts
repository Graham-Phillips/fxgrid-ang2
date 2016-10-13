import { Injectable } from '@angular/core';
import { PriceFeed } from './pricefeed.service';
import { FixedLengthQueue } from './FixedLengthQueue'
import { MarketRecord } from './MarketRecord';

@Injectable()
export class FxService {

  static get YEN_DECIMAL_PLACES() { return 2; };
  static get NON_YEN_DECIMAL_PLACES() { return 4; };
  static get MARKET_NAME_SEPERATOR_CHAR() { return '/'; };
  static get MAX_PRICE_QUEUE_DEPTH() { return 30; }; // hold the n most recent values

  // flags to indicate which market record has updated
  static get DATA_UPDATE_FLAG() { return 'U'; };
  static get DATA_NOT_UPDATE_FLAG() { return ''; };

  _marketDataArray : MarketRecord[];
  _subscribers : any[];
  _sortSelection : any;

  constructor(private priceFeed: PriceFeed)
  {
    this._marketDataArray = [];
    this._subscribers = [];
    // _sortSelection is an object that indicates which column we are sorting on, and direction of sort
    this._sortSelection = {column: 'marketName', ascending: true};

    priceFeed.subscribeToUpdate(this._priceFeedUpdateHandler.bind(this));
  }

  /**
  * gets any configuration data needed to initialise the grid view
  **/
  getGridConfig()
  {
    return {sortSelection: this._sortSelection};
  }

//TODO: replace with RXJS observable
  subscribeToUpdate(callback)
  {
    this._subscribers.push(callback);
  }

  sort(data)
  {console.log("sort: " + data.column);
    this._sortSelection = {column: data.column, ascending: data.ascending};
    this._sortMarketData();
    this._dispatchMarketData();
  }

  _priceFeedUpdateHandler(data)
  {
    this._processMarketData (data);
    this._sortMarketData();
    this._dispatchMarketData();
  }

  /**
  * Update the _marketDataArray with the new data
  **/
  _processMarketData (marketData)
  {

    let marketLocated = false;
    for ( let i = 0; i < this._marketDataArray.length; i++)
    {
      this._marketDataArray[i].updateFlag = FxService.DATA_NOT_UPDATE_FLAG; // clear update flag on existing record
      if(this._marketDataArray[i].marketName === marketData.name) // found matching record
      {
        marketLocated = true;
        // update the data items
        this._marketDataArray[i].bestBid = this._formatValue(marketData["name"], marketData["bestBid"]); // purely for sorting
        this._marketDataArray[i].bestAsk = this._formatValue(marketData["name"], marketData["bestAsk"]); // purely for sorting
        this._marketDataArray[i].lastChangeAsk = this._formatValue(marketData["name"], marketData["lastChangeAsk"]);
        this._marketDataArray[i].lastChangeBid = this._formatValue(marketData["name"], marketData["lastChangeBid"]);
        this._marketDataArray[i].bestBidsQueue.add( this._formatValue(marketData["name"], marketData["bestBid"]));
        this._marketDataArray[i].bestAsksQueue.add( this._formatValue(marketData["name"], marketData["bestAsk"]));
        let midPrice = (this._marketDataArray[i].bestBid + this._marketDataArray[i].bestAsk) / 2;
        this._marketDataArray[i].midPriceQueue.add(midPrice);
        this._marketDataArray[i].updateFlag = FxService.DATA_UPDATE_FLAG;  // the view uses this to know which row has updated
      }
    }

    if(!marketLocated)
    {
      // we didn't find an element for this fx pair, create a new one
      this._createNewMarketRecord(marketData);
    }
  }

  _createNewMarketRecord (marketData)
  {
    let newMarketRecord = new MarketRecord;
    newMarketRecord.marketName = marketData.name;   // (assumed) unique key
    newMarketRecord.displayName = this._formatMarketName(marketData.name);
    // best bids and asks are stored in queues so we can display historical data
    newMarketRecord.bestBid = this._formatValue(marketData["name"], marketData["bestBid"]); // purely for sorting
    newMarketRecord.bestAsk = this._formatValue(marketData["name"], marketData["bestAsk"]); // purely for sorting
    newMarketRecord.lastChangeBid = this._formatValue(marketData["name"], marketData["lastChangeBid"]);
    newMarketRecord.lastChangeAsk = this._formatValue(marketData["name"], marketData["lastChangeAsk"]);
    newMarketRecord.bestBidsQueue = new FixedLengthQueue(this._formatValue(marketData["name"], marketData["bestBid"]), FxService.MAX_PRICE_QUEUE_DEPTH);
    newMarketRecord.bestAsksQueue = new FixedLengthQueue(this._formatValue(marketData["name"], marketData["bestAsk"]), FxService.MAX_PRICE_QUEUE_DEPTH);
    let midPrice = (newMarketRecord.bestBid + newMarketRecord.bestAsk) / 2;
    newMarketRecord.midPriceQueue = new FixedLengthQueue(midPrice, FxService.MAX_PRICE_QUEUE_DEPTH);
    newMarketRecord.updateFlag = FxService.DATA_UPDATE_FLAG;  // the view uses this to know which row has updated
    this._marketDataArray.push(newMarketRecord);
  }

  // send the data to the view for display
  _dispatchMarketData()
  {
    for ( let i = 0; i < this._subscribers.length; i++)
    {
      if (typeof this._subscribers[i] === 'function')
      {
        this._subscribers[i](this._marketDataArray);
      }
    }
  }

  /**
  * Sort the _marketDataArray according to the _sortSelection object
  **/
  _sortMarketData()
  {
    if(this._marketDataArray.length >=1)
    {
      // test the item we are sorting on to see if it is a numeric sort
      if(this._isNumber(this._marketDataArray[0][this._sortSelection.column]))
      {
        this._marketDataArray.sort((a, b) => {
          if(this._sortSelection.ascending)
          {
            return a[this._sortSelection.column] - b[this._sortSelection.column];
          }
          else
          {
            return b[this._sortSelection.column] - a[this._sortSelection.column];
          }
        });
      }
      else
      {
        //  sort alpha
        this._marketDataArray.sort((a, b) => {
            if( a[this._sortSelection.column] < b[this._sortSelection.column])
            {
              return(this._sortSelection.ascending ? -1 : 1);
            }
            else
            if( a[this._sortSelection.column] > b[this._sortSelection.column])
            {
              return(this._sortSelection.ascending ? 1 : -1);
            }
            else
            {
              return 0;
            }
        });
      }
    }
  }

    /* util helper to determine if value is a number. Move to a utils package in non-trivial system */
  _isNumber(value : any) : boolean
  {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  // simple value formatter, rounds the value at a given decimal place given the market
  _formatValue(marketName : string, value : string) : number
  {
    if(/jpy/.test(marketName.toLowerCase()))
    {
      // yen, 2 d.p.
      return parseFloat(parseFloat(value).toFixed(FxService.YEN_DECIMAL_PLACES));
    }
    else
    {
      // all others
      return parseFloat(parseFloat(value).toFixed(FxService.NON_YEN_DECIMAL_PLACES));
    }
  }

  // simple name formatter, assumes name is 2 pairs of 3 chars
  _formatMarketName(marketName : string) : string
  {
    let formattedName = marketName.toUpperCase();
    // if the name wasn't in the expected format, just return the uppercased chars
    if(formattedName.length === 6)
    {
      formattedName = formattedName.substr(0, 3) + FxService.MARKET_NAME_SEPERATOR_CHAR + formattedName.substr(3, 3);
    }
    return formattedName;
  }

}
