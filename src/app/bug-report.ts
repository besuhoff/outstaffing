import { DevelopmentPoint } from './development-point';
import { Language } from './language';

export class BugReport {
  private _status: 'open'|'closed';

  public constructor(
    public readonly point: DevelopmentPoint,
    public readonly expectedLanguage: Language | null,
  ) {
    this._status = 'open';
  }

  public get status(): 'open'|'closed' {
    return this._status;
  }

  public close(): void {
    this._status = 'closed';
  }
}
