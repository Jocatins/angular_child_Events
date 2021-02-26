import { AbstractControl } from '@angular/forms';

export function AgeValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  if (control.value < 18) {
    return { age: true };
  }
  return null;
}
