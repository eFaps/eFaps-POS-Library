import { ConfigService } from "../services/config.service";
import { SecurePipe } from "./secure.pipe";

describe("SecurePipe", () => {
  it("create an instance", () => {
    const pipe = new SecurePipe(
      null,
      null,
      null,
      new ConfigService(
        {
          baseUrl: "urle",
          socketUrl: "url",
          defaultProdImg: "123",
        },
        null,
      ),
    );
    expect(pipe).toBeTruthy();
  });
});
