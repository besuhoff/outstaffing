import { DevelopmentPoint } from './development-point';
import { Figure } from './figure';
import { Point } from './point';
import { DevelopmentFigure } from './development-figure';
import { Language } from './language';

export class DevelopmentField {
  protected _points: DevelopmentPoint[][];
  protected _figures: DevelopmentFigure[] = [];

  public constructor(
    protected _width: number,
    protected _height: number,
  ) {
    this._points = [];
    for (let i: number = 0; i < _width; i++) {
      this._points[i] = [];

      for (let j: number = 0; j < _height; j++) {
        this._points[i].push(new DevelopmentPoint(i, j));
      }
    }
  }

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

  public drawFigure(figure: DevelopmentFigure): void {
    const field: DevelopmentField = this.clone(false);

    figure.points.forEach((point: Point, index: number) => {
      field.drawLine(point, figure.points[(index + 1) % figure.points.length], figure.language);
    });

    field.floodFill(figure.fillPoint, figure.language);

    this.merge(field);
    this._figures.push(figure);
  }

  public floodFill(fillPoint: Point, language: Language) {
    const stack: Point[] = [fillPoint];

    while (stack.length) {
      const point: Point = stack.pop();
      const x: number = Math.round(point.x);
      const y: number = Math.round(point.y);
      if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
        this._points[x][y].implement(language);

        const points: {x: number, y: number}[] = [{x: x + 1, y}, {x: x - 1, y}, {x, y: y + 1}, {x, y: y - 1}];

        for (const dimensions of points) {
          if (
            dimensions.x >= 0 &&
            dimensions.y >= 0 &&
            dimensions.x < this.width &&
            dimensions.y < this.height &&
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
    const i0: number = Math.round(a.x);
    const j0: number = Math.round(a.y);
    const i1: number = Math.round(b.x);
    const j1: number = Math.round(b.y);

    if (Math.abs(i1 - i0) >= Math.abs(j1 - j0)) {
      for (
        let i: number = i0;
        ((i1 - i0 >= 0) && i < i1) || (((i1 - i0 < 0) && i > i1));
        i += ((i1 - i0 > 0) ? 1 : -1)
      ) {
        const j: number = Math.round(j0 + (j1 - j0) * ((i - i0) / (i1 - i0)));
        this._points[i][j].implement(language);
      }
    } else {
      for (
        let j: number = j0;
        ((j1 - j0 >= 0) && j < j1) || (((j1 - j0 < 0) && j > j1));
        j += ((j1 - j0 > 0) ? 1 : -1)
      ) {
        const i: number = Math.round(i0 + (i1 - i0) * ((j - j0) / (j1 - j0)));
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

  public clone(cloneFigures): DevelopmentField {
    const field: DevelopmentField = new DevelopmentField(this._width, this._height);

    if (cloneFigures && this._figures.length) {
      field.drawFigures(this._figures);
    }

    return field;
  }

  public pointAt(x: number, y: number): DevelopmentPoint {
    return this._points[x][y];
  }

  public selectRandomPointByLanguages(languages: Language[]): DevelopmentPoint {
    const allPoints: DevelopmentPoint[] = this._points
      .reduce((points: DevelopmentPoint[], line: DevelopmentPoint[]) => points.concat(line), [])
      .filter((point: DevelopmentPoint) => languages.indexOf(point.language) !== -1);

    return allPoints[Math.floor(Math.random() * allPoints.length)];
  }

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }

  public get points(): DevelopmentPoint[][] {
    return this._points;
  }
}
