using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace TodoApi.Tests;

public sealed class TodoEndpointsTests
{
    [Fact]
    public async Task GetTodos_returns_empty_list_before_items_are_created()
    {
        await using var app = new WebApplicationFactory<Program>();
        using var client = app.CreateClient();

        var todos = await client.GetFromJsonAsync<TodoResponse[]>("/api/todos");

        Assert.NotNull(todos);
        Assert.Empty(todos);
    }

    [Fact]
    public async Task PostTodo_creates_trimmed_item()
    {
        await using var app = new WebApplicationFactory<Program>();
        using var client = app.CreateClient();

        var response = await client.PostAsJsonAsync("/api/todos", new { title = "  Buy milk  " });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.Equal("/api/todos/1", response.Headers.Location?.OriginalString);

        var todo = await response.Content.ReadFromJsonAsync<TodoResponse>();
        Assert.NotNull(todo);
        Assert.Equal(1, todo.Id);
        Assert.Equal("Buy milk", todo.Title);
        Assert.NotEqual(default, todo.CreatedAt);
    }

    [Fact]
    public async Task PostTodo_rejects_empty_title()
    {
        await using var app = new WebApplicationFactory<Program>();
        using var client = app.CreateClient();

        var response = await client.PostAsJsonAsync("/api/todos", new { title = "   " });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task DeleteTodo_removes_existing_item()
    {
        await using var app = new WebApplicationFactory<Program>();
        using var client = app.CreateClient();
        var created = await client.PostAsJsonAsync("/api/todos", new { title = "File taxes" });
        var todo = await created.Content.ReadFromJsonAsync<TodoResponse>();

        var deleteResponse = await client.DeleteAsync($"/api/todos/{todo!.Id}");
        var todos = await client.GetFromJsonAsync<TodoResponse[]>("/api/todos");

        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
        Assert.NotNull(todos);
        Assert.Empty(todos);
    }

    [Fact]
    public async Task DeleteTodo_returns_not_found_for_unknown_item()
    {
        await using var app = new WebApplicationFactory<Program>();
        using var client = app.CreateClient();

        var response = await client.DeleteAsync("/api/todos/999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    private sealed record TodoResponse(int Id, string Title, DateTimeOffset CreatedAt);
}
