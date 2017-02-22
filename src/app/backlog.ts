import { BugReport } from './bug-report';
import { Language } from './language';
import { DevelopmentPoint } from './development-point';
import { Developer } from './developer';
import { DevelopmentField } from './development-field';
import { TestField } from './test-field';

export class Backlog {
  private _queue: BugReport[] = [];
  private _field: TestField;

  public constructor(field: DevelopmentField) {
    this._field = TestField.fromDevelopmentField(field);
  }

  public reportBug(point: DevelopmentPoint, expectedLanguage: Language | null): void {
    const bugReport: BugReport = new BugReport(point, expectedLanguage);
    this._queue.push(bugReport);
    this._field.pointAt(point.x, point.y).cover(bugReport);
  }

  public findReportForDeveloper(developer: Developer): BugReport {
    return this._queue
      .filter((bugReport: BugReport) => {
        return (developer.knowsLanguage(bugReport.expectedLanguage) ||
          (developer.knowsLanguage(bugReport.point.language) && bugReport.expectedLanguage === null));
    })[0];
  }

  public closeReport(bugReport: BugReport): void {
    const index: number = this._queue.indexOf(bugReport);
    bugReport.close();
    this._queue.splice(index, 1);
  }

  public get length(): number {
    return this._queue.length;
  }

  public get field(): TestField {
    return this._field;
  }
}
