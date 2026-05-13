namespace TodoApi.Todos;

public static class TodoEndpoints
{
    public static RouteGroupBuilder MapTodoEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/todos");

        group.MapGet("/", (InMemoryTodoStore store) => Results.Ok(store.GetAll()));

        group.MapPost("/", (CreateTodoRequest request, InMemoryTodoStore store) =>
        {
            var title = request.Title?.Trim();

            if (string.IsNullOrWhiteSpace(title))
            {
                return Results.ValidationProblem(new Dictionary<string, string[]>
                {
                    ["title"] = ["Title is required."],
                });
            }

            if (title.Length > TodoConstraints.MaxTitleLength)
            {
                return Results.ValidationProblem(new Dictionary<string, string[]>
                {
                    ["title"] = [$"Title must be {TodoConstraints.MaxTitleLength} characters or fewer."],
                });
            }

            var todo = store.Add(title);
            return Results.Created($"/api/todos/{todo.Id}", todo);
        });

        group.MapDelete("/{id:int}", (int id, InMemoryTodoStore store) =>
            store.Delete(id) ? Results.NoContent() : Results.NotFound());

        return group;
    }
}
