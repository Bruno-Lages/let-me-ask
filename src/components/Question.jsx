/* eslint-disable react/prop-types */
import '../style/question.css';
import classNames from 'classnames';

// eslint-disable-next-line no-unused-vars
export function Question({
    author, content, children, isHighlighted = false, isAnswered = false,
}) {
    return (
        <div className={classNames('question', { answered: isAnswered }, { highlighted: isHighlighted })}>
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
    );
}
