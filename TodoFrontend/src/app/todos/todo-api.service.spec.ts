import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { TodoApiService } from './todo-api.service';

describe('TodoApiService', () => {
  let service: TodoApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TodoApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('loads todos from the relative API URL', () => {
    service.list().subscribe(todos => {
      expect(todos).toEqual([
        { id: 1, title: 'Read brief', createdAt: '2026-05-12T00:00:00Z' },
      ]);
    });

    const request = http.expectOne('/api/todos');
    expect(request.request.method).toBe('GET');
    request.flush([{ id: 1, title: 'Read brief', createdAt: '2026-05-12T00:00:00Z' }]);
  });

  it('creates a todo', () => {
    service.create('Write code').subscribe(todo => {
      expect(todo.title).toBe('Write code');
    });

    const request = http.expectOne('/api/todos');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ title: 'Write code' });
    request.flush({ id: 2, title: 'Write code', createdAt: '2026-05-12T00:01:00Z' });
  });

  it('deletes a todo', () => {
    service.delete(3).subscribe();

    const request = http.expectOne('/api/todos/3');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
