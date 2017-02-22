import { Point } from './point';
export class Figure {
  protected _points: Point[];
  protected _fillPoint: Point | null;

  public constructor(
    points: Point[],
    fillPoint?: Point,
  ) {
    this._points = points.map((point: Point) => point.clone());
    if (fillPoint) {
      this._fillPoint = fillPoint.clone();
    }
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

  public boundingRectangle(): Figure {
    const points: {x: number, y: number}[] = [
      { x: Infinity,  y: Infinity},
      { x: -Infinity, y: Infinity},
      { x: -Infinity, y: -Infinity},
      { x: Infinity,  y: -Infinity},
    ];

    for (let i: number = 0; i < this._points.length; i++) {
      if (this._points[i].x < points[0].x) {
        points[0].x = this._points[i].x;
        points[3].x = this._points[i].x;
      }

      if (this._points[i].x > points[1].x) {
        points[1].x = this._points[i].x;
        points[2].x = this._points[i].x;
      }

      if (this._points[i].y < points[0].y) {
        points[0].y = this._points[i].y;
        points[1].y = this._points[i].y;
      }

      if (this._points[i].y > points[2].y) {
        points[2].y = this._points[i].y;
        points[3].y = this._points[i].y;
      }
    }

    return new Figure(points.map((point: {x: number; y: number}) => new Point(point.x, point.y)));
  }

  public move(dx: number = 0, dy: number = 0): this {
    this._points = this._points.map((point: Point) => new Point(point.x + dx, point.y + dy));
    if (this._fillPoint) {
      this._fillPoint = new Point(this.fillPoint.x + dx, this.fillPoint.y + dy);
    }

    return this;
  }

  public scale(scaleX: number = 1, scaleY: number = 1): this {
    this._points = this._points.map((point: Point) => new Point(point.x * scaleX, point.y * scaleY));
    if (this._fillPoint) {
      this._fillPoint = new Point(this.fillPoint.x * scaleX, this.fillPoint.y * scaleY);
    }

    return this;
  }

  public rotate(angle: number, center?: Point): this {
    if (!center) {
      const rectangle: Figure = this.boundingRectangle();
      center = new Point(
        rectangle.points[0].x + (rectangle.points[1].x - rectangle.points[0].x) / 2,
        rectangle.points[0].y + (rectangle.points[2].y - rectangle.points[0].y) / 2
      );
    }

    const angleRadians: number = angle * Math.PI / 180;
    const cos: number = Math.cos(angleRadians);
    const sin: number = Math.sin(angleRadians);
    let tmpX: number;
    let tmpY: number;

    for (let i: number = 0; i < this._points.length; i++) {
      tmpX = cos * (this._points[i].x - center.x) - sin * (this._points[i].y - center.y) + center.x;
      tmpY = sin * (this._points[i].x - center.x) + cos * (this._points[i].y - center.y) + center.y;

      this._points[i] = new Point(tmpX, tmpY);
    }

    if (this._fillPoint) {
      tmpX = cos * (this._fillPoint.x - center.x) - sin * (this._fillPoint.y - center.y) + center.x;
      tmpY = sin * (this._fillPoint.x - center.x) + cos * (this._fillPoint.y - center.y) + center.y;

      this._fillPoint = new Point(tmpX, tmpY);
    }

    return this;
  }
}
