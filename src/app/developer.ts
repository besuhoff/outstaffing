import { Language } from './language';
import { DevelopmentFigure } from './development-figure';

export class Developer {
  private _currentFigures: DevelopmentFigure[] = [];

  public constructor(
    private _languages: Language[],
    private _speed: number,
    private _switchingProbability: number,
    private _switchingProbabilityDelta: number,
  ) { }


}
