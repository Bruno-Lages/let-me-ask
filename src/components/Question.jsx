/* eslint-disable react/prop-types */

import '../style/question.css';

// eslint-disable-next-line no-unused-vars
export function Question({ author, content, children }) {
    return (
        <div className="question">
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt="user avatar" />
                    <p>{author.name}</p>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    );
}
