import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Language } from './language';
import { Figure } from './figure';
import { Point } from './point';
import { DevelopmentField } from './development-field';
import { Project } from './project';
import { DevelopmentFigure } from './development-figure';
import { TeamMember } from './team-member';
import { Developer } from './developer';
import { Tester } from './tester';
import { Game } from './game';

@Injectable()
export class GameService {
  private _startDate: Date;
  private _uptimeDays: number;
  private _uptimeMilliseconds: number;
  private _uptimeDaysSubject: ReplaySubject<number> = new ReplaySubject<number>(1);

  private _gameIteration: Observable<Date> = new Observable<Date>();
  private _project: Project;
  private _languages: Language[] = [
    new Language('ruby', '#910000'),
    new Language('javascript', '#b7961c'),
    new Language('php', '#777bb3'),
    //
    new Language('python', '#3473a6'),
    new Language('c#', '#690081'),
    new Language('html', '#b13c11'),
    //
    new Language('css', '#014173'),
  ];

  private _team: TeamMember[] = [];

  private _availableFigures: {[optionName: string]: Figure} = {
    // "T" figure:
    //  ▓
    // ▓▓▓
    T: new Figure(
      [
        new Point(0, 10),
        new Point(10, 10),
        new Point(10, 0),
        new Point(20, 0),
        new Point(20, 10),
        new Point(30, 10),
        new Point(30, 20),
        new Point(0, 20),
      ],
      new Point(15, 15)
    ),

    // "J" figure:
    // ▓▓▓
    //   ▓
    J: new Figure(
      [
        new Point(0, 0),
        new Point(30, 0),
        new Point(30, 20),
        new Point(20, 20),
        new Point(20, 10),
        new Point(0, 10),
      ],
      new Point(5, 5)
    ),

    // "L" figure:
    // ▓▓▓
    // ▓
    L: new Figure(
      [
        new Point(0, 0),
        new Point(30, 0),
        new Point(30, 10),
        new Point(10, 10),
        new Point(10, 20),
        new Point(0, 20),
      ],
      new Point(5, 5)),

    // "O" figure:
    // ▓▓
    // ▓▓
    O: new Figure(
      [
        new Point(0, 0),
        new Point(20, 0),
        new Point(20, 20),
        new Point(0, 20),
      ],
      new Point(5, 5)),

    // "S" figure:
    //  ▓▓
    // ▓▓
    S: new Figure(
      [
        new Point(0, 10),
        new Point(10, 10),
        new Point(10, 0),
        new Point(30, 0),
        new Point(30, 10),
        new Point(20, 10),
        new Point(20, 20),
        new Point(0, 20),
      ],
      new Point(15, 15)),

    // "Z" figure:
    // ▓▓
    //  ▓▓
    Z: new Figure(
      [
        new Point(0, 0),
        new Point(20, 0),
        new Point(20, 10),
        new Point(30, 10),
        new Point(30, 20),
        new Point(10, 20),
        new Point(10, 10),
        new Point(0, 10),
      ],
      new Point(5, 5)),

    // "I" figure:
    // ▓▓▓▓
    I: new Figure(
      [
        new Point(0, 0),
        new Point(40, 0),
        new Point(40, 10),
        new Point(0, 10),
      ],
      new Point(5, 5)),
  };

  public constructor() {}

  public start(): void {
    this._startDate = new Date();
    this._uptimeDays = 0;
    this._uptimeMilliseconds = +this._startDate;
    setInterval(() => this._work(), 500);
  }

  public setTeam(): void {
    this._team = [

      new Developer(
        'Sergiy Pereverziev',
        3500,
        0.03,
        0.25,
        20,
        [this._languages[1], this._languages[5],  this._languages[6]],
        0.01,
        0.01
      ),

      new Developer(
        'Pavel Lebedinskiy',
        3000,
        0.03,
        0.25,
        20,
        [this._languages[2], this._languages[5],  this._languages[6]],
        0.02,
        0.01
      ),

      new Developer(
        'Eduard Pliushkin',
        1500,
        0.03,
        0.25,
        10,
        [this._languages[1], this._languages[0]],
        0.02,
        0.01
      ),

      new Developer(
        'Kostya Dubinin',
        2500,
        0.03,
        0.25,
        15,
        [this._languages[0]],
        0.01,
        0.01
      ),

      new Developer(
        'Alex Shkop',
        4000,
        0.03,
        0.25,
        40,
        [this._languages[3]],
        0.05,
        0.01
      ),

      new Tester(
        'Karina Petrosian',
        2000,
        0.03,
        0.25,
        50
      ),
    ];

    this._team.forEach((teamMember: TeamMember) => teamMember.assignToProject(this._project));
  };

  public createProject(): void {
    const figures: DevelopmentFigure[] = [
      DevelopmentFigure.fromFigure(this._availableFigures['T'], this._languages[0]).move(20, 20),
      DevelopmentFigure.fromFigure(this._availableFigures['Z'], this._languages[2]).move(30, 10),
      DevelopmentFigure.fromFigure(this._availableFigures['I'], this._languages[5]).rotate(90).move(-15, 45),
      DevelopmentFigure.fromFigure(this._availableFigures['S'], this._languages[6]).move(40, 30),
      DevelopmentFigure.fromFigure(this._availableFigures['O'], this._languages[3]).scale(1.5, 1.5),
      DevelopmentFigure.fromFigure(this._availableFigures['O'], this._languages[1]).move(50, 50),
      DevelopmentFigure.fromFigure(this._availableFigures['J'], this._languages[1]).move(30, 0),
    ];

    const field: DevelopmentField = DevelopmentField.createFigureContainer(figures);
    field.drawFigures(figures);

    this._project = new Project(
      'Tetris figures',
      field,
      0.02,
      new Date(2017, 6, 1),
      5000
    );
  }

  public get project(): Project {
    return this._project;
  }

  public get uptimeDays(): ReplaySubject<number> {
    return this._uptimeDaysSubject;
  }

  public get startDate(): Date {
    return this._startDate;
  }

  private _work(): void {
    this._team.forEach((teamMember: TeamMember) => teamMember.work());
    const currentMilliseconds: number = +(new Date);
    const daysSinceLastCheck: number = Math.floor((currentMilliseconds - this._uptimeMilliseconds) /
      Game.millisecondsPerDay);

    if (daysSinceLastCheck > 0) {
      this._uptimeMilliseconds += Game.millisecondsPerDay * daysSinceLastCheck;
      this._uptimeDays += daysSinceLastCheck;
      this._uptimeDaysSubject.next(this._uptimeDays);
    }
  }
}
