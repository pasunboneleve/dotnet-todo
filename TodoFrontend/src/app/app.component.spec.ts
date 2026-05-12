import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { AppComponent } from './app.component';
import { TodoApiService } from './todos/todo-api.service';
import { TodoItem } from './todos/todo.model';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let todoApi: jasmine.SpyObj<TodoApiService>;

  const existingTodo: TodoItem = {
    id: 1,
    title: 'Read the brief',
    createdAt: '2026-05-12T00:00:00Z',
  };

  beforeEach(async () => {
    todoApi = jasmine.createSpyObj<TodoApiService>('TodoApiService', ['list', 'create', 'delete']);
    todoApi.list.and.returnValue(of([existingTodo]));

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: TodoApiService, useValue: todoApi }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
  });

  it('loads and renders todos', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(todoApi.list).toHaveBeenCalled();
    expect(compiled.textContent).toContain('Read the brief');
  });

  it('adds a todo with trimmed input', () => {
    const createdTodo: TodoItem = {
      id: 2,
      title: 'Write tests',
      createdAt: '2026-05-12T00:01:00Z',
    };
    todoApi.create.and.returnValue(of(createdTodo));
    fixture.detectChanges();

    fixture.componentInstance.newTitle = '  Write tests  ';
    fixture.componentInstance.addTodo();

    expect(todoApi.create).toHaveBeenCalledWith('Write tests');
    expect(fixture.componentInstance.todos).toEqual([existingTodo, createdTodo]);
    expect(fixture.componentInstance.newTitle).toBe('');
  });

  it('does not add an empty todo', () => {
    fixture.detectChanges();

    fixture.componentInstance.newTitle = '   ';
    fixture.componentInstance.addTodo();

    expect(todoApi.create).not.toHaveBeenCalled();
  });

  it('deletes a todo', () => {
    todoApi.delete.and.returnValue(of(undefined));
    fixture.detectChanges();

    fixture.componentInstance.deleteTodo(existingTodo);

    expect(todoApi.delete).toHaveBeenCalledWith(1);
    expect(fixture.componentInstance.todos).toEqual([]);
  });

  it('shows an error when loading fails', () => {
    todoApi.list.and.returnValue(throwError(() => new Error('api down')));

    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css('[role="alert"]'));
    expect(error.nativeElement.textContent).toContain('Could not load todos');
  });
});
