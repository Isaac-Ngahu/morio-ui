import React from "react";
import { useEffect, useState, useRef } from "react";
import "./App.css";
function ChatApp() {
  const [command, setCommand] = useState("");
  const [messages, setMessages] = useState([]);
  const messageContainerRef = useRef(null);
  const responseRef = useRef("");
  const number = sessionStorage.getItem("number");
  // const responseData = useRef(null);
  useEffect(() => {
    displayGuide();
  }, [number]);

  function handleCommandInput(e) {
    e.preventDefault();
    if (command.trim() !== "") {
      setMessages([...messages, { text: command, sender: "sent" }]);
      setCommand("");
      if (messageContainerRef.current) {
        const newMessageElement = document.createElement("div");
        newMessageElement.textContent = command;
        newMessageElement.className = "message sent";
        messageContainerRef.current.appendChild(newMessageElement);
        messageContainerRef.current.scrollTop =
          messageContainerRef.current.scrollHeight;
      }
      handleCommandResponse(command);
    }
  }
  function delayResponse(resp) {
    responseRef.current = resp;
    return setMessages([
      ...messages,
      { text: responseRef.current, sender: "received" },
    ]);
  }
  function sendMatches(matches) {
    responseRef.current = matches;
    return setTimeout(
      () =>
        setMessages([
          ...messages,
          { text: responseRef.current, sender: "received" },
        ]),
      6000
    );
  }
  function displayGuide() {
    const number = sessionStorage.getItem("number");
    fetch(`http://127.0.0.1:5000/messages/${number}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.update !== "no updates") {
          responseRef.current = data.update;
          return setMessages([
            ...messages,
            { text: responseRef.current, sender: "received" },
          ]);
        } else {
          responseRef.current = "enter penzi to start";
          return setMessages([
            ...messages,
            { text: responseRef.current, sender: "received" },
          ]);
        }
      });
  }

  // function iconToString(iconComponent) {
  //   const iconString = ReactDOMServer.renderToString(iconComponent);
  //   return iconString;
  // }
  function handleCommandResponse(message) {
    const phone_number = sessionStorage.getItem("number");
    const userInfo = {
      message: message,
      number: phone_number,
    };
    fetch("http://127.0.0.1:5000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    }).then((res) => {
      res.json().then((data) => {
        console.log(data);
        if (
          data.response.slice(0, 7).toLowerCase() === "we have" &&
          data.response.length > 2
        ) {
          const position = data.response.search("22141");
          const firstString = data.response.slice(0, position + 5);
          const secondString = data.response.slice(position + 5);

          delayResponse(firstString);
          sendMatches(secondString);
          return;
        }
        // setResponse(data.response);
        responseRef.current = data.response;
        setMessages([
          ...messages,
          { text: responseRef.current, sender: "received" },
        ]);
      });
    });
    // .catch((error) => (responseRef.current = JSON.stringify(error)));
    // responseRef.current = response;
  }

  return (
    <body>
      <div className="chat-container">
        <div className="chat-header">Penzi app</div>
        <div className="chat-messages" ref={messageContainerRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <form className="chat-input" onSubmit={handleCommandInput}>
          <input
            type="text"
            placeholder="Type your command..."
            value={command}
            onChange={(e) => setCommand(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </body>
  );
}

export default ChatApp;
