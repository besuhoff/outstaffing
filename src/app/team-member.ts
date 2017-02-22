import { Project } from './project';

export abstract class TeamMember {
  protected _currentSalary: number;
  protected _project: Project | null;

  public constructor(
    public readonly name: string,
    protected _desiredSalary: number,
    protected _desiredSalaryDelta: number,
    protected _motivationLevel: number,
  ) { }

  public assignToProject(project: Project) {
    this._project = project;
  }

  public fire(): void {
    this._project = null;
  }

  public setSalary(salary: number) {
    this._currentSalary = salary;
  }

  public get project(): Project {
    return this._project;
  }

  public abstract work(): void;
}
