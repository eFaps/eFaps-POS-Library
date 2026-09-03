import { ChangeDetectorRef } from "@angular/core";
import { ConfigService } from "../services/config.service";
import { SecurePipe } from "./secure.pipe";
import { DomSanitizer } from "@angular/platform-browser";
import { HttpClient } from "@angular/common/http";
import { ImageService } from "../services/image.service";

describe("SecurePipe", () => {
  it("create an instance", () => {
    const pipe = new SecurePipe(
      {} as ChangeDetectorRef,
      {} as DomSanitizer,
      {} as ImageService,
      new ConfigService(
        {
          baseUrl: "urle",
          socketUrl: "url",
          defaultProdImg: "123",
        },
        {} as HttpClient,
      ),
    );
    expect(pipe).toBeTruthy();
  });
});
