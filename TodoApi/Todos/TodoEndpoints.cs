namespace TodoApi.Todos;

public static class TodoEndpoints
{
    public static RouteGroupBuilder MapTodoEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/todos");

        group.MapGet("/", (InMemoryTodoStore store) => Results.Ok(store.GetAll()));

        group.MapPost("/", (CreateTodoRequest request, InMemoryTodoStore store) =>
        {
            if (string.IsNullOrWhiteSpace(request.Title))
            {
                return Results.ValidationProblem(new Dictionary<string, string[]>
                {
                    ["title"] = ["Title is required."],
                });
            }

            var todo = store.Add(request.Title);
            return Results.Created($"/api/todos/{todo.Id}", todo);
        });

        group.MapDelete("/{id:int}", (int id, InMemoryTodoStore store) =>
            store.Delete(id) ? Results.NoContent() : Results.NotFound());

        return group;
    }
}
