import { SecurePipe } from "./secure.pipe";
import { ConfigService } from "../services/config.service";

describe("SecurePipe", () => {
  it("create an instance", () => {
    const pipe = new SecurePipe(
      null,
      null,
      null,
      new ConfigService({
        baseUrl: "urle",
        socketUrl: "url",
        defaultProdImg: "123"
      }, null)
    );
    expect(pipe).toBeTruthy();
  });
});
