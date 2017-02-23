import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Project } from '../models/project';
import { TeamMember } from '../models/team-member';
import { ProjectService } from './project.service';
import { TeamService } from './team.service';
import { Game } from '../models/game';

@Injectable()
export class GameService {
  private _projects: Project[] = [];
  private _projectSubject: ReplaySubject<Project> = new ReplaySubject<Project>(1);

  private _startDate: Date;
  private _uptimeDays: number;
  private _uptimeMilliseconds: number;
  private _uptimeDaysSubject: ReplaySubject<number> = new ReplaySubject<number>(1);

  public constructor(
    private _projectService: ProjectService,
    private _teamService: TeamService
  ) {}

  public bootstrap(): void {
    this._createProject();
    this._teamService.hire();
    this._teamService.assignToProject(this._projects[0]);
  };

  public start(): void {
    this._startDate = new Date();
    this._uptimeDays = 0;
    this._uptimeMilliseconds = +this._startDate;
    setInterval(() => this._work(), 500);
  }

  public get projects(): ReplaySubject<Project> {
    return this._projectSubject;
  }

  public get uptimeDays(): ReplaySubject<number> {
    return this._uptimeDaysSubject;
  }

  public get startDate(): Date {
    return this._startDate;
  }

  private get _millisecondsPerDay(): number {
    return 150 / Game.instance().speed;
  }

  private _work(): void {
    this._teamService.work();
    const currentMilliseconds: number = +(new Date);
    const daysSinceLastCheck: number = Math.floor((currentMilliseconds - this._uptimeMilliseconds) /
      this._millisecondsPerDay);

    if (daysSinceLastCheck > 0) {
      this._uptimeMilliseconds += this._millisecondsPerDay * daysSinceLastCheck;
      this._uptimeDays += daysSinceLastCheck;
      this._uptimeDaysSubject.next(this._uptimeDays);
    }
  }

  private _createProject(): void {
    const project: Project = this._projectService.create();
    this._projects.push(project);
    this._projectSubject.next(project);
  }
}
