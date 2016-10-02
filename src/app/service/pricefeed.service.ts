import { Injectable } from '@angular/core';

/*
  mock proce feed. Todo, hook this up to a server via websocket
*/
export class PriceFeed {
  _subscribers : any[];
  currencies : any[];
  internal : any;
  publicData : any;
  data : any;

  constructor() {
    this._subscribers = [];
    this._initMockData();
    this._startDataFeed();
  }

  //TODO: replace with RXJS observable
  subscribeToUpdate(callback)
  {
    this._subscribers.push(callback);
  }

  _initMockData()
  {
    const startPrices = {
      gbpusd: 1.3587,
      gbpeur: 1.268,
      gbpaud: 1.1163,
      usdeur: 0.472,
      gbpjpy: 144.19,
      usdjpy: 98.414,
      eurjpy: 120.11,
      gbpchf: 1.5467,
      euraud: 1.3883,
      eurchf: 1.0019,
      eurcad: 1.6229,
      gbpcad: 1.2111
    }

    this.currencies = Object.keys(startPrices)
    this.publicData = {};
    this.internal = {};

    for (let ccy in startPrices) {
      const spread = Math.random() * 0.05;
      const mid = startPrices[ccy];
      this.internal[ccy] = mid;
      this.publicData[ccy] = {
        name: ccy,
        bestBid: mid - mid * (spread / 2),
        bestAsk: mid + mid * (spread / 2),
        openBid: mid - mid * (spread / 2),
        openAsk: mid + mid * (spread / 2),
        lastChangeAsk: 0,
        lastChangeBid: 0
      }
    }
  }

  _startDataFeed()
  {
    setInterval( () => {
        for (let i = 0; i < Math.random() * 5; i++) {
          const randomCurrency = this.currencies[Math.floor(Math.random() * this.currencies.length)];
          const mid = this.internal[randomCurrency];
          const spread = Math.random() * 0.05;
          const diff = (Math.random() * 0.08 - 0.04) * mid;
          const newMid = (mid + diff);
          const bid = newMid - newMid * (spread / 2);
          const ask = newMid + newMid * (spread / 2);
          this.data = this.publicData[randomCurrency];
          this.data.lastChangeBid = bid - this.data.bestBid;
          this.data.lastChangeAsk = ask - this.data.bestAsk;
          this.data.bestBid = bid;
          this.data.bestAsk = ask;
        }

        for ( let i = 0; i < this._subscribers.length; i++)
        {
          this._subscribers[i](this.data);
        }
      }, 1000);
  }

}
