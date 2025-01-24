import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { TaskCardComponent } from './task-card/task-card.component';

import { TodoService, ITodo } from '@/services/todos.service';

@Component({
  selector: 'app-task-kanban',
  templateUrl: './task-kanban.component.html',
  styleUrl: './task-kanban.component.scss',
  imports: [CdkDropList, CdkDrag, TaskCardComponent],
  standalone: true,
})
export class TaskKanbanComponent {
  ready: ITodo[] = [];
  inProgress: ITodo[] = [];
  waiting: ITodo[] = [];
  done: ITodo[] = [];

  private destroy$ = new Subject<void>();

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.todoService.todos$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (todos) => {
        this.ready = todos.filter((todo) => todo.status === 'Ready to start');
        this.inProgress = todos.filter((todo) => todo.status === 'In Progress');
        this.waiting = todos.filter(
          (todo) => todo.status === 'Waiting for review'
        );
        this.done = todos.filter((todo) => todo.status === 'Done');
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });

    this.todoService.fetchTodos().subscribe();
  }

  drop(event: CdkDragDrop<ITodo[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const movedTodo = event.container.data[event.currentIndex];
      switch (event.container.id) {
        case 'todoList':
          movedTodo.status = 'Ready to start';
          break;
        case 'inProgressList':
          movedTodo.status = 'In Progress';
          break;
        case 'waitingList':
          movedTodo.status = 'Waiting for review';
          break;
        case 'doneList':
          movedTodo.status = 'Done';
          break;
        default:
          break;
      }

      this.todoService.updateTodo(movedTodo);
    }
  }
}
