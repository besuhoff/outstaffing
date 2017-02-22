import { DevelopmentField } from './development-field';
import { TestPoint } from './test-point';
import { Field } from './field';

export class TestField extends Field<TestPoint> {
  public clone(): TestField {
    return new TestField(this._width, this._height);
  }

  public static fromDevelopmentField(field: DevelopmentField): TestField {
    return new TestField(field.width, field.height);
  }

  protected _createPoint(x: number, y: number): TestPoint {
    return new TestPoint(x, y);
  };
}
