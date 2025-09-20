import { Component, computed, input, Signal } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';

@Component({
  selector: 'app-validation-errors',
  imports: [],
  templateUrl: './validation-errors.component.html',
  styleUrl: './validation-errors.component.css',
})
export class ValidationErrorsComponent {
  errors = input.required<ValidationError[]>();
  showFieldNames = input(false);

  errorMessages = computed(() =>
    toErrorMessages(this.errors(), this.showFieldNames())
  );
}

function toErrorMessages(
  errors: ValidationError[],
  showFieldNames: boolean
): string[] {
  return errors.map((error) => {
    const prefix = showFieldNames ? toFieldName(error) + ': ' : '';
    const message = toMessage(error.message);
    const postfix = message ? ', ' + message : '';
    return prefix + error.kind + postfix;
  });
}

function toFieldName(error: ValidationError) {
  return error.field().name().split('.').at(-1);
}

function toMessage(kind: string | undefined): string {
  switch (kind) {
    case 'required':
      return 'Enter a value!';
    default:
      return '';
  }
}
