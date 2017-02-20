export class Language {
  public constructor(
    private _name: string,
    private _color: string
  ) {}

  public get name(): string {
    return this._name;
  }

  public get color(): string {
    return this._color;
  }
}
