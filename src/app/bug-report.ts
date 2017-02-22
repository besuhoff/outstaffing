import { DevelopmentPoint } from './development-point';
import { Language } from './language';

export class BugReport {
  private static _index: number = 0;
  private _index: number;
  private _status: 'open'|'closed';

  public constructor(
    public readonly point: DevelopmentPoint,
    public readonly expectedLanguage: Language | null,
  ) {
    BugReport._index++;
    this._index = BugReport._index;
    this._status = 'open';
  }

  public get status(): 'open'|'closed' {
    return this._status;
  }

  public get index(): number {
    return this._index;
  }

  public close(): void {
    this._status = 'closed';
  }
}
