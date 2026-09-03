import { HttpParameterCodec, HttpParams } from "@angular/common/http";

export class SafeHttpParams extends HttpParams {
  constructor(
    fromObject?: {
      [param: string]:
        | string
        | number
        | boolean
        | ReadonlyArray<string | number | boolean>
        | null
        | undefined;
    },
    codec?: HttpParameterCodec,
  ) {
    // Clean the initial object before passing it to super()
    const cleanedObject = fromObject
      ? SafeHttpParams.removeNullOrUndefined(fromObject)
      : {};
    super({ fromObject: cleanedObject, encoder: codec });
  }
  // Override set to block undefined or null values
  override set(param: string, value: any): HttpParams {
    if (value === null || value === undefined) {
      return this;
    }
    return super.set(param, value);
  }

  // Helper method to filter out null/undefined from objects
  private static removeNullOrUndefined(obj: any): any {
    const cleaned: any = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== null && obj[key] !== undefined) {
        cleaned[key] = obj[key];
      }
    });
    return cleaned;
  }
}
