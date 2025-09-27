import React from "react";

const photos = [
  "https://www.solitarytraveller.com/wp-content/uploads/2025/04/Best-Places-Visit-India-During-Rainy-Season-Mahabaleshwar-Maharashtra-1024x768.webp",
  "https://blog.thomascook.in/wp-content/uploads/2018/05/Lansdowne1-e1527130839237.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDzyKiA_YT5SzOcfoEIQ1L-5eRajzK0SvBUg&s",
  "https://i.pinimg.com/736x/f9/18/5d/f9185df520a8230154ee1299a06c77e3.jpg",

];

export default function PhotoCollage() {
  return (
    <>
      <style>{`
        .collage-container {
          margin: 20% 10%;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          position: relative;
        }
        .photo-wrapper {
          width: 420px;
          height: 320px;
          border: 3px solid white;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.2);
          transition: transform 0.3s ease;
        }
        .photo-wrapper:hover {
          transform: scale(1.05) rotate(0deg);
          z-index: 10;
          box-shadow: 0 10px 15px rgba(0,0,0,0.3);
        }
        img.photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Zigzag alignment */
        .left {
          align-self: flex-start;
          transform-origin: center center;
        }
        .right {
          align-self: flex-end;
          transform-origin: center center;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .collage-container {
            margin: 5% 5%;
          }
          .photo-wrapper {
            width: 90vw;
            height: auto;
            max-height: 320px;
          }
        }
      `}</style>

      <div className="collage-container">
        {photos.map((src, index) => {
          // random rotation between -10 and 10 degrees
          const rotation = (Math.random() * 30 - 10).toFixed(2);

          return (
            <div
              key={index}
              className={`photo-wrapper ${index % 2 === 0 ? "left" : "right"}`}
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <img className="photo" src={src} alt={`Memory ${index + 1}`} />
            </div>
          );
        })}
      </div>
    </>
  );
}