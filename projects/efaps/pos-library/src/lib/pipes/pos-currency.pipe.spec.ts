import { UtilsService } from "../services/utils.service";
import { PosCurrencyPipe } from "./pos-currency.pipe";

describe("PosCurrencyPipe", () => {
  it("create an instance", () => {
    const pipe = new PosCurrencyPipe(new UtilsService());
    expect(pipe).toBeTruthy();
  });
});
