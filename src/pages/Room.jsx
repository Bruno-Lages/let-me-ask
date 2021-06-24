/* eslint-disable no-new */
import { useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import { authContext } from '../contexts/authContext';

import { Button } from '../components/Button';
import { Copycode } from '../components/CopyCode';

import '../style/room.css';
import logo from '../assets/logo.svg';
import { database } from '../config/firebase';

export function Room() {
    const { user } = useContext(authContext);
    const roomId = useParams().id;
    const [newQuestion, setNewQuestion] = useState('');

    async function handleSendQuestion(e) {
        e.preventDefault();
        setNewQuestion(' ');
        console.log(newQuestion);

        if (newQuestion.trim() === '') {
            new Error('empty question');
            return;
        }
        if (!user) {
            new Error('the user must be logged');
            return;
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighLighted: false,
            isAnswered: false,
        };

        await database.ref(`rooms/${roomId}/questions`).push(question);
    }

    return (
        <div>
            <header>
                <img src={logo} alt="let me ask logo" />
                <Copycode param={roomId} />
            </header>

            <main>
                <div className="titles">
                    <h1 className="room-name">Title</h1>
                    <h2>4 questions</h2>
                </div>
                <form className="room-form" onSubmit={(e) => handleSendQuestion(e)}>
                    <textarea name="" cols="1200" rows="6" className="question" placeholder="What do you want to ask?" aria-placeholder="What do you want to ask?" onChange={(e) => setNewQuestion(e.target.value)} />
                    <footer>
                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt="user avatar" />
                                <p>{user.name}</p>
                            </div>
                        ) : (
                            <p className="hint">
                                To send a question,
                                <Link to="/">make a login</Link>
                            </p>
                        )}
                        <Button type="submit">Send a question</Button>
                    </footer>
                </form>
            </main>
        </div>
    );
}
