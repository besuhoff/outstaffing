import { OutstaffingPage } from './app.po';

describe('outstaffing App', function() {
  let page: OutstaffingPage;

  beforeEach(() => {
    page = new OutstaffingPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
