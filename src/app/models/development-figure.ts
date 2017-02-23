import { Point } from './point';
import { Language } from './language';
import { Figure } from './figure';

export class DevelopmentFigure extends Figure {
  public constructor(
    points: Point[],
    fillPoint: Point,
    protected _language: Language
  ) {
    super (points, fillPoint);
  }

  public static fromFigure(figure: Figure, language: Language): DevelopmentFigure {
    return new DevelopmentFigure(figure.points, figure.fillPoint, language);
  }

  public get language(): Language {
    return this._language;
  }
}
