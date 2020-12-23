import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { BarcodeOptions } from "../model";

@Injectable({
  providedIn: "root"
})
export class BarcodeScannerService {
  private currentSource = new BehaviorSubject<string>(null);
  barcode = this.currentSource.asObservable();

  private prevTime: number = 0;
  private code: string = "";

  private options = {
    latency: 50,
    minLength: 3,
    endKeys: ["Enter"],
    validKey: /^(\w|\d)$/
  };

  constructor() { }

  handleKeyboardEvent(event: KeyboardEvent): void {
    const { key, timeStamp } = event;
    const timeDiff = timeStamp - this.prevTime;
    this.prevTime = timeStamp;
    if (!(event.altKey || event.ctrlKey)) {
      const isValid = this.options.validKey.test(key);
      const isEndKey = this.options.endKeys.includes(key);
      if (timeDiff > this.options.latency) {
        // Maybe a normal key press or start of barcode
        if (!isEndKey && isValid) {
          this.code = key;
        } else this.code = "";
      } else if (isValid) {
        // Still scanning
        this.code += key;
      } else {
        if (isEndKey) {
          // End of barcode
          if (this.code.length >= this.options.minLength) {
            this.currentSource.next(this.code);
          }
        }
        // Invalid character, reset
        this.code = "";
      }
    }
  }

  setOptions(options: BarcodeOptions) {
    this.options = Object.assign(this.options, options);
  }

  getDefaultOptions(): BarcodeOptions {
    return {
      latency: 50,
      minLength: 3,
      endKeys: ["Enter"],
      validKey: /^(\w|\d)$/
    };
  }
}
