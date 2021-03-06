import { React, useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { database } from '../config/firebase';

import { Button } from '../components/Button';

import '../style/newRoomStyle.css';
import svgImage from '../assets/illustration.svg';
import logo from '../assets/logo.svg';
import darkModeLogo from '../assets/dark-mode-logo.svg';

import { authContext } from '../contexts/authContext';

export function NewRoom() {
    const { user, darkMode } = useContext(authContext);

    const history = useHistory();

    const [room, setRoom] = useState('');

    async function handleNewroom(e) {
        e.preventDefault();
        const roomRef = database.ref('rooms');

        if (!Object.keys(user).length) {
            // eslint-disable-next-line no-unused-expressions
            darkMode ? toast.error('you must be logged to create a room', {
                style: {
                    background: '#100a23',
                    color: '#8b949e',
                },
            }) : toast.error('you must be logged to create a room');
            return;
        }

        if (room.trim() !== '') {
            const newRoom = await roomRef.push({
                name: room,
                authorId: user.id,
            });
            history.push(`/admin/rooms/${newRoom.key}`);
        }
    }

    return (
        <div className="new-room">
            <aside>
                <img src={svgImage} alt="illustration representing questions and answers" />
                <h1>Every question has an answer</h1>
                <p>Learn and share knowledge with other people</p>
            </aside>

            <main className="new-room-main">
                <Toaster position="top-center" reverseOrder={false} />
                <div className="room-container">
                    <img src={darkMode ? darkModeLogo : logo} alt="let me ask logo" />
                    <h1>{user.name}</h1>
                    <form onSubmit={(e) => handleNewroom(e)}>
                        <input type="text" name="roomName" placeholder="Create a name to your room" aria-placeholder="room name" onChange={(e) => setRoom(e.target.value)} />
                        <Button type="submit">Create room</Button>
                    </form>
                    <p className="join-room">
                        Want to join an existent room?
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
                        <Link to="/">Click here </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
