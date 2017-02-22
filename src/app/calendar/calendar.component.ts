import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { GameService } from '../game.service';

type Month = {name: string, number: number, days: Date[] };

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  public today: moment.Moment;
  public year: number;
  public months: Month[];

  public constructor(private _gameService: GameService) { }

  public ngOnInit(): void {
    this._gameService.uptimeDays.subscribe((days: number) => {
      this.today = moment(this._gameService.startDate).add(days, 'day');
      if (this.year !== this.today.year()) {
        this._initYear();
      }
    });
  }

  public isPassed(day: Date): boolean {
    return this.today.isAfter(day);
  }

  public isActive(month: Month): boolean {
    return this.today.month() === month.number;
  }

  private _initYear(): void {
    this.year = this.today.year();
    this.months = [
      { name: 'January', number: 0, days: [] },
      { name: 'February', number: 1, days: [] },
      { name: 'March', number: 2, days: [] },
      { name: 'April', number: 3, days: [] },
      { name: 'May', number: 4, days: [] },
      { name: 'June', number: 5, days: [] },
      { name: 'July', number: 6, days: [] },
      { name: 'August', number: 7, days: [] },
      { name: 'September', number: 8, days: [] },
      { name: 'October', number: 9, days: [] },
      { name: 'November', number: 10, days: [] },
      { name: 'December', number: 11, days: [] },
    ];

    const start: moment.Moment = moment(this.today.startOf('year'));

    this.months.forEach((month: Month, index: number) => {
      while (start.month() === index) {
        month.days.push(start.toDate());
        start.add(1, 'days');
      }
    });
  }
}
