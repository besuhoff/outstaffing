import { DevelopmentField } from './development-field';
import { Language } from './language';
import { Developer } from './developer';
import { DevelopmentPoint } from './development-point';
import { FieldWorker } from './field-worker';
import { Tester } from './tester';
import { GameError } from './game-error';

export class Project {
  private _developmentField: DevelopmentField;

  public constructor(
    public readonly name: string,
    public readonly field: DevelopmentField,
    private _complexity: number,
    private _deadline: Date,
    private _reward: number
  ) {
    this._developmentField = field.clone(false);
  }

  public selectRandomPointByWorker(worker: FieldWorker): DevelopmentPoint {
    let allPoints: DevelopmentPoint[];
    let resultPoint: DevelopmentPoint;

    if (worker instanceof Developer) {
      allPoints = this.field.implementedPoints(worker.languages)
        .map((point: DevelopmentPoint) => this.developmentField.pointAt(point.x, point.y))
        .filter((point: DevelopmentPoint) => !point.isImplemented());
    } else if (worker instanceof Tester) {
      allPoints = this.developmentField.implementedPoints();

      allPoints = allPoints.concat(
        this.field.implementedPoints()
          .map((point: DevelopmentPoint) => this.developmentField.pointAt(point.x, point.y))
          .filter((point: DevelopmentPoint) => allPoints.indexOf(point) === -1)
      );
    } else {
      throw new GameError('Unknown type of worker');
    }

    if (allPoints.length) {
      resultPoint = allPoints[Math.floor(Math.random() * allPoints.length)];
    }
    return resultPoint;
  }

  public amountComplete(): number {
    return this.field.similarity(this.developmentField);
  }

  public get developmentField(): DevelopmentField {
    return this._developmentField;
  }
}
