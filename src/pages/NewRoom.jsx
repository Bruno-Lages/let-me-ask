import { React, useContext } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../components/Button';

import '../style/newRoomStyle.css';
import svgImage from '../assets/illustration.svg';
import logo from '../assets/logo.svg';

import { authContext } from '../contexts/authContext';

export function NewRoom() {
    const { user } = useContext(authContext);

    return (
        <div className="new-room">
            <aside>
                <img src={svgImage} alt="illustration representing questions and answers" />
                <h1>Every question has an answer</h1>
                <p>Learn and share knowledge with other people</p>
            </aside>

            <main>
                <div className="room-container">
                    <img src={logo} alt="let me ask logo" />
                    <h1>{user.name}</h1>
                    <form action="">
                        <input type="text" name="roomName" placeholder="Create a name to your room" aria-placeholder="room name" />
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
