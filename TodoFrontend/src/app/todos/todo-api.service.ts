import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateTodoRequest, TodoItem } from './todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/todos';

  list(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(this.baseUrl);
  }

  create(title: string): Observable<TodoItem> {
    const request: CreateTodoRequest = { title };
    return this.http.post<TodoItem>(this.baseUrl, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
