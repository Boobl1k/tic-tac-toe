import {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {Cell} from "./Cell";
import {Figure, Game} from "../Entities/Game"
import axios from '../axios'
import {whoseMove} from "../Domain/gameDomain";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {BASE_URL} from "../config";

export const TicTacGame = () => {
    const {figure, id} = useParams();

    const [game, setGame] = useState<Game>({cells: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], id: id || ''});
    const [connection, setConnection] = useState<null | HubConnection>(null);

    useEffect(() => {
        const connect = new HubConnectionBuilder()
            .withUrl(BASE_URL + 'game')
            .withAutomaticReconnect()
            .build();

        setConnection(connect);
    }, []);

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(async () => {
                    connection.on('UpdateGame', (game: Game) => {
                        setGame(game);
                    });
                    if (id)
                        connection.invoke("Enter", id);
                })
                .catch(error => console.log('Connection failed: ', error));
        }
    }, [connection]);

    const yourMove = whoseMove(game) === figure;

    const onPlaceFigure = useMemo(() =>
        (x: number, y: number, current: Figure) => {
            if (current === Figure.None && yourMove)
                connection?.send("PlaceFigure", x, y, id, figure === 'x' ? 1 : 2).catch(e => console.log(e));
        }, [yourMove, connection]);

    return (
        <>
            {yourMove ? 'Your move' : 'Wait for the opponent\'s move'}
            <br/>
            <br/>
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
            }
            }>
                {game.cells.map((arr, x) => arr.map((f, y) => (
                    <Cell key={`${x}${y}`}
                          onPlaceFigure={() => onPlaceFigure(x, y, f)}
                          figure={f}/>)
                ))}
            </div>
        </>
    );
}
