import { Component, OnInit } from '@angular/core';
import { GameService } from '../services/game.service';
import { Project } from '../models/project';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public projects: Project[] = [];

  public constructor(private _gameService: GameService) { }

  public ngOnInit(): void {
    this._gameService.bootstrap();
    this._gameService.start();

    this._gameService.projects.subscribe((project: Project) => {
      this.projects.push(project);
    });
  }
}
