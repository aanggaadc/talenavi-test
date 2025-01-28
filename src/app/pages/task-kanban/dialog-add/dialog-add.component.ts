import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';

import { ITodo } from '@/services/todos.service';

@Component({
  selector: 'kanban-dialog-add',
  templateUrl: './dialog-add.component.html',
  styleUrls: ['./dialog-add.component.scss'],
  imports: [
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class DialogAddComponent {
  todoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITodo
  ) {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      developer: [[], Validators.required],
      priority: ['Low', Validators.required],
      status: ['Ready to start', Validators.required],
      type: ['Other', Validators.required],
      'Estimated SP': [0, [Validators.required, Validators.min(0)]],
      'Actual SP': [0, [Validators.required, Validators.min(0)]],
    });

    if (data) {
      const formattedData = {
        ...data,
        developer: data.developer ? data.developer.split(', ') : [],
      };
      this.todoForm.patchValue(formattedData);
    }
  }

  onSave(): void {
    if (this.todoForm.valid) {
      const formValue = this.todoForm.value;

      if (Array.isArray(formValue.developer))
        formValue.developer = formValue.developer.join(', ');

      this.dialogRef.close(formValue);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
