import { CommonModule } from '@angular/common';
import { Component, ElementRef, Injector, OnInit, ViewChild, afterNextRender, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { TodoApiService } from './todos/todo-api.service';
import { TodoItem } from './todos/todo.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private readonly todoApi = inject(TodoApiService);
  private readonly injector = inject(Injector);

  @ViewChild('newTodoInput')
  private newTodoInput?: ElementRef<HTMLInputElement>;

  todos: TodoItem[] = [];
  newTitle = '';
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  deletingIds = new Set<number>();

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.todoApi.list()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: todos => this.todos = this.newestFirst(todos),
        error: () => this.errorMessage = 'Could not load todos. Check that the API is running.',
      });
  }

  addTodo(): void {
    const title = this.newTitle.trim();
    if (!title || this.isSaving) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    this.todoApi.create(title)
      .pipe(finalize(() => this.isSaving = false))
      .subscribe({
        next: todo => {
          this.todos = [todo, ...this.todos];
          this.newTitle = '';
          afterNextRender(() => this.newTodoInput?.nativeElement.focus(), { injector: this.injector });
        },
        error: () => this.errorMessage = 'Could not add the todo. Try again.',
      });
  }

  deleteTodo(todo: TodoItem): void {
    if (this.deletingIds.has(todo.id)) {
      return;
    }

    this.deletingIds.add(todo.id);
    this.errorMessage = '';

    this.todoApi.delete(todo.id)
      .pipe(finalize(() => this.deletingIds.delete(todo.id)))
      .subscribe({
        next: () => this.todos = this.todos.filter(item => item.id !== todo.id),
        error: () => this.errorMessage = 'Could not delete the todo. Try again.',
      });
  }

  private newestFirst(todos: TodoItem[]): TodoItem[] {
    return [...todos].sort((left, right) => {
      const createdAtDifference = Date.parse(right.createdAt) - Date.parse(left.createdAt);
      return createdAtDifference || right.id - left.id;
    });
  }
}
