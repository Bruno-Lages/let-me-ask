/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-globals */
import { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { FaEllipsisV, FaMoon } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';
import Modal from 'react-modal';
import ClipLoader from 'react-spinners/ClipLoader';
import { Toaster, toast } from 'react-hot-toast';

import { database } from '../config/firebase';

import { authContext } from '../contexts/authContext';

import { useRoom } from '../hooks/useRoom';

import { Copycode } from '../components/CopyCode';
import { Question } from '../components/Question';

import logo from '../assets/logo.svg';
import darkModeLogo from '../assets/dark-mode-logo.svg';
import emptyQuestionsIcon from '../assets/empty-questions.svg';
import { Button } from '../components/Button';

export function AdminRoom() {
    // eslint-disable-next-line no-unused-vars
    const {
        user, signOutWithGoogle, setIsLoading, isLoading, darkMode,
        setDarkMode,
    } = useContext(authContext);
    const roomId = useParams().id;
    const history = useHistory();
    const [signOutModal, toggleSignOutModal] = useState(false);
    const [closeRoomModal, toggleCloseRoomModal] = useState(false);
    const [removeCommentModal, toggleRemoveCommentRoomModal] = useState(false);
    const [embedVideoModal, toggleEmbedVideoModal] = useState(false);
    const [embedVideoIframe, toggleEmbedVideoIframe] = useState(true);
    const [deletedQuestion, setDeletedQuestion] = useState('');
    Modal.setAppElement('#root');

    const {
        questions, tittle, embeddedVideo, platformVideo,
    } = useRoom(roomId);

    function clearLoadingOverlay() {
        const menu = document.querySelector('.spinner-overlay');
        menu.classList.add('disactivated');
    }

    async function signOut() {
        await signOutWithGoogle();
    }

    function handleMenu() {
        const menu = document.querySelector('.options-menu');
        menu.classList.toggle('activated');
    }

    function checkDarkMode() {
        const { body } = document;
        const textInput = document.querySelector('.new-question');
        const header = document.querySelector('header');
        darkMode ? body.classList.add('dark-body') : body.classList.remove('dark-body');
        darkMode ? textInput?.classList.add('dark-text-area') : textInput?.classList.remove('dark-text-area');
        darkMode ? header.classList.add('dark-header') : header.classList.remove('dark-header');
    }

    useEffect(() => {
        async function Checkuser() {
            const roomData = await database.ref(`rooms/${roomId}`).get();
            if (roomData.val().closedAt) {
                toast.error('closed room');
                history.push('/');
            }
            if (user.id !== roomData.val().authorId) {
                history.push(`/rooms/${roomId}`);
            }
            setTimeout(() => {
                setIsLoading(false);
                clearLoadingOverlay();
            }, 600);
            checkDarkMode();
        }

        return Checkuser();
    }, [user.id, darkMode]);

    async function handleCloseRoom() {
        await database.ref(`rooms/${roomId}`).update({
            closedAt: new Date(),
        });

        history.push('/');
    }

    async function SetEmbedVideo(videoId, platform) {
        database.ref(`rooms/${roomId}`).update({
            embeddedVideo: videoId,
            platformVideo: platform,
        });
    }

    // eslint-disable-next-line consistent-return
    function renderEmbeddedVideo() {
        switch (platformVideo) {
        case 'youtu.be':
            return <iframe width="100%" height="378" src={`https://www.youtube.com/embed/${embeddedVideo}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="embedded-video" />;
        case 'www.twitch.tv':
            return <iframe src={`https://player.twitch.tv/?channel=${embeddedVideo}&parent=let-me-ask-9fcc1.web.app`} frameBorder="0" allowFullScreen scrolling="no" height="378" width="100%" title={`Twitch video player: ${embeddedVideo}`} className="embedded-video" />;
        default:
            break;
        }
    }

    async function handleEmbedVideo(e) {
        e.preventDefault();
        let videoURL = e.target.firstElementChild.value;
        videoURL = videoURL.split('/');
        const platform = videoURL[videoURL.length - 2];
        videoURL = videoURL[videoURL.length - 1];
        SetEmbedVideo(videoURL, platform);
        console.log(platform);
    }

    async function handleCheckQuestionAsAnswered(questionId) {
        const questionData = await database.ref(`rooms/${roomId}/questions/${questionId}`).get();
        const questionRef = await database.ref(`rooms/${roomId}/questions/${questionId}`);
        if (questionData.val().isAnswered === true) {
            await questionRef.update({
                isAnswered: false,
            });
            return;
        }
        await questionRef.update({
            isAnswered: true,
            isHighLighted: false,
        });
    }

    async function handleHighlightQuestion(questionId) {
        const questionData = await database.ref(`rooms/${roomId}/questions/${questionId}`).get();
        const questionRef = await database.ref(`rooms/${roomId}/questions/${questionId}`);
        if (questionData.val().isHighLighted === false) {
            await questionRef.update({
                isHighLighted: true,
            });
            return;
        }
        await questionRef.update({
            isHighLighted: false,
        });
    }

    async function handleDeleteQuestion(questionId) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }

    async function handleComment(comment, questionId) {
        await database.ref(`rooms/${roomId}/questions/${questionId}/responses`).push({ comment });
    }

    function createSubmiticon() {
        const svg = '<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M476.59 227.05l-.16-.07L49.35 49.84A23.56 23.56 0 0027.14 52 24.65 24.65 0 0016 72.59v113.29a24 24 0 0019.52 23.57l232.93 43.07a4 4 0 010 7.86L35.53 303.45A24 24 0 0016 327v113.31A23.57 23.57 0 0026.59 460a23.94 23.94 0 0013.22 4 24.55 24.55 0 009.52-1.93L476.4 285.94l.19-.09a32 32 0 000-58.8z" /></svg>';
        return svg;
    }

    function createForm() {
        const form = document.createElement('form');
        form.setAttribute('class', 'response-form');
        const textArea = document.createElement('textarea');
        textArea.setAttribute('placeHolder', 'Send a response');
        textArea.setAttribute('ariaLabel', 'Send a response');
        const submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'submit');
        submitButton.setAttribute('class', 'send-button');
        const svg = createSubmiticon();
        submitButton.innerHTML = svg;
        form.appendChild(textArea);
        form.appendChild(submitButton);
        return form;
    }

    function handleCommentSection(questionId) {
        const main = document.querySelector('main');
        const question = document.querySelector(`#${questionId}`);
        if (question.nextElementSibling === null || question.nextElementSibling.tagName === 'DIV') {
            const comment = createForm();
            main.insertBefore(comment, question.nextElementSibling);
            comment.addEventListener('submit', (e) => {
                e.preventDefault();
                handleComment(e.target.firstElementChild.value, questionId);
                handleCommentSection(questionId);
            });
            return;
        }
        main.removeChild(question.nextElementSibling);
    }

    return (
        <div>

            <div className="spinner-overlay" aria-hidden="true">
                <ClipLoader size={100} className="modal" loading={isLoading} speedMultiplier={1} color="#835afd" />
            </div>

            <header>
                <img src={darkMode ? darkModeLogo : logo} alt="let me ask logo" className="logo" />
                <div className="user-options">
                    <Copycode param={roomId} />
                    <button
                        type="button"
                        aria-label="dark-mode-button"
                        className="dark-mode-button"
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        <FaMoon size={20} color={`${darkMode ? '#835afd52' : '#212035'}`} />
                    </button>
                    {Object.keys(user).length ? (
                        <button type="button" aria-label="more options icon" className="three-dots"><FaEllipsisV size={20} color={`${darkMode ? '#835afd52' : '#212035'}`} onClick={() => handleMenu()} /></button>
                    ) : ''}
                </div>
            </header>

            <Toaster position="top-center" reverseOrder={false} />

            <Modal isOpen={embedVideoModal} ontentLabel="embed your video to this room" overlayClassName="overlay" className="modal" aria-hidden="true">
                <h3>Embed your video</h3>
                <span className="hint">
                    To embed your video, follow the steps:
                    <ol>
                        <li>In your video, click in &quot;share&quot;.</li>
                        <li>Copy the link.</li>
                        <li>Paste into the input below.</li>
                    </ol>
                </span>
                <form onSubmit={(e) => {
                    handleEmbedVideo(e);
                    toggleEmbedVideoModal(false);
                }}
                >
                    <input type="text" placeholder="Paste your video link" aria-placeholder="place your video link" />
                    <div className="buttons-options">
                        <button type="button" className="cancel-button" onClick={() => toggleEmbedVideoModal(false)}>cancel</button>
                        <button
                            type="submit"
                            className="confirm-button"
                        >
                            Embeed
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={closeRoomModal} ontentLabel="Close room confirmation" overlayClassName="overlay" className="modal" aria-hidden="true">
                <h3>Close room?</h3>
                <span className="hint">Are you sure you want to close this room? You won&apos;t be able to reopen later</span>
                <div className="buttons-options">
                    <button type="button" className="cancel-button" onClick={() => toggleCloseRoomModal(false)}>cancel</button>
                    <button
                        type="button"
                        className="confirm-button"
                        onClick={() => {
                            handleCloseRoom();
                            toggleCloseRoomModal(false);
                        }}
                    >
                        Close room
                    </button>
                </div>
            </Modal>

            <Modal isOpen={signOutModal} ontentLabel="Sign out confirmation" overlayClassName="overlay" className="modal" aria-hidden="true">
                <h3>Sign out</h3>
                <span className="hint">Are you sure you want to exit?</span>
                <div className="buttons-options">
                    <button type="button" className="cancel-button" onClick={() => toggleSignOutModal(false)}>cancel</button>
                    <button
                        type="button"
                        className="confirm-button"
                        onClick={() => {
                            signOut();
                            toggleSignOutModal(false);
                        }}
                    >
                        Exit
                    </button>
                </div>
            </Modal>

            <Modal isOpen={removeCommentModal} ontentLabel="Delete comment confirmation" overlayClassName="overlay" className="modal" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="delete-svg">
                    <path d="M3 5.99988H5H21" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3>Delete comment?</h3>
                <span className="hint">Are you sure you want to delete this comment?</span>
                <div className="buttons-options">
                    <button type="button" className="cancel-button" onClick={() => toggleRemoveCommentRoomModal(false)}>cancel</button>
                    <button
                        type="button"
                        className="confirm-button"
                        onClick={() => {
                            handleDeleteQuestion(deletedQuestion);
                            toggleRemoveCommentRoomModal(false);
                        }}
                    >
                        Delete
                    </button>
                </div>
            </Modal>

            <nav className="options-menu">
                <ul>
                    <li>
                        <button type="button" onClick={() => toggleEmbedVideoModal(true)}>
                            Embed video
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            className="close-room-button"
                            onClick={() => toggleCloseRoomModal(true)}
                        >
                            Close room
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            className="sign-out"
                            onClick={() => {
                                toggleSignOutModal(true);
                                handleMenu();
                            }}
                        >
                            Sign out
                        </button>
                    </li>
                </ul>
            </nav>

            <main>
                <div className="titles">
                    <h1 className="room-name">{tittle}</h1>
                    {questions.length > 0 && (
                        <h2>{`${questions.length} ${questions.length > 1 ? 'questions' : 'question'}`}</h2>
                    )}
                </div>

                {embeddedVideo === undefined || embedVideoIframe === false ? ''
                    : (
                        renderEmbeddedVideo()
                    )}
                {embeddedVideo === undefined ? ''
                    : (
                        <Button type="buttom" onClick={() => toggleEmbedVideoIframe(!embedVideoIframe)}>
                            { embedVideoIframe ? 'Hide video' : 'Show video'}
                        </Button>
                    )}

                {questions.length === 0
                    ? (
                        <div className="empty-room">
                            <img src={emptyQuestionsIcon} alt="messages icon" />
                            <h3>There&apos;s no questions yet</h3>
                            <p>Send the room code to your friends and start to reply!</p>
                        </div>
                    ) : ''}
                {(questions.filter((question) => question.isHighLighted && !question.isAnswered)
                    .map((question) => (
                        <Question
                            author={question.author}
                            content={question.content}
                            key={question.id}
                            id={question.id}
                            isHighlighted={question.isHighLighted}
                            isAnswered={question.isAnswered}
                            responses={question.responses}
                        >
                            <button type="button" className="answer-button" aria-label="check question as answered button" onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12.0003" cy="11.9998" r="9.00375" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button type="button" className="highlight-button" aria-label="highlight button" onClick={() => handleHighlightQuestion(question.id)}>
                                <HiOutlineSparkles size={25} />
                            </button>
                            <button
                                type="button"
                                className="delete-button"
                                aria-label="delete button"
                                onClick={() => {
                                    setDeletedQuestion(question.id);
                                    toggleRemoveCommentRoomModal(true);
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="delete">
                                    <path d="M3 5.99988H5H21" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                className="comment-button"
                                aria-label="comment button"
                                onClick={() => {
                                    handleCommentSection(question.id);
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </Question>
                    )))}
                {(questions.filter((question) => !question.isHighLighted && !question.isAnswered)
                    .sort((question1, question2) => question2.likeCount - question1.likeCount)
                    .map((question) => (
                        <Question
                            author={question.author}
                            content={question.content}
                            key={question.id}
                            id={question.id}
                            isHighlighted={question.isHighLighted}
                            isAnswered={question.isAnswered}
                            responses={question.responses}
                        >
                            <button type="button" className="answer-button" aria-label="check question as answered button" onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12.0003" cy="11.9998" r="9.00375" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button type="button" className="highlight-button" aria-label="highlight button" onClick={() => handleHighlightQuestion(question.id)}>
                                <HiOutlineSparkles size={25} />
                            </button>
                            <button
                                type="button"
                                className="delete-button"
                                aria-label="delete button"
                                onClick={() => {
                                    setDeletedQuestion(question.id);
                                    toggleRemoveCommentRoomModal(true);
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="delete">
                                    <path d="M3 5.99988H5H21" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                className="comment-button"
                                aria-label="comment button"
                                onClick={() => {
                                    handleCommentSection(question.id);
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </Question>
                    )))}
                {(questions.filter((question) => question.isAnswered).map((question) => (
                    <Question
                        author={question.author}
                        content={question.content}
                        key={question.id}
                        id={question.id}
                        isHighlighted={question.isHighLighted}
                        isAnswered={question.isAnswered}
                        responses={question.responses}
                    >
                        <button type="button" className="answer-button" aria-label="check question as answered button" onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12.0003" cy="11.9998" r="9.00375" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button type="button" className="highlight-button" aria-label="highlight button" onClick={() => handleHighlightQuestion(question.id)}>
                            <HiOutlineSparkles size={25} />
                        </button>
                        <button
                            type="button"
                            className="delete-button"
                            aria-label="delete button"
                            onClick={() => {
                                setDeletedQuestion(question.id);
                                toggleRemoveCommentRoomModal(true);
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="delete">
                                <path d="M3 5.99988H5H21" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="comment-button"
                            aria-label="comment button"
                            onClick={() => {
                                handleCommentSection(question.id);
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </Question>
                )))}
            </main>
        </div>
    );
}
