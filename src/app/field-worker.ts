import { TeamMember } from './team-member';
import { GameError } from './game-error';
import { DevelopmentPoint } from './development-point';
import { Game } from './game';

export abstract class FieldWorker extends TeamMember {
  private _workingMilliseconds: number = 0;

  public constructor(name: string,
                     desiredSalary: number,
                     desiredSalaryDelta: number,
                     selfMotivation: number,
                     protected _speed: number,
  ) {
    super(name, desiredSalary, desiredSalaryDelta, selfMotivation);
  }

  public abstract work(): void;

  protected _hasStarted(): boolean {
    return this.project && this._workingMilliseconds !== 0;
  }

  protected _logWork(numberOfPoints: number): void {
    this._workingMilliseconds += numberOfPoints * this._millisecondsPerPoint();
  }

  protected _howManyPointsShouldBeMade(): number {
    return Math.floor((+(new Date()) - this._workingMilliseconds) / this._millisecondsPerPoint());
  }

  protected _millisecondsPerPoint(): number {
    return (1000 / this._speed) / Game.speed;
  }

  protected _logStartWork(): void {
    window['console'].log(`${this.name} started work on ${this.project.name} at ${new Date()}`);
    this._workingMilliseconds = +(new Date());
  }

  protected _logStopWork(): void {
    window['console'].log(`${this.name} stopped work on ${this.project.name} at ${new Date()}`);
    this._workingMilliseconds = 0;
  }

  protected _pickRandomPoint(): DevelopmentPoint {
    if (this.project) {
      return this.project.selectRandomPointByWorker(this);
    } else {
      throw new GameError(`Developer #${this.name} should be assigned to project in order to start`);
    }
  }
}
