import { DevelopmentField } from './development-field';
import { Developer } from './developer';
import { DevelopmentPoint } from './development-point';
import { FieldWorker } from './field-worker';
import { Tester } from './tester';
import { GameError } from './game-error';
import { Backlog } from './backlog';

export class Project {
  private _developmentField: DevelopmentField;
  private _backlog: Backlog;

  public constructor(
    public readonly name: string,
    public readonly field: DevelopmentField,
    private _complexity: number,
    private _deadline: Date,
    private _reward: number
  ) {
    field.useCache();
    this._developmentField = field.clone(false);
    this._developmentField.useCache();
    this._backlog = new Backlog(field);
  }

  public selectRandomPointByWorker(worker: FieldWorker): DevelopmentPoint {
    let allPoints: DevelopmentPoint[];
    let resultPoint: DevelopmentPoint;

    if (worker instanceof Developer) {
      allPoints = this.field.implementedPoints(worker.languages)
        .map((point: DevelopmentPoint) => this.developmentField.pointAt(point.x, point.y))
        .filter((point: DevelopmentPoint) => !point.isImplemented());
    } else if (worker instanceof Tester) {
      allPoints = [];

      for (let i: number = 0; i < this.developmentField.width; i++) {
        for (let j: number = 0; j < this.developmentField.height; j++) {
          if (this.developmentField.pointAt(i, j).isImplemented() || this.field.pointAt(i, j).isImplemented()) {
            allPoints.push(this.developmentField.pointAt(i, j));
          }
        }
      }
    } else {
      throw new GameError('Unknown type of worker');
    }

    if (allPoints.length) {
      resultPoint = allPoints[Math.floor(Math.random() * allPoints.length)];
    }

    if (resultPoint && worker instanceof Developer) {
      worker.chooseLanguage(this.field.pointAt(resultPoint.x, resultPoint.y).language);
    }
    return resultPoint;
  }

  public amountComplete(): number {
    return this.field.similarity(this.developmentField);
  }

  public get developmentField(): DevelopmentField {
    return this._developmentField;
  }

  public get backlog(): Backlog {
    return this._backlog;
  }
}
