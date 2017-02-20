import { Component, OnInit } from '@angular/core';
import { GameService } from './game.service';
import { DevelopmentField } from './development-field';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public field: DevelopmentField;
  public scale: number = 4;

  constructor(private _gameService: GameService) { }

  ngOnInit() {
    this.field = this._gameService.generate();
  }
}
