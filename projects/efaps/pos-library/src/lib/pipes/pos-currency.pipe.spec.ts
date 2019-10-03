import { PosCurrencyPipe } from './pos-currency.pipe';
import { UtilsService } from './utils.service';

describe('PosCurrencyPipe', () => {
  it('create an instance', () => {
    const pipe = new PosCurrencyPipe(new UtilsService());
    expect(pipe).toBeTruthy();
  });
});
