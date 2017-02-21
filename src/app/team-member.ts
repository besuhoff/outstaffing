export class TeamMember {
  protected _currentSalary: number;

  public constructor(
    public readonly name: string,
    protected _desiredSalary: number,
    protected _desiredSalaryDelta: number,
    protected _motivationLevel: number,
  ) { }

  public setSalary(salary: number) {
    this._currentSalary = salary;
  }
}
