import { Point } from './point';
export class Figure {
  protected _points: Point[];
  protected _fillPoint: Point;

  public constructor(
    points: Point[],
    fillPoint: Point,
  ) {
    this._points = points.map((point: Point) => point.clone());
    this._fillPoint = fillPoint.clone();
  }

  public get points(): Point[] {
    return this._points;
  }

  public get fillPoint(): Point {
    return this._fillPoint;
  }

  public get area(): number {
    let area: number = 0;
    const length: number = this.points.length;

    for (let i: number = 0; i < length; i++) {
      area += this.points[i].x *
        (this.points[(i + 1) % length].y - this.points[(i > 0) ? (i - 1) : (i + length - 1)].y);
    }

    return area / 2;
  }

  public move(dx: number = 0, dy: number = 0): void {
    this._points = this._points.map((point: Point) => new Point(point.x + dx, point.y + dy));
    this._fillPoint = new Point(this.fillPoint.x + dx, this.fillPoint.y + dy);
  }

  public scale(scaleX: number = 1, scaleY: number = 1): void {
    this._points = this._points.map((point: Point) => new Point(point.x * scaleX, point.y * scaleY));
    this._fillPoint = new Point(this.fillPoint.x * scaleX, this.fillPoint.y * scaleY);
  }
}
