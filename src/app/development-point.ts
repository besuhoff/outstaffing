import { Point } from './point';
import { Language } from './language';

export class DevelopmentPoint extends Point {
  private _language: Language | null = null;

  public implement(language: Language): void {
    this._language = language;
  }

  public isImplemented(): boolean {
    return this._language !== null;
  }

  public destruct(): void {
    this._language = null;
  }

  public get language(): Language {
    return this._language;
  }
}
