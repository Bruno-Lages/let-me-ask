import { React, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { database } from '../config/firebase';

import { Button } from '../components/Button';

import '../style/homeStyle.css';
import svgImage from '../assets/illustration.svg';
import logo from '../assets/logo.svg';
import darkModeLogo from '../assets/dark-mode-logo.svg';
import googleLogo from '../assets/google-icon.svg';

import { authContext } from '../contexts/authContext';

export function Home() {
    const { user, signInWithGoogle, darkMode } = useContext(authContext);

    const [room, setRoom] = useState('');

    const history = useHistory();

    async function handleEnterRoom(e) {
        e.preventDefault();

        if (room.trim() === '') return;

        const roomRef = await database.ref(`rooms/${room}`).get();

        if (!roomRef.exists()) {
            // eslint-disable-next-line no-unused-expressions
            darkMode ? toast.error('inexistent room', {
                style: {
                    background: '#100a23',
                    color: '#8b949e',
                },
            }) : toast.error('inexistent room');
            return;
        }

        if (roomRef.val().closedAt) {
            // eslint-disable-next-line no-unused-expressions
            darkMode ? toast.error('closed room', {
                style: {
                    background: '#100a23',
                    color: '#8b949e',
                },
            }) : toast.error('closed room');
            return;
        }

        // eslint-disable-next-line no-unused-expressions
        roomRef.val().authorId === user.id ? history.push(`/admin/rooms/${room}`) : history.push(`/rooms/${room}`);
    }

    async function redirectToNewRoom() {
        if (!user || Object.keys(user).length < 1) await signInWithGoogle();
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
                <Toaster position="top-center" reverseOrder={false} />
                <div className="authentication">
                    <img src={darkMode ? darkModeLogo : logo} alt="let me ask logo" />
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
