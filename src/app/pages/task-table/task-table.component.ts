import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { TodoService, ITodo } from '@/services/todos.service';

interface Todo extends ITodo {
  isEditMode?: boolean;
  developers?: string[];
}

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss'],
})
export class TaskTableComponent implements OnInit {
  developers = ['Alice', 'Bob', 'Charlie'];

  displayedColumns: string[] = [
    'select',
    'title',
    'developer',
    'priority',
    'status',
    'type',
    'Estimated SP',
    'Actual SP',
    'actions',
  ];

  dataSource = new MatTableDataSource<Todo>();
  selection = new SelectionModel<Todo>(true, []);

  priorityOptions: string[] = [
    'Critical',
    'High',
    'Medium',
    'Low',
    'Best Effort',
  ];
  statusOptions: string[] = [
    'Ready to start',
    'In Progress',
    'Waiting for review',
    'Pending Deploy',
    'Done',
    'Stuck',
  ];

  typeOptions: string[] = ['Feature Enhancements', 'Other', 'Bug'];

  totalEstimatedSP: number = 0;
  totalActualSP: number = 0;

  private destroy$ = new Subject<void>();

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.todoService.todos$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (todos) => {
        this.dataSource.data = todos.map((todo) => ({
          ...todo,
          developers: this.splitDevelopers(todo.developer),
        }));
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });

    this.todoService.totalEstimatedSP$
      .pipe(takeUntil(this.destroy$))
      .subscribe((total) => {
        this.totalEstimatedSP = total;
      });

    this.todoService.totalActualSP$
      .pipe(takeUntil(this.destroy$))
      .subscribe((total) => {
        this.totalActualSP = total;
      });

    this.todoService.fetchTodos().subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  splitDevelopers(developers: string): string[] {
    return developers ? developers.split(', ').map((dev) => dev.trim()) : [];
  }

  joinDevelopers(developerArray: string[]): string {
    return developerArray.join(', ');
  }

  updateDeveloper(element: Todo, newValue: string[]) {
    element.developers = newValue;
    element.developer = this.joinDevelopers(newValue);
  }

  getTypeClass(status: string): string {
    switch (status) {
      case 'Feature Enhancements':
        return 'feature-enhancements';
      case 'Other':
        return 'other';
      case 'Bug':
        return 'bug';
      default:
        return '';
    }
  }

  getPriorityClass(status: string): string {
    switch (status) {
      case 'Critical':
        return 'critical';
      case 'High':
        return 'high';
      case 'Medium':
        return 'medium';
      case 'Low':
        return 'low';
      case 'Best Effort':
        return 'best-effort';
      default:
        return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Ready to start':
        return 'ready';
      case 'In Progress':
        return 'progress';
      case 'Waiting for review':
        return 'waiting';
      case 'Pending Deploy':
        return 'pending';
      case 'Done':
        return 'done';
      case 'Stuck':
        return 'stuck';
      default:
        return '';
    }
  }

  createTodo(): void {
    this.todoService.addTodo();
  }

  editTodo(row: Todo): void {
    row.isEditMode = true;
  }

  saveTodo(row: Todo): void {
    row.isEditMode = false;
    this.todoService.updateTodo(row);
  }

  getFormattedDevelopers(developers: string[]): string {
    return developers?.join(', ') + ' ';
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  toggleRowSelection(row: Todo): void {
    this.selection.toggle(row);
  }
}
