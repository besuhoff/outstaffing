import { TeamMember } from './team-member';
import { Project } from './project';
export class Game {
  public static readonly speed: number = 10;

  public constructor(
    private _developers: TeamMember[],
    private _projects: Project[],
    private _account: number
  ) {}
}
