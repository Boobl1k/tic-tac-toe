using Presentation.Entities;

namespace Presentation.Domain;

public static class GameDomain
{
    public static Figure WhoseMove(Game game)
    {
        var xCount = 0;
        var oCount = 0;
        foreach (var line in game.Cells)
        foreach (var f in line)
            switch (f)
            {
                case Figure.X:
                    xCount++;
                    break;
                case Figure.O:
                    oCount++;
                    break;
                case Figure.None:
                default:
                    break;
            }

        return xCount > oCount ? Figure.O : Figure.X;
    }
}