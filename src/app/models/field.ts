import { Point } from './point';

export abstract class Field<TPoint extends Point> {
  protected _points: TPoint[][];
  protected _flatPoints: TPoint[];

  public constructor(
    protected _width: number,
    protected _height: number,
  ) {
    this._points = [];
    this._flatPoints = [];
    for (let i: number = 0; i < _width; i++) {
      this._points[i] = [];

      for (let j: number = 0; j < _height; j++) {
        this._points[i].push(this._createPoint(i, j));
      }

      this._flatPoints = this._flatPoints.concat(this._points[i]);
    }
  }

  public pointAt(x: number, y: number): TPoint {
    return this._points[x][y];
  }

  public hasPointAt(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }

  public get points(): TPoint[][] {
    return this._points;
  }

  protected abstract _createPoint(x: number, y: number): TPoint;
}
