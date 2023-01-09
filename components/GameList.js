import { React } from 'react';
import SmallButton from "./buttons/SmallButton"

export default function GameList({gameList, game, setGame}) {

    const games = []
    Object.keys(gameList).forEach(key => {
        games.push(
            <SmallButton
                key={key}
                selected={game === key}
                label={key.replace('_', ' ')} 
                action={() => setGame(key)}/>
        )

    })
    return (
        <div className="flex-wrap ">
            {games}
        </div>
    )
}