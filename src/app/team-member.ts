export class TeamMember {
  protected _desiredSalary: number;
  protected _desiredSalaryDelta: number;
  protected _currentSalary: number;
  protected _motivationLevel: number;

  public setSalary(salary: number) {
    this._currentSalary = salary;
  }
}
