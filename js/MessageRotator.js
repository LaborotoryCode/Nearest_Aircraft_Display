import { MESSAGES, MESSAGE_INTERVAL, TOTAL_TRANSITION } from './constants.js';

export class MessageRotator {
  constructor(board) {
    this.board = board;
    this.messages = [];
    this.currentIndex = -1;
    this._timer = null;
    this._paused = false;

    // Poll for flight data every 15 seconds
    this._loadFlight();
    setInterval(() => this._loadFlight(), 15000);
  }

  async _loadFlight() {
    try {
      const res = await fetch('/latest_flight.json');
      if (!res.ok) return;
      const f = await res.json();
      console.log('Flight loaded:', f);  // add this

      const flightMsg = [
        ' ',
        f.callsign || '',
        f.aircraft || ' ',
        `${f.origin || '?'} -> ${f.destination || '?'}`,
        `ALT  ${f.altitude_ft ?? '?'}FT`,  
        `VELO ${f.speed_knots ?? '?'}KTS`,
        `${f.distance_km?.toFixed(1) ?? '?'} KM AWAY`,
      ];

      const changed = JSON.stringify(flightMsg) !== JSON.stringify(this.messages[0]);
      this.messages = [flightMsg, ...MESSAGES];

      // If flight data changed and it's currently showing, refresh immediately
      if (changed && this.currentIndex === 0) {
        this.board.displayMessage(this.messages[0]);
      }
    } catch {
      this.messages = [...MESSAGES];
    }
  }

  async start() {
    await this._loadFlight();  // wait for flight data first
    this.next();
    this._timer = setInterval(() => {
      if (!this._paused && !this.board.isTransitioning) {
        this.next();
      }
    }, MESSAGE_INTERVAL + TOTAL_TRANSITION);
  }

  stop() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.messages.length;
    this.board.displayMessage(this.messages[this.currentIndex]);
    this._resetAutoRotation();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.messages.length) % this.messages.length;
    this.board.displayMessage(this.messages[this.currentIndex]);
    this._resetAutoRotation();
  }

  _resetAutoRotation() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = setInterval(() => {
        if (!this._paused && !this.board.isTransitioning) {
          this.next();
        }
      }, MESSAGE_INTERVAL + TOTAL_TRANSITION);
    }
  }
}