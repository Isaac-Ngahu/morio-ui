import React from "react";
import { useEffect, useState, useRef } from "react";
import "./App.css";
function ChatApp() {
  const [command, setCommand] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState([]);
  const messageContainerRef = useRef(null);
  const responseRef = useRef("");
  // const responseData = useRef(null);
  useEffect(() => {
    displayGuide();
  }, []);
  useEffect(() => {
    if (command === "device#status") {
      fetchData();
      responseRef.current = status.map((d, i) => {
        return (
          <div key={i}>
            {d.device_location} {d.device_name} {d.device_status}
          </div>
        );
      });
      //   setMessages([
      //     ...messages,
      //     { text: responseRef.current, sender: "received" },
      //   ]);
    }
  }, [command]);
  function handleCommandInput(e) {
    e.preventDefault();
    if (command.trim() !== "") {
      // Update state to store the messages
      setMessages([...messages, { text: command, sender: "sent" }]);
      // Clear the input field
      setCommand("");
      // Access the message container and append the new message
      if (messageContainerRef.current) {
        const newMessageElement = document.createElement("div");
        newMessageElement.textContent = command;
        newMessageElement.className = "message sent";
        messageContainerRef.current.appendChild(newMessageElement);

        // Optionally, scroll to the bottom to show the latest message
        messageContainerRef.current.scrollTop =
          messageContainerRef.current.scrollHeight;
      }
      handleCommandResponse(command);
    }
  }
  function displayGuide() {
    const guide = `To get device status: devices#status\n
       To write a command use this format: location_name#appliance#action e.g\n
       kitchen#lights#on or off\n
       sitting_room#door#open\n
       dining_room#thermostat#40degrees\n
       NOTE: DO NOT add space to your command
       `;
    responseRef.current = guide.split("\n").map((line, index) => {
      return <div key={index}>{line}</div>;
    });
    return setMessages([
      ...messages,
      { text: responseRef.current, sender: "received" },
    ]);
  }
  function fetchData() {
    fetch("http://localhost:3031/devices")
      .then((res) => res.json().then((data) => setStatus(data)))
      .catch((err) => console.log(err));
  }
  function checkMessage(messageToLowerCase) {
    const pattern = /^[\w]+#[\w]+#[\w]+$/;

    if (
      pattern.test(messageToLowerCase) === false &&
      messageToLowerCase === "device#status"
    ) {
      fetchData();

      responseRef.current = status.map((device) => {
        return (
          <div key={device.id}>
            {device.device_location} {device.device_name} {device.device_status}
          </div>
        );
      });
    } else if (pattern.test(messageToLowerCase) === false) {
      responseRef.current =
        "Please enter the command in the following order: location_name#appliance#action";
    } else {
      const splittedMessage = messageToLowerCase.split("#");
      const locationPattern = /^bedroom\d$/;
      const tempPattern = /^\d+degrees/;

      if (
        splittedMessage[0] !== "sitting_room" &&
        !locationPattern.test(splittedMessage[0]) &&
        splittedMessage[0] !== "kitchen" &&
        splittedMessage[0] !== "dining_room"
      ) {
        // setResponse(() => "Please enter a specific room in your house");
        responseRef.current = "Please enter a specific room in your house";
      } else if (
        splittedMessage[1] !== "lights" &&
        splittedMessage[1] !== "door" &&
        splittedMessage[1] !== "thermostat" &&
        splittedMessage[1] !== "speaker" &&
        splittedMessage[1] !== "tv"
      ) {
        // setResponse("Please enter a specific appliance");
        responseRef.current = "Please enter a specific room in your house";
      } else if (
        splittedMessage[2] !== "on" &&
        splittedMessage[2] !== "off" &&
        splittedMessage[2] !== "open" &&
        splittedMessage[2] !== "close" &&
        !tempPattern.test(splittedMessage[2])
      ) {
        // setResponse(() => "Please enter a specific action to be performed");
        responseRef.current = "Please enter a specific action to be performed";
      } else {
        // setResponse("");
        responseRef.current = "";
        return true;
      }
    }
  }
  // function iconToString(iconComponent) {
  //   const iconString = ReactDOMServer.renderToString(iconComponent);
  //   return iconString;
  // }
  function handleCommandResponse(message) {
    const messageToLowerCase = message.trim().toLowerCase();

    if (checkMessage(messageToLowerCase)) {
      const msgArray = messageToLowerCase.split("#");
      console.log(`${msgArray[0]} ${msgArray[1]} ${msgArray[2]} `);
      const thermostatId = "4627";
      const speakerId = "cc1d";
      const tvId = "cd52";

      if (msgArray[1] === "thermostat") {
        const updatedData = {
          device_name: "thermostat",
          device_status: msgArray[2],
          device_location: "sitting_room",
        };
        fetch(`http://localhost:3031/devices/${thermostatId}`, {
          method: "PUT", // or 'PATCH' depending on your API
          headers: {
            "Content-Type": "application/json",
            // Add any additional headers if needed
          },
          body: JSON.stringify(updatedData),
        })
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err));
        responseRef.current = `${msgArray[0]} thermostat set to ${msgArray[2]}`;
      } else if (msgArray[1] === "door") {
        responseRef.current = `${msgArray[0]} door ${msgArray[2]} successfully `;
      } else if (msgArray[1] === "speaker") {
        const updatedData = {
          device_name: "speaker",
          device_status: msgArray[2],
          device_location: "sitting_room",
        };
        fetch(`http://localhost:3031/devices/${speakerId}`, {
          method: "PUT", // or 'PATCH' depending on your API
          headers: {
            "Content-Type": "application/json",
            // Add any additional headers if needed
          },
          body: JSON.stringify(updatedData),
        })
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err));
        responseRef.current = `${msgArray[0]} ${msgArray[1]} turned ${msgArray[2]} successfully`;
      } else if (msgArray[1] === "tv") {
        const updatedData = {
          device_name: "tv",
          device_status: msgArray[2],
          device_location: "sitting_room",
        };
        fetch(`http://localhost:3031/devices/${tvId}`, {
          method: "PUT", // or 'PATCH' depending on your API
          headers: {
            "Content-Type": "application/json",
            // Add any additional headers if needed
          },
          body: JSON.stringify(updatedData),
        })
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err));
        responseRef.current = `${msgArray[0]} ${msgArray[1]} turned ${msgArray[2]} successfully`;
      } else {
        responseRef.current = `${msgArray[0]} ${msgArray[1]} turned ${msgArray[2]} successfully`;
      }
    }

    setMessages([
      ...messages,
      { text: responseRef.current, sender: "received" },
    ]);
  }

  return (
    <body>
      <div className="chat-container">
        <div className="chat-header">Morio app</div>
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
          <button>Send</button>
        </form>
      </div>
    </body>
  );
}

export default ChatApp;
