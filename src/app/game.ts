import { TeamMember } from './team-member';
import { Project } from './project';
export class Game {
  public static readonly speed: number = 1;

  public static get millisecondsPerDay(): number {
    return 150 / Game.speed;
  }

  public constructor(
    private _developers: TeamMember[],
    private _projects: Project[],
    private _account: number
  ) {}
}
