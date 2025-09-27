import React from "react";

export default function NextPage() {
  return (
    <>
      <style>{`
        /* Removed overflow hidden from root elements */
        body, html, #root {
          margin: 0; padding: 0; min-height: 100%;
          background: linear-gradient(135deg, #fff7f0, #fcd9de);
          font-family: Arial, sans-serif;
          position: relative;
          overflow-y: auto; /* allow vertical scrolling */
        }

        .container {
          position: relative;
          width: 100vw;
          min-height: 100vh; /* allow container to grow */
          /* overflow hidden removed */
          background: transparent;
        }

        .emoji {
          position: absolute;
          font-size: 1.5rem;
          opacity: 0.1;
          user-select: none;
          pointer-events: none;
          animation: float 8s ease-in-out infinite alternate;
          color: #000; /* ensure emojis are visible */
          mix-blend-mode: multiply; /* subtle blending */
        }

        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(-8px) translateX(6px); }
        }

        /* Positions and delays for 30 emojis */
        .emoji1  { top: 5%;   left: 10%;  animation-delay: 0s; }
        .emoji2  { top: 10%;  left: 25%;  animation-delay: 0.5s; }
        .emoji3  { top: 15%;  left: 40%;  animation-delay: 1s; }
        .emoji4  { top: 20%;  left: 55%;  animation-delay: 1.5s; }
        .emoji5  { top: 25%;  left: 70%;  animation-delay: 2s; }
        .emoji6  { top: 30%;  left: 85%;  animation-delay: 2.5s; }
        .emoji7  { top: 35%;  left: 20%;  animation-delay: 3s; }
        .emoji8  { top: 40%;  left: 35%;  animation-delay: 3.5s; }
        .emoji9  { top: 45%;  left: 50%;  animation-delay: 4s; }
        .emoji10 { top: 50%;  left: 65%;  animation-delay: 4.5s; }
        .emoji11 { top: 55%;  left: 80%;  animation-delay: 5s; }
        .emoji12 { top: 60%;  left: 15%;  animation-delay: 5.5s; }
        .emoji13 { top: 65%;  left: 30%;  animation-delay: 6s; }
        .emoji14 { top: 70%;  left: 45%;  animation-delay: 6.5s; }
        .emoji15 { top: 75%;  left: 60%;  animation-delay: 7s; }
        .emoji16 { top: 80%;  left: 75%;  animation-delay: 7.5s; }
        .emoji17 { top: 85%;  left: 90%;  animation-delay: 8s; }
        .emoji18 { top: 90%;  left: 25%;  animation-delay: 8.5s; }
        .emoji19 { top: 10%;  left: 70%;  animation-delay: 0.3s; }
        .emoji20 { top: 15%;  left: 85%;  animation-delay: 0.8s; }
        .emoji21 { top: 35%;  left: 10%;  animation-delay: 3.2s; }
        .emoji22 { top: 45%;  left: 30%;  animation-delay: 4.1s; }
        .emoji23 { top: 55%;  left: 50%;  animation-delay: 5.6s; }
        .emoji24 { top: 65%;  left: 70%;  animation-delay: 6.3s; }
        .emoji25 { top: 75%;  left: 90%;  animation-delay: 7.1s; }
        .emoji26 { top: 85%;  left: 15%;  animation-delay: 7.9s; }
        .emoji27 { top: 25%;  left: 5%;   animation-delay: 1.8s; }
        .emoji28 { top: 60%;  left: 85%;  animation-delay: 5.7s; }
        .emoji29 { top: 35%;  left: 75%;  animation-delay: 3.6s; }
        .emoji30 { top: 80%;  left: 40%;  animation-delay: 7.7s; }
      `}</style>

      <div className="container">
        {/* Emojis */}
        <span className="emoji emoji1">🍃</span>
        <span className="emoji emoji2">🌸</span>
        <span className="emoji emoji3">🌿</span>
        <span className="emoji emoji4">🍂</span>
        <span className="emoji emoji5">🌼</span>
        <span className="emoji emoji6">🌺</span>
        <span className="emoji emoji7">🍁</span>
        <span className="emoji emoji8">🌻</span>
        <span className="emoji emoji9">🌾</span>
        <span className="emoji emoji10">🍀</span>
        <span className="emoji emoji11">🍃</span>
        <span className="emoji emoji12">🌸</span>
        <span className="emoji emoji13">🌿</span>
        <span className="emoji emoji14">🍂</span>
        <span className="emoji emoji15">🌼</span>
        <span className="emoji emoji16">🌺</span>
        <span className="emoji emoji17">🍁</span>
        <span className="emoji emoji18">🌻</span>
        <span className="emoji emoji19">🍃</span>
        <span className="emoji emoji20">🌸</span>
        <span className="emoji emoji21">🌿</span>
        <span className="emoji emoji22">🍂</span>
        <span className="emoji emoji23">🌼</span>
        <span className="emoji emoji24">🌺</span>
        <span className="emoji emoji25">🍁</span>
        <span className="emoji emoji26">🌻</span>
        <span className="emoji emoji27">🌾</span>
        <span className="emoji emoji28">🍀</span>
        <span className="emoji emoji29">🍃</span>
        <span className="emoji emoji30">🌸</span>

        {/* <PhotoCollage /> */}
      </div>
    </>
  );
}
