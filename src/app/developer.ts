import { Language } from './language';
import { DevelopmentPoint } from './development-point';
import { DevelopmentField } from './development-field';
import { TeamMember } from './team-member';

export class Developer extends TeamMember {
  private _stack: DevelopmentPoint[];
  private _workingSeconds: number = 0;
  private _field: DevelopmentField | null;

  public constructor(
    name: string,
    desiredSalary: number,
    desiredSalaryDelta: number,
    selfMotivation: number,
    private _languages: Language[],
    private _speed: number,
    private _switchingProbability: number,
    private _switchingProbabilityDelta: number,
  ) {
    super(name, desiredSalary, desiredSalaryDelta, selfMotivation);
  }

  public work() {
    if (this._field) {
      if (Math.random() <= this._switchingProbability) {
        this.start();
      }
    }
  }

  public start(): void {
    if (this._field) {
      this._stack = [this._field.selectRandomPointByLanguages(this._languages)];
    } else {
      throw new GameError(`Developer #${this.name} should be assigned to field in order to start`);
    }
  };
}
