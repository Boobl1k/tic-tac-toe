using System.Linq.Expressions;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;
using Presentation.Data;
using Presentation.Domain;
using Presentation.Entities;
using Presentation.SignalR.Clients;

namespace Presentation.SignalR.Hubs;

public class GameHub : Hub<IGameClient>
{
    private readonly MongoDbContext _dbContext;

    public GameHub(MongoDbContext dbContext) =>
        _dbContext = dbContext;

    public async Task Enter(string gameId)
    {
        Expression<Func<Game, bool>> filter = game => game.Id == gameId;
        var cursor = await _dbContext.GetGameCollection().FindAsync(filter);
        var game = await cursor.FirstOrDefaultAsync();

        if (game is { })
        {
            Console.WriteLine(gameId);
            await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
            await Clients.Group(gameId).UpdateGame(game);
        }
    }

    public async Task PlaceFigure(int first, int second, string gameId, Figure figure)
    {
        Console.WriteLine(first);
        
        Expression<Func<Game, bool>> filter = game => game.Id == gameId;
        var cursor = await _dbContext.GetGameCollection().FindAsync(filter);
        var game = await cursor.FirstOrDefaultAsync();

        if (game is null) return;

        if (game.Cells[first][second] != Figure.None || GameDomain.WhoseMove(game) != figure)
            return;

        game.Cells[first][second] = figure;
        await _dbContext.GetGameCollection().FindOneAndUpdateAsync(new ExpressionFilterDefinition<Game>(filter),
            new ObjectUpdateDefinition<Game>(new { game.Cells }));

        await Clients.Group(gameId).UpdateGame(game);
    }
}