import {
  ChangeDetectorRef,
  Injectable,
  OnDestroy,
  Pipe,
  PipeTransform,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { BehaviorSubject, Observable, Subscription } from "rxjs";

import { ConfigService } from "../services/config.service";
import { ImageService } from "../services/image.service";

@Injectable({
  providedIn: "root",
  deps: [ChangeDetectorRef, DomSanitizer, ImageService, ConfigService],
})
@Pipe({
  name: "secure",
  pure: false,
})
export class SecurePipe implements PipeTransform, OnDestroy {
  private static defaultImage = "assets/defaultProdImg.svg";
  private latestValue: any = null;
  private latestReturnedValue: any = null;
  private subscription: Subscription = null;
  private obj: Observable<any> = null;

  private previousUrl: string;
  private result: BehaviorSubject<any> = new BehaviorSubject(
    SecurePipe.defaultImage,
  );
  private resultObs: Observable<any> = this.result.asObservable();
  private internalSubscription: Subscription = null;

  constructor(
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private imageService: ImageService,
    config: ConfigService,
  ) {
    if (config.defaultProdImg) {
      SecurePipe.defaultImage = config.defaultProdImg;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.dispose();
    }
  }

  transform(_url: string): any {
    if (_url === "null") {
      return SecurePipe.defaultImage;
    }
    const obj = this.internalTransform(_url);
    return this.asyncTrasnform(obj);
  }

  private internalTransform(_url: string): Observable<any> {
    if (!_url) {
      return this.resultObs;
    }

    if (this.previousUrl !== _url) {
      this.previousUrl = _url;
      this.internalSubscription = this.imageService
        .loadImage(_url)
        .subscribe((m) => {
          const sanitized = this.sanitizer.bypassSecurityTrustUrl(m);
          this.result.next(sanitized);
        });
    }
    return this.resultObs;
  }

  private asyncTrasnform(_obj: Observable<any>): any {
    if (!this.obj) {
      if (_obj) {
        this._subscribe(_obj);
      }
      this.latestReturnedValue = this.latestValue;
      return this.latestValue;
    }
    if (_obj !== this.obj) {
      this.dispose();
      return this.asyncTrasnform(_obj);
    }
    if (this.latestValue === this.latestReturnedValue) {
      return this.latestReturnedValue;
    }
    this.latestReturnedValue = this.latestValue;
    // maybe clone?
    return this.latestValue;
  }

  private _subscribe(_obj: Observable<any>) {
    const _this = this;
    this.obj = _obj;

    this.subscription = _obj.subscribe({
      next: function (value) {
        return _this._updateLatestValue(_obj, value);
      },
      error: (e: any) => {
        throw e;
      },
    });
  }

  private dispose() {
    this.subscription.unsubscribe();
    if (this.internalSubscription) {
      this.internalSubscription.unsubscribe();
      this.internalSubscription = null;
    }
    this.latestValue = null;
    this.latestReturnedValue = null;
    this.subscription = null;
    this.obj = null;
  }

  private _updateLatestValue(_async: any, _value: Object) {
    if (_async === this.obj) {
      this.latestValue = _value;
      this.ref.markForCheck();
    }
  }
}
