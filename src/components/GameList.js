import React from 'react';
import SmallButton from "./buttons/SmallButton"

 /**
  * @typedef {import("../typedefs").StringSetter} StringSetter
  */

/**
 * 
 * @param {object}   props raw data JSON object 
 * @param {string[]} props.gameList
 * @param {string}   props.current_game
 * @param {StringSetter} props.setGame
 * @returns {React.ReactElement}
 */
export default function GameList(props) {
    const {gameList, current_game, setGame} = props;

    const games = Object.keys(gameList).map(key => {
        return (
            <SmallButton
                key={`To${key}`}
                selected={current_game === key}
                label={key.replace('_', ' ')} 
                onClick={() => setGame(key)}
            />
        )

    });
    return (
        <div className="flex-wrap ">
            {games}
        </div>
    )
}