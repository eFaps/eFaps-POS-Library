import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { describe, expect, it } from "vitest";
import { ConfigService } from "../services/config.service";
import { ImageService } from "../services/image.service";
import { SecurePipe } from "./secure.pipe";
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
