import { FieldWorker } from './field-worker';
import { DevelopmentPoint } from './development-point';
import { Backlog } from './backlog';

export class Tester extends FieldWorker {
  public work(): void {
    if (this._hasStarted()) {
      const pointsToBeMade: number = this._howManyPointsShouldBeMade();
      if (pointsToBeMade > 0) {
        this._logWork(pointsToBeMade);
        for (let i: number = 0; i < pointsToBeMade; i++) {
          const point: DevelopmentPoint = this._pickRandomPoint();
          if (point.language !== this.project.field.pointAt(point.x, point.y).language) {
            Backlog.getInstance().reportBug(point, this.project.field.pointAt(point.x, point.y).language);
          }
        }
      }
    } else if (this.project) {
      this._logStartWork();
    }
  }
}
