import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface ITodo {
  title: string;
  developer: string;
  priority: string;
  status: string;
  type: string;
  'Estimated SP': number;
  'Actual SP': number;
}

interface IResponse {
  response: boolean;
  data: ITodo[];
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'https://mocki.io/v1/f6d74629-a002-4de3-b82c-9a8bc2bc25e9';

  private todosSubject = new BehaviorSubject<ITodo[]>([]);
  private originalTodos: ITodo[] = [];

  todos$ = this.todosSubject.asObservable();
  totalEstimatedSP$ = new BehaviorSubject<number>(0);
  totalActualSP$ = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  fetchTodos(): Observable<IResponse> {
    return this.http.get<IResponse>(this.apiUrl).pipe(
      tap((response) => {
        if (response.response) {
          this.originalTodos = response.data;
          this.todosSubject.next(response.data);
          this.calculateTotals();
        }
      })
    );
  }

  addTodo(): void {
    const newTodo: ITodo = {
      title: 'New Task',
      developer: '',
      priority: 'Low',
      status: 'Pending',
      type: 'Other',
      'Estimated SP': 0,
      'Actual SP': 0,
    };

    this.originalTodos = [newTodo, ...this.originalTodos];
    this.todosSubject.next([...this.originalTodos]);
    this.calculateTotals();
  }

  updateTodo(updatedTodo: ITodo): void {
    const currentTodos = this.todosSubject.getValue();
    const updatedTodos = currentTodos.map((todo) =>
      todo.title === updatedTodo.title ? updatedTodo : todo
    );
    this.todosSubject.next(updatedTodos);
    this.calculateTotals();
  }

  private calculateTotals(): void {
    const todos = this.todosSubject.getValue();

    const totalEstimatedSP = todos.reduce(
      (acc, todo) => acc + todo['Estimated SP'],
      0
    );
    const totalActualSP = todos.reduce(
      (acc, todo) => acc + todo['Actual SP'],
      0
    );

    this.totalEstimatedSP$.next(totalEstimatedSP); // Update total Estimated SP
    this.totalActualSP$.next(totalActualSP); // Update total Actual SP
  }

  sortTodos(sortParams: { key: keyof ITodo; order: 'asc' | 'desc' }[]): void {
    const currentTodos = [...this.todosSubject.getValue()];

    currentTodos.sort((a, b) => {
      for (const param of sortParams) {
        const { key, order } = param;

        let valueA = a[key];
        let valueB = b[key];

        if (typeof valueA === 'number' && typeof valueB === 'number') {
          if (valueA < valueB) return order === 'asc' ? -1 : 1;
          if (valueA > valueB) return order === 'asc' ? 1 : -1;
        } else {
          valueA = valueA.toString().toLowerCase();
          valueB = valueB.toString().toLowerCase();

          if (valueA < valueB) return order === 'asc' ? -1 : 1;
          if (valueA > valueB) return order === 'asc' ? 1 : -1;
        }
      }
      return 0;
    });

    this.todosSubject.next(currentTodos);
  }

  filterByDeveloper(activeDevelopers: string[]): void {
    if (activeDevelopers.length > 0) {
      const filteredTodos = this.originalTodos.filter((todo) => {
        const todoDevelopers =
          typeof todo.developer === 'string'
            ? todo.developer.split(',').map((dev) => dev.trim())
            : [];

        return activeDevelopers.some((dev) => todoDevelopers.includes(dev));
      });
      this.todosSubject.next(filteredTodos);
    } else {
      this.todosSubject.next([...this.originalTodos]);
    }
  }

  searchByTitle(title: string): void {
    const currentTodos = this.todosSubject.getValue();
    const filteredTodos = currentTodos.filter((todo) =>
      todo.title.toLowerCase().includes(title.toLowerCase())
    );

    if (!title) {
      this.todosSubject.next([...this.originalTodos]);
    } else {
      this.todosSubject.next(filteredTodos);
    }
  }
}
