import { BugReport } from './bug-report';
import { Language } from './language';
import { DevelopmentPoint } from './development-point';
import { Developer } from './developer';
export class Backlog {
  private static _instance: Backlog;
  private _queue: BugReport[] = [];

  private constructor() {}

  public static getInstance(): Backlog {
    if (!this._instance) {
      this._instance = new Backlog();
    }

    return this._instance;
  }

  public reportBug(point: DevelopmentPoint, expectedLanguage: Language | null): void {
    this._queue.push(new BugReport(point, expectedLanguage));
  }

  public findReportForDeveloper(developer: Developer): BugReport {
    return this._queue
      .filter((bugReport: BugReport) => {
        return bugReport.status === 'open' &&
          (developer.knowsLanguage(bugReport.expectedLanguage) ||
          (developer.knowsLanguage(bugReport.point.language) && bugReport.expectedLanguage === null));
    })[0];
  }

  public length(status?: 'open'|'closed'): number {
    let queue: BugReport[] = this._queue;
    if (status) {
      queue = queue.filter((bugReport: BugReport) => bugReport.status === status);
    }

    return queue.length;
  }
}
