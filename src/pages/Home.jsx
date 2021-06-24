import { React, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { database } from '../config/firebase';

import { Button } from '../components/Button';

import '../style/homeStyle.css';
import svgImage from '../assets/illustration.svg';
import logo from '../assets/logo.svg';
import googleLogo from '../assets/google-icon.svg';

import { authContext } from '../contexts/authContext';

export function Home() {
    const { user, signInWithGoogle } = useContext(authContext);

    const [room, setRoom] = useState('');

    const history = useHistory();

    async function handleEnterRoom(e) {
        e.preventDefault();

        const roomRef = database.ref(`rooms/${room}`);

        const enterRoom = await roomRef.get();

        if (!enterRoom.exists()) {
            // eslint-disable-next-line no-new
            new Error('inexistent room');
            return;
        }

        history.push(`/rooms/${room}`);
    }

    async function redirectToNewRoom() {
        if (!user) await signInWithGoogle();
        history.push('/newRoom');
    }

    return (
        <div className="homepage">
            <aside>
                <img src={svgImage} alt="illustration representing questions and answers" />
                <h1>Every question has an answer</h1>
                <p>Learn and share knowledge with other people</p>
            </aside>

            <main className="home-main">
                <div className="authentication">
                    <img src={logo} alt="let me ask logo" />
                    <h1>{user.name}</h1>
                    <button type="button" onClick={redirectToNewRoom} className="home-button">
                        <img src={googleLogo} alt="Google logo" />
                        <p>create an account with Google</p>
                    </button>
                    <p className="hint">or join some room</p>
                    <form onSubmit={(e) => handleEnterRoom(e)}>
                        <input type="text" name="roomId" placeholder="Type the room Id" aria-placeholder="Type the room Id" onChange={(e) => setRoom(e.target.value)} />
                        <Button type="submit">join this room</Button>
                    </form>
                </div>
            </main>
        </div>
    );
}
