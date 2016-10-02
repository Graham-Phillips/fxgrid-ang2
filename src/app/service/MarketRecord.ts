
import { FixedLengthQueue } from './FixedLengthQueue'

export class MarketRecord {
  marketName : string;
  displayName : string;
  bestBid : number;
  bestAsk : number;
  lastChangeBid : number;
  lastChangeAsk : number;
  bestBidsQueue : FixedLengthQueue;
  bestAsksQueue : FixedLengthQueue;
  midPriceQueue : FixedLengthQueue;
  updateFlag : string;

  constructor()
  {
  }

}
