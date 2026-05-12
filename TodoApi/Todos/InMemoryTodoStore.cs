namespace TodoApi.Todos;

public sealed class InMemoryTodoStore
{
    private readonly object syncRoot = new();
    private readonly List<TodoItem> todos = [];
    private int nextId = 1;

    public IReadOnlyList<TodoItem> GetAll()
    {
        lock (syncRoot)
        {
            return todos.ToArray();
        }
    }

    public TodoItem Add(string title)
    {
        var trimmedTitle = title.Trim();

        lock (syncRoot)
        {
            var todo = new TodoItem(nextId++, trimmedTitle, DateTimeOffset.UtcNow);
            todos.Add(todo);
            return todo;
        }
    }

    public bool Delete(int id)
    {
        lock (syncRoot)
        {
            var index = todos.FindIndex(todo => todo.Id == id);
            if (index < 0)
            {
                return false;
            }

            todos.RemoveAt(index);
            return true;
        }
    }
}
