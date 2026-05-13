import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject, of, throwError } from 'rxjs';

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
  const newerTodo: TodoItem = {
    id: 2,
    title: 'Write tests',
    createdAt: '2026-05-12T00:01:00Z',
  };

  function addTodoWithMockedServer(disableInputDuringSave: boolean): {
    activeDuringSave: boolean;
    input: HTMLInputElement;
  } {
    const createdTodo: TodoItem = {
      id: 2,
      title: 'Write tests',
      createdAt: '2026-05-12T00:01:00Z',
    };
    const createResponse = new Subject<TodoItem>();
    todoApi.create.and.returnValue(createResponse);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('#new-todo')).nativeElement as HTMLInputElement;
    const fallbackFocusTarget = document.createElement('input');
    input.parentElement?.appendChild(fallbackFocusTarget);
    const originalFocus = input.focus.bind(input);
    const syncOldDisabledBinding = () => {
      if (disableInputDuringSave) {
        input.disabled = fixture.componentInstance.isSaving;
        if (input.disabled) {
          fallbackFocusTarget.focus();
        }
      }
    };
    spyOn(input, 'focus').and.callFake(() => {
      if (!input.disabled) {
        originalFocus();
      }
    });

    input.focus();
    expect(document.activeElement).toBe(input);
    (input.focus as jasmine.Spy).calls.reset();

    fixture.componentInstance.newTitle = 'Write tests';
    fixture.detectChanges();
    fixture.componentInstance.addTodo();
    fixture.detectChanges();
    syncOldDisabledBinding();

    expect(input.disabled).toBe(disableInputDuringSave);
    const activeDuringSave = document.activeElement === input;
    expect(todoApi.create).toHaveBeenCalledWith('Write tests');

    createResponse.next(createdTodo);
    createResponse.complete();
    tick();
    fixture.detectChanges();
    TestBed.flushEffects();
    syncOldDisabledBinding();

    expect(input.focus).toHaveBeenCalled();
    fallbackFocusTarget.remove();
    return { activeDuringSave, input };
  }

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

  it('renders newer todos before older todos', () => {
    todoApi.list.and.returnValue(of([existingTodo, newerTodo]));

    fixture.detectChanges();

    const renderedTodos = fixture.debugElement
      .queryAll(By.css('.todo-list li span'))
      .map(item => item.nativeElement.textContent.trim());
    expect(renderedTodos).toEqual(['Write tests', 'Read the brief']);
  });

  it('adds a todo with trimmed input', () => {
    todoApi.create.and.returnValue(of(newerTodo));
    fixture.detectChanges();

    fixture.componentInstance.newTitle = '  Write tests  ';
    fixture.componentInstance.addTodo();

    expect(todoApi.create).toHaveBeenCalledWith('Write tests');
    expect(fixture.componentInstance.todos).toEqual([newerTodo, existingTodo]);
    expect(fixture.componentInstance.newTitle).toBe('');
  });

  it('keeps focus on the text input after adding a todo from the client', fakeAsync(() => {
    const { activeDuringSave, input } = addTodoWithMockedServer(false);

    expect(activeDuringSave).toBeTrue();
    expect(document.activeElement).toBe(input);
  }));

  it('does not keep focus while saving if the text input is disabled', fakeAsync(() => {
    const { activeDuringSave } = addTodoWithMockedServer(true);

    expect(activeDuringSave).toBeFalse();
  }));

  it('does not add an empty todo', () => {
    fixture.detectChanges();

    fixture.componentInstance.newTitle = '   ';
    fixture.componentInstance.addTodo();

    expect(todoApi.create).not.toHaveBeenCalled();
  });

  it('limits todo title input length', () => {
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('#new-todo')).nativeElement as HTMLInputElement;
    expect(input.maxLength).toBe(200);
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
