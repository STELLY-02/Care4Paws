import React, { useContext, useState } from "react";
import "../components/Chatbot.css";
import Addicon from "../Assets/add-icon.svg";
import Chaticon from "../Assets/chat-icon.svg";
import Menuicon from "../Assets/menu-icon.svg";
// import AddPhotoIcon from "../Assets/add-photo-icon.svg";
import Logo from "../Assets/Logo_Care4Paws.png";
// import ArrowBackIcon from "../Assets/arrow-back-icon.svg";
// import MicIcon from "../Assets/mic-icon.svg";
import SendIcon from "../Assets/send-icon.svg";
import Avatar from "../Assets/account-circle-icon.svg";
import { Context } from "../content/Context";

const Chatbot = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    prevPrompt,
    setRecentPrompt,
    newChat,
  } = useContext(Context);
  const [extended, setExtended] = useState(false);
  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };
  return (
    <div className="Chatbot">
      <div className="slidebar">
        <div className="top">
          <img
            onClick={() => setExtended((prev) => !prev)}
            className="menu"
            src={Menuicon}
            alt=""
          />
          <div onClick={() => newChat()} className="new-chat">
            <img src={Addicon} alt="" />
            {extended ? <p>New Chat</p> : null}
          </div>
          {extended ? (
            <div className="recent">
              <p className="recent-title">Recent</p>
              {prevPrompt.map((item, index) => {
                return (
                  <div
                    onClick={() => loadPrompt(item)}
                    className="recent-entry"
                  >
                    <img src={Chaticon} alt="" />
                    <p>{item.slice(0, 18)}...</p>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
      <div className="ChatbotMain">
        <div className="chattop">
          <p>Chatbot</p>
        </div>
        <div className="containerchat">
          {!showResult ? (
            <>
              <div className="chatmiddle">
                <p>
                  <span>How can i help you?</span>
                </p>
              </div>
            </>
          ) : (
            <div className="result">
              <div className="result-title">
                <img src={Avatar} alt="" className="avatar" />
                <p>{recentPrompt}</p>
              </div>
              <div className="result-data">
                <img src={Logo} alt="" className="logo" />
                {loading ? (
                  <div className="loader">
                    <hr />
                    <hr />
                    <hr />
                  </div>
                ) : (
                  <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="chatbottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
            />
            <div>
              {/* <img src={AddPhotoIcon} alt="" />
              <img src={MicIcon} alt="" /> */}
              <img onClick={() => onSent()} src={SendIcon} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
