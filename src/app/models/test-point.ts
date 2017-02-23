import { Point } from './point';
import { BugReport } from './bug-report';

export class TestPoint extends Point {
  private _bugReport: BugReport | null = null;

  public cover(bugReport: BugReport): void {
    this._bugReport = bugReport;
  }

  public get bugReport(): BugReport {
    return this._bugReport;
  }

  public get status(): string {
    return this._bugReport ? this._bugReport.status : '';
  }
}
