import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Game} from './Entities/Game';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {GetIn, TicTacGame} from './Components';

function App() {
    return (
        <div className="App">
            <div className="Header">
                <BrowserRouter>
                    <Routes>
                        <Route path={'/:figure?'} element={<GetIn/>}/>
                        <Route path={"/:figure/:id"} element={<TicTacGame/>}/>
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
