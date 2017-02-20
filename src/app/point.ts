export class Point {
  public constructor(
    private _x: number,
    private _y: number
  ) {

  }

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public clone(): Point {
    return new Point(this.x, this.y);
  }
}
