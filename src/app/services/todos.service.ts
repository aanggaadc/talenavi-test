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
  isEditMode?: boolean;
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
  todos$ = this.todosSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchTodos(): Observable<IResponse> {
    return this.http.get<IResponse>(this.apiUrl).pipe(
      tap((response) => {
        if (response.response) {
          this.todosSubject.next(response.data);
        }
      })
    );
  }

  updateTodo(updatedTodo: ITodo): void {
    const currentTodos = this.todosSubject.getValue();
    const updatedTodos = currentTodos.map((todo) =>
      todo.title === updatedTodo.title ? updatedTodo : todo
    );
    this.todosSubject.next(updatedTodos);
  }
}
