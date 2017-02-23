import { DevelopmentPoint } from './development-point';
import { Figure } from './figure';
import { Point } from './point';
import { DevelopmentFigure } from './development-figure';
import { Language } from './language';
import { GameError } from './game-error';
import { Field } from './field';

export class DevelopmentField extends Field<DevelopmentPoint> {
  protected _figures: DevelopmentFigure[] = [];
  protected _implementedPoints: {[option: string]: DevelopmentPoint[]} = {};
  private _usesCache: boolean = false;

  public static createFigureContainer(figures: Figure[]): DevelopmentField {
    let x: number = 0;
    let y: number = 0;

    figures.forEach((figure: DevelopmentFigure) => figure.points.forEach((point: Point) => {
      if (point.x > x) {
        x = point.x;
      }

      if (point.y > y) {
        y = point.y;
      }
    }));
    // Width of a line is 1 px so add extra space for that
    return new DevelopmentField(Math.ceil(x + 1), Math.ceil(y + 1));
  }

  public useCache(useCache: boolean = true): void {
    this._usesCache = useCache;
  }

  public drawFigure(figure: DevelopmentFigure): void {
    const field: DevelopmentField = this.clone(false);

    figure.points.forEach((point: Point, index: number) => {
      field.drawLine(point, figure.points[(index + 1) % figure.points.length], figure.language);
    });

    field.floodFill(figure.fillPoint, figure.language);

    this.merge(field);
    this._figures.push(figure);
  }

  public floodFill(fillPoint: Point, language: Language): void {
    const stack: Point[] = [fillPoint];

    while (stack.length) {
      const point: Point = stack.pop();
      const x: number = Math.floor(point.x);
      const y: number = Math.floor(point.y);
      if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
        this._points[x][y].implement(language);

        const points: {x: number, y: number}[] = [{x: x + 1, y}, {x: x - 1, y}, {x, y: y + 1}, {x, y: y - 1}];

        for (const dimensions of points) {
          if (
            this.hasPointAt(dimensions.x, dimensions.y) &&
            stack.indexOf(this._points[dimensions.x][dimensions.y]) === -1 &&
            !this._points[dimensions.x][dimensions.y].isImplemented()
          ) {
            stack.push(this._points[dimensions.x][dimensions.y]);
          }
        }
      }
    }
  }

  public drawLine(a: Point, b: Point, language: Language): void {
    const i0: number = Math.floor(a.x);
    const j0: number = Math.floor(a.y);
    const i1: number = Math.floor(b.x);
    const j1: number = Math.floor(b.y);

    if (Math.abs(i1 - i0) >= Math.abs(j1 - j0)) {
      for (
        let i: number = i0;
        ((i1 - i0 >= 0) && i <= i1) || (((i1 - i0 < 0) && i > i1));
        i += ((i1 - i0 > 0) ? 1 : -1)
      ) {
        const j: number = Math.floor(j0 + (j1 - j0) * ((i - i0) / (i1 - i0)));
        this._points[i][j].implement(language);
      }
    } else {
      for (
        let j: number = j0;
        ((j1 - j0 >= 0) && j <= j1) || (((j1 - j0 < 0) && j > j1));
        j += ((j1 - j0 > 0) ? 1 : -1)
      ) {
        const i: number = Math.floor(i0 + (i1 - i0) * ((j - j0) / (j1 - j0)));
        this._points[i][j].implement(language);
      }
    }
  }

  public merge(field: DevelopmentField): void {
    for (let i: number = 0; i < field.width; i++) {
      for (let j: number = 0; j < field.height; j++) {
        if (field.pointAt(i, j).isImplemented()) {
          this.pointAt(i, j).implement(field.pointAt(i, j).language);
        }
      }
    }
  }

  public drawFigures(figures: DevelopmentFigure[]): void {
    figures.forEach((figure: DevelopmentFigure) => {
      this.drawFigure(figure);
    });
  }

  public clone(cloneFigures: boolean): DevelopmentField {
    const field: DevelopmentField = new DevelopmentField(this._width, this._height);

    if (cloneFigures && this._figures.length) {
      field.drawFigures(this._figures);
    }

    return field;
  }

  public implementPoint(point: DevelopmentPoint, language: Language | null) {
    if (language !== point.language) {
      if (this._usesCache) {
        let cache: DevelopmentPoint[];
        let index: number;

        if (language) {
          cache = this._implementedPoints[language.name];
          if (cache) {
            index = cache.indexOf(point);
            if (index !== -1) {
              cache.splice(index, 1);
            }
          }
        }

        cache = this._implementedPoints[''];
        if (cache && !language) {
          index = cache.indexOf(point);
          if (index !== -1) {
            cache.splice(index, 1);
          }
        }

        if (cache && !point.language) {
          cache.push(point);
        }

        if (point.language) {
          cache = this._implementedPoints[point.language.name];
          if (cache) {
            cache.push(point);
          }
        }
      }

      point.implement(language);
    }
  }

  public implementedPoints(languages: Language[] = []): DevelopmentPoint[] {
    if (this._usesCache) {
      let points: DevelopmentPoint[] = [];

      if (languages.length) {
        languages.forEach((language: Language) => {
          if (!this._implementedPoints[language.name]) {
            this._implementedPoints[language.name] = this._implementedPointsNoCache([language]);
          }

          points = points.concat(this._implementedPoints[language.name]);
        });
      } else {
        if (!this._implementedPoints['']) {
          this._implementedPoints[''] = this._implementedPointsNoCache();
        }

        points = this._implementedPoints[''];
      }

      return points;
    } else {
      return this._implementedPointsNoCache(languages);
    }
  }

  public similarity(field: DevelopmentField): number {
    if (field.width !== this.width || field.height !== this.height) {
      throw new GameError(
        `Fields are of not equal dimensions: ${field.width}x${field.height} vs ${this.width}x${this.height}`
      );
    } else {
      let similarPoints: number = 0;

      for (let i: number = 0; i < this.width; i++) {
        for (let j: number = 0; j < this.height; j++) {
          if (this._points[i][j].language === field.pointAt(i, j).language) {
            similarPoints++;
          }
        }
      }

      return similarPoints / (this.width * this.height);
    }
  }

  protected _createPoint(x: number, y: number): DevelopmentPoint {
    return new DevelopmentPoint(x, y);
  };

  protected _implementedPointsNoCache(languages: Language[] = []): DevelopmentPoint[] {
    let allPoints: DevelopmentPoint[] = this._flatPoints;

    if (languages.length) {
      allPoints = allPoints.filter((point: DevelopmentPoint) => languages.indexOf(point.language) !== -1);
    } else {
      allPoints = allPoints.filter((point: DevelopmentPoint) => point.isImplemented());
    }

    return allPoints;
  }
}
