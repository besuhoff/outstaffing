import { Language } from './language';
import { DevelopmentPoint } from './development-point';
import { DevelopmentField } from './development-field';
import { GameError } from './game-error';
import { FieldWorker } from './field-worker';
import { Backlog } from './backlog';
import { BugReport } from './bug-report';

export class Developer extends FieldWorker {
  private _queue: DevelopmentPoint[] = [];

  public constructor(name: string,
                     desiredSalary: number,
                     desiredSalaryDelta: number,
                     selfMotivation: number,
                     speed: number,
                     private _languages: Language[],
                     private _switchingProbability: number,
                     private _switchingProbabilityDelta: number,
  ) {
    super(name, desiredSalary, desiredSalaryDelta, selfMotivation, speed);
  }

  public work(): void {
    if (this._hasStarted()) {
      const pointsToBeMade: number = this._howManyPointsShouldBeMade();
      if (pointsToBeMade > 0) {
        this._logWork(pointsToBeMade);
        for (let i: number = 0; i < pointsToBeMade; i++) {
          // Try bugReports
          const bugReport: BugReport = Backlog.getInstance().findReportForDeveloper(this);
          if (bugReport) {
            bugReport.point.implement(bugReport.expectedLanguage);
            bugReport.close();
            continue;
          }

          // Try switching when stuck or when it's time to
          if (!this._queue.length || Math.random() <= this._switchingProbability) {
            const point: DevelopmentPoint = this._pickRandomPoint();
            if (point) {
              this._queue = [point];
            }
          }

          if (this._queue.length) {
            const point: DevelopmentPoint = this._queue.pop();
            point.implement(this._languages[0]);

            // Add neighbor points to queue
            const points: {x: number, y: number}[] = [
              {x: point.x + 1, y: point.y},
              {x: point.x - 1, y: point.y},
              {x: point.x, y: point.y + 1},
              {x: point.x, y: point.y - 1}
            ];

            const developmentField: DevelopmentField = this.project.developmentField;

            for (const dimensions of points) {
              if (
                developmentField.hasPointAt(dimensions.x, dimensions.y) &&
                this._queue.indexOf(developmentField.pointAt(dimensions.x, dimensions.y)) === -1 &&
                !developmentField.pointAt(dimensions.x, dimensions.y).isImplemented()
              ) {
                this._queue.unshift(this.project.developmentField.pointAt(dimensions.x, dimensions.y));
              }
            }
          }
        }
      }
    } else if (this.project) {
      const point: DevelopmentPoint = this._pickRandomPoint();
      if (!point && this._hasStarted()) {
        this._logStopWork();
      } else if (point) {
        this._queue = [point];
        this._logStartWork();
      }
    }
  }

  public knowsLanguage(language: Language): boolean {
    return this._languages.indexOf(language) !== -1;
  }

  public get languages(): Language[] {
    return this._languages;
  }
}
