/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import { authContext } from '../contexts/authContext';
import { database } from '../config/firebase';

export function useRoom(roomId) {
    const [questions, setQuestions] = useState([]);
    const [tittle, setTittle] = useState('');
    const [embeddedVideo, setEmbeddedVideo] = useState('');
    const [platformVideo, setPlatformVideo] = useState('');
    const { user } = useContext(authContext);

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);
        roomRef.on('value', (room) => {
            const databaseRoom = room.val();
            const databaseQuestions = databaseRoom.questions ?? {};

            const parsedQuestions = Object.entries(databaseQuestions)
                .map(([key, value]) => ({
                    id: key,
                    author: value.author,
                    content: value.content,
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    // eslint-disable-next-line max-len
                    likeId: Object.entries(value.likes ?? {}).find(([keyLike, like]) => like.authorId === user.id)?.[0],
                    // eslint-disable-next-line max-len
                    responses: Object.entries(value.responses ?? {}).map(([commentId, response]) => ({
                        commentId,
                        comment: response.comment,
                    })),
                }));

            setQuestions(parsedQuestions);
            setTittle(databaseRoom.name);
            setEmbeddedVideo(databaseRoom.embeddedVideo);
            setPlatformVideo(databaseRoom.platformVideo);
        });
    }, [roomId, user.id]);

    return {
        questions, tittle, embeddedVideo, platformVideo,
    };
}
