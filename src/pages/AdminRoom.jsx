/* eslint-disable no-restricted-globals */
import { useContext, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { database } from '../config/firebase';

import { authContext } from '../contexts/authContext';

import { useRoom } from '../hooks/useRoom';

import { Copycode } from '../components/CopyCode';
import { Question } from '../components/Question';

import '../style/adminRoom.css';
import logo from '../assets/logo.svg';

export function AdminRoom() {
    // eslint-disable-next-line no-unused-vars
    const { user } = useContext(authContext);
    const roomId = useParams().id;
    const history = useHistory();

    const { questions, tittle } = useRoom(roomId);

    useEffect(async () => {
        const roomData = await database.ref(`rooms/${roomId}`).get();
        if (user.id !== roomData.val().authorId) {
            history.push(`/rooms/${roomId}`);
        }
    }, [user.id]);

    async function handleCloseRoom() {
        if (confirm('Are you sure you want to close this room? You won\'t be able to reopen later')) {
            await database.ref(`rooms/${roomId}`).update({
                closedAt: new Date(),
            });

            history.push('/');
        }
    }

    async function handleDeleteQuestion(questionId) {
        // eslint-disable-next-line no-alert
        if (confirm('Are you sure you want to delete this question?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }
    return (
        <div>
            <header>
                <img src={logo} alt="let me ask logo" />
                <div className="buttons">
                    <Copycode param={roomId} />
                    <button type="button" className="close-room-button" onClick={() => handleCloseRoom()}>Close room</button>
                </div>
            </header>

            <main>
                <div className="titles">
                    <h1 className="room-name">{tittle}</h1>
                    {questions.length > 0 && (
                        <h2>{`${questions.length} ${questions.length > 1 ? 'questions' : 'question'}`}</h2>
                    )}
                </div>

                {questions.map(((question) => (
                    <Question
                        author={question.author}
                        content={question.content}
                        key={question.id}
                    >
                        <button type="button" className="button-options" aria-label="delete button" onClick={() => handleDeleteQuestion(question.id)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="delete">
                                <path d="M3 5.99988H5H21" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </Question>
                )))}
            </main>
        </div>
    );
}
