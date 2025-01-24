import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule, MatCheckbox } from '@angular/material/checkbox';
import { MatMenu } from '@angular/material/menu';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';

import { TodoService, ITodo } from '@/services/todos.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenu,
    MatMenuTrigger,
    MatCheckbox,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  taskName: string = '';

  developers = ['Alice', 'Bob', 'Charlie'];
  selectedDevelopers: { [key: string]: boolean } = {};
  isAllDevelopersSelected = true;

  sortOptions: { [key: string]: boolean } = {
    title: false,
    priority: false,
  };

  sortOrders: { [key: string]: 'asc' | 'desc' } = {
    title: 'asc',
    priority: 'asc',
  };

  constructor(private todoService: TodoService) {}

  createTodo(): void {
    this.todoService.addTodo();
  }

  searchTaskName(): void {
    this.todoService.searchByTitle(this.taskName);
  }

  updateSort(column: keyof ITodo, isChecked: boolean): void {
    this.sortOptions[column] = isChecked;

    if (isChecked) {
      this.sortOrders[column] = 'asc';
    } else {
      this.sortOrders[column] = 'desc';
    }

    const activeSorts = Object.keys(this.sortOptions)
      .filter((key) => this.sortOptions[key as keyof ITodo])
      .map((key) => ({
        key: key as keyof ITodo,
        order: this.sortOrders[key as keyof ITodo],
      }));

    this.todoService.sortTodos(activeSorts);
  }

  applyDeveloperFilter(developer: string): void {
    if (developer === '') {
      this.isAllDevelopersSelected = true;

      this.developers.forEach((dev) => {
        this.selectedDevelopers[dev] = false;
      });

      this.todoService.fetchTodos().subscribe();
    } else {
      const activeDevelopers = this.getActiveDevelopers();

      this.isAllDevelopersSelected = false;
      this.todoService.filterByDeveloper(activeDevelopers);
    }
  }

  getActiveDevelopers(): string[] {
    return this.developers.filter((dev) => this.selectedDevelopers[dev]);
  }
}
