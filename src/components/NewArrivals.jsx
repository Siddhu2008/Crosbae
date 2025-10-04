import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import tvImage from "../assets/tv.png";

import "../styles/NewArrivals.css"
      

export default function NewArrivals() {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  useEffect(() => {
    // Set initial muted state
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div>
      <div className="header-section ">
        <div className="new-arrivals-grid ">
          {/* Left Content */}
          <div className="arrivals-left" data-aos="fade-up">
            <h2>
              New Arrivals{" "}
            <Link to='/shop'>
              <button className="new-items-badge">500+ New Items</button>
              </Link>
            </h2>
            <h5>
              New Arrivals Dropping Daily, Monday through Friday. Explore the
              Latest Launches Now!
            </h5>
            <Link to='/shop'>
              <button className="btn-gradient-new">View all New Items</button>
            </Link>
          </div>

          {/* Right Video/TV */}
          <div className="arrivals-right" data-aos="fade-up">
            <div className="tv-wrapper">
              <div className="video-overlay">
                <video
                  ref={videoRef}
                  className="video1"
                  autoPlay
                  playsInline
                  loop
                >
                  <source
                    src="https://cdn1.fireworktv.com/medias/2024/12/20/1734679771-iwgzlfdj/watermarked/720/DiamondsareallyouneedtounleashthatmaincharacterenergyWhetheryoustylethemasstatementpiecesorlayerthemtomakeafashionstatement,Tanishq%E2%80%99swiderangeofjewelleryhe.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>

                <img src={tvImage} alt="TV Frame" className="imgtv" />

                <button className="mute-btn" onClick={toggleMute}>
                  <i
                    className={
                      isMuted
                        ? "bi bi-mic-mute-fill fs-3"
                        : "bi bi-mic-fill fs-3"
                    }
                  ></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
