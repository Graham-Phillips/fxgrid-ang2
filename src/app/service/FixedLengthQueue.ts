/**
* Uses an array as a simple queue.
* holds up to MAX_DEPTH elements. Once MAX_DEPTH is reached, oldest element
* is discarded as new is added
**/

export class FixedLengthQueue {

  _maxDepth : number;
  _queue : Object[];

  constructor(initialValue, maxDepth=100){
    this._maxDepth = maxDepth;
    this.initialise();
    if(initialValue !== null && initialValue !== undefined)
    {
      this.add(initialValue);
    }
  }

  add(value) {
    this._queue.push(value);
    if(this._queue.length > this._maxDepth) {
      this._queue.shift(); // oldest element is at the beginning of array, discard it
    }
  }

  getCurrent() {
    return this._queue[this._queue.length - 1]; // current element is the last
  }

  getAll() {
    return this._queue.slice(0); // return a copy of the array, avoid external manipulation
                                // would need deep copy implementation for objects
  }

  toString() {
    return this._queue.join();
  }

  initialise() {
    this._queue = [];
  }

}
