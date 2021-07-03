/* eslint-disable no-new */
import { useState, useContext, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { database } from '../config/firebase';

import { authContext } from '../contexts/authContext';

import { useRoom } from '../hooks/useRoom';

import { Button } from '../components/Button';
import { Copycode } from '../components/CopyCode';
import { Question } from '../components/Question';

import '../style/room.css';
import logo from '../assets/logo.svg';
import emptyQuestionsIcon from '../assets/empty-questions.svg';

export function Room() {
    const { user, signOutWithGoogle } = useContext(authContext);
    const roomId = useParams().id;
    const [newQuestion, setNewQuestion] = useState('');
    const history = useHistory();

    function turnButtonDisable() {
        const button = document.querySelector('#submit-button');
        if (Object.keys(user).length < 1) button.disabled = true;
    }

    useEffect(async () => {
        const roomData = await database.ref(`rooms/${roomId}`).get();
        if (roomData.val().closedAt) {
            alert('closed room');
            history.push('/');
        }
        if (user.id === roomData.val().authorId) {
            history.push(`/admin/rooms/${roomId}`);
        }
        turnButtonDisable();
    }, [user.id]);

    const { questions, tittle } = useRoom(roomId);

    function clearTextArea() {
        const textArea = document.querySelector('.new-question');
        textArea.value = '';
    }

    async function handleLike(questionId, likeId) {
        if (likeId) {
            database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();
        } else if (Object.keys(user).length) {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
                authorId: user.id,
            });
        } else {
            new Error('you must be logged to like a question');
        }
    }

    async function handleSendQuestion(e) {
        e.preventDefault();
        clearTextArea();
        setNewQuestion('');

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

    async function signOut() {
        await signOutWithGoogle();
    }

    return (
        <div>
            <header>
                <img src={logo} alt="let me ask logo" className="logo" />
                <div className="user-options">
                    <Copycode param={roomId} />
                    {Object.keys(user).length ? (<button type="button" className="sign-out" onClick={signOut}>sign out</button>) : ''}
                </div>
            </header>

            <main>
                <div className="titles">
                    <h1 className="room-name">{tittle}</h1>
                    {questions.length > 0 && (
                        <h2>{`${questions.length} ${questions.length > 1 ? 'questions' : 'question'}`}</h2>
                    )}
                </div>
                <form className="room-form" onSubmit={(e) => handleSendQuestion(e)}>
                    <textarea cols="1200" rows="6" className="new-question" placeholder="What do you want to ask?" aria-placeholder="What do you want to ask?" onChange={(e) => setNewQuestion(e.target.value)} />
                    <footer className="form-footer">
                        {Object.keys(user).length ? (
                            <div className="user-info user-info-form">
                                <img src={user.avatar} alt="user avatar" />
                                <p>{user.name}</p>
                            </div>
                        ) : (
                            <p className="hint">
                                To send a question,
                                <Link to="/">make a login</Link>
                            </p>
                        )}
                        <Button id="submit-button" type="submit">Send a question</Button>
                    </footer>
                </form>

                {questions.length === 0
                    ? (
                        <div className="empty-room">
                            <img src={emptyQuestionsIcon} alt="messages icon" />
                            <h3>There&apos;s no questions yet</h3>
                        </div>
                    )
                    : '' }

                {questions.map(((question) => (
                    <Question
                        author={question.author}
                        content={question.content}
                        key={question.id}
                        isHighlighted={question.isHighLighted}
                        isAnswered={question.isAnswered}
                    >
                        <button type="button" aria-label="like" className={`like ${question.likeId ? 'liked' : ''}`} onClick={() => handleLike(question.id, question.likeId)}>
                            { question.likeCount > 0
                                ? (
                                    <span>
                                        {`${question.likeCount} ${question.likeCount !== 1 ? 'likes' : 'like'}`}
                                    </span>
                                )
                                : '' }
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </Question>
                )))}
            </main>
        </div>
    );
}
