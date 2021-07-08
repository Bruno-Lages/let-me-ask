/* eslint-disable react/prop-types */
import '../style/question.css';
import classNames from 'classnames';

import { useContext } from 'react';
import { authContext } from '../contexts/authContext';

export function Question({
    author, content, children, isHighlighted = false, isAnswered = false, id, responses,
}) {
    const { darkMode } = useContext(authContext);
    return (
        <>
            <div
                className={classNames(
                    'question',
                    { answered: isAnswered },
                    { highlighted: isHighlighted },
                    { darkHighlighted: darkMode && isHighlighted },
                    { darkAnswered: darkMode && isAnswered },
                    { dark: darkMode && !isHighlighted && !isAnswered },
                )}
                id={id}
            >
                <p>{content}</p>
                <footer>
                    <div className="user-info">
                        <img src={author.avatar} alt="user avatar" />
                        <p>{author.name}</p>
                    </div>
                    <div className="button-options">
                        {children}
                    </div>
                </footer>
            </div>
            {responses ? (
                responses
                    .map(
                        (response) => (
                            <div key={response.commentId} className="response">
                                {response.comment}
                            </div>
                        ),
                    )
            )
                : '' }
        </>
    );
}
