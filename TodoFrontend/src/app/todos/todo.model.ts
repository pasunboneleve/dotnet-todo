export interface TodoItem {
  id: number;
  title: string;
  createdAt: string;
}

export interface CreateTodoRequest {
  title: string;
}
