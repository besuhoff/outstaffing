import { DevelopmentField } from './development-field';

export class Project {
  public constructor(
    private _field: DevelopmentField,
    private _complexity: number,
    private _deadline: Date,
    private _reward: number
  ) {}
}
