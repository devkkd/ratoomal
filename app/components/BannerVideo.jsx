"use client";

export default function BannerVideo() {
  return (
    <>
      <section className="video-section">
        <div className="video-container">
          <video
            className="banner-video"
            src="/banner-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>
      </section>

      <style jsx>{`
        .video-section {
          width: 100%;
          background: #fcf8f1;
          padding: 0;
        }

        .video-container {
          width: 100%;
        
          margin: 0 auto;
          overflow: hidden;
          border-radius: 0;
        }

        .banner-video {
          width: 100%;
          height: 620px;
          display: block;
          object-fit: cover;
          object-position: center;
          pointer-events: none;
          user-select: none;
        }

        @media (max-width: 1200px) {
          .banner-video {
            height: 520px;
          }
        }

        @media (max-width: 991px) {
          .video-section {
            padding: 0;
          }

          .banner-video {
            height: 420px;
            object-fit: cover;
          }
        }

        @media (max-width: 600px) {
          .banner-video {
            height: 300px;
            object-fit: cover;
            object-position: center;
          }
        }
      `}</style>
    </>
  );
}