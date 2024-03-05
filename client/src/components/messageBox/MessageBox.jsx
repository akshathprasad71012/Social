import "./messageBox.css";

export default function MessageBox(props) {
  const message = props.message;
  const userId = props.user;
  return (
    <>
      <div className="messageContainer">
        <div
          className={
            message.sender === userId
              ? "messagebubbleBlue"
              : "messagebubbleGrey"
          }
        >
          <p>{message.text}</p>
        </div>
      </div>
    </>
  );
}
