import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Language } from './language';
import { Figure } from './figure';
import { Point } from './point';
import { DevelopmentField } from './development-field';
import { Project } from './project';
import { DevelopmentFigure } from './development-figure';
import { TeamMember } from './team-member';
import { Developer } from './developer';
import { Tester } from './tester';

@Injectable()
export class GameService {
  private _gameIteration: Observable<Date> = new Observable<Date>();
  private _project: Project;
  private _languages: Language[] = [
    new Language('ruby', '#910000'),
    new Language('javascript', '#b7961c'),
    new Language('php', '#777bb3'),
    new Language('python', '#3473a6'),
    new Language('c#', '#690081'),
    new Language('html', '#9c3610'),
    new Language('css', '#014173'),
  ];

  private _team: TeamMember[] = [];

  private _availableFigures: Figure[] = [
    // "T" figure:
    //  ▓
    // ▓▓▓
    new Figure(
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
    new Figure(
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
    new Figure(
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
    new Figure(
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
    new Figure(
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
    new Figure(
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
  ];

  public constructor() {}

  public start(): void {
    setInterval(() => this._work(), 1000);
  }

  public setTeam(): void {
    this._team = [
      new Developer(
        'Sergiy Pereverziev',
        3500,
        0.03,
        0.25,
        100,
        [this._languages[1]],
        0.01,
        0.01
      ),

      new Developer(
        'Kostya Dubinin',
        2500,
        0.03,
        0.25,
        80,
        [this._languages[0]],
        0.01,
        0.01
      ),

      new Developer(
        'Alex Shkop',
        4000,
        0.03,
        0.25,
        120,
        [this._languages[3]],
        0.01,
        0.01
      ),

      new Tester(
        'Karina Petrosian',
        2000,
        0.03,
        0.25,
        100
      ),

      new Tester(
        'Nataliya Kmet',
        2000,
        0.03,
        0.25,
        100
      )

    ];

    this._team[0].assignToProject(this._project);
    this._team[1].assignToProject(this._project);
    this._team[2].assignToProject(this._project);
    this._team[3].assignToProject(this._project);
  };

  public createProject(): void {
    const figure1: DevelopmentFigure = DevelopmentFigure.fromFigure(this._availableFigures[0], this._languages[0]);
    figure1.move(20, 20);
    const figure2: DevelopmentFigure = DevelopmentFigure.fromFigure(this._availableFigures[3], this._languages[3]);
    figure2.scale(1.5, 1.5);
    const figure3: DevelopmentFigure = DevelopmentFigure.fromFigure(this._availableFigures[3], this._languages[1]);
    figure3.move(5, 5);
    const field: DevelopmentField = DevelopmentField.createFigureContainer([figure1, figure2, figure3]);
    field.drawFigures([figure1, figure2, figure3]);

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

  private _work(): void {
    this._team.forEach((teamMember: TeamMember) => teamMember.work());
  }
}
