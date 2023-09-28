import "../../css/chat/Right.css"

const TypingBar = () => {
    return (
        <div className="typing-bar">
        <input type="text" placeholder="Message" />
        <button>
            <i className="fas fa-paper-plane"></i>
        </button>
        </div>
    );
}

export default TypingBar;