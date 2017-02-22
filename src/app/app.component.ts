import { Component, OnInit } from '@angular/core';
import { GameService } from './game.service';
import { Project } from './project';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public project: Project;

  public constructor(private _gameService: GameService) { }

  public ngOnInit(): void {
    this._gameService.createProject();
    this.project = this._gameService.project;
    this._gameService.setTeam();
    this._gameService.start();
  }

  public get percentComplete(): number {
    return this.project.amountComplete() * 100;
  }
}
