"use client";
import React from "react";

// Replace these with your own client photos
const testimonials = [
  {
    type: "quote",
    text: "\"Ratoomals' elephant collection elevated our retail décor lineup and connected with customers worldwide.\"",
    name: "John Deo",
    role: "International Retail Buyer",
  },
  {
    type: "photo",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=80&auto=format&fit=crop",
    name: "John Deo",
    role: "International Retail Buyer",
  },
  {
    type: "quote",
    text: "\"Ratoomals' elephant collection elevated our retail décor lineup and connected with customers worldwide.\"",
    name: "John Deo",
    role: "International Retail Buyer",
  },
  {
    type: "photo",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop",
    name: "John Deo",
    role: "International Retail Buyer",
  },
  {
    type: "quote",
    text: "\"Ratoomals' elephant collection elevated our retail décor lineup and connected with customers worldwide.\"",
    name: "John Deo",
    role: "International Retail Buyer",
  },
  {
    type: "photo",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80&auto=format&fit=crop",
    name: "John Deo",
    role: "International Retail Buyer",
  },
];

const Testimonials = () => {
  // duplicate the list once so the marquee loop feels seamless
  const track = [...testimonials, ...testimonials];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');

        .tst-section {
          background-color: #FFFCF5;
          padding: 80px 72px 90px;
          overflow: hidden;
          font-family: 'Playfair Display', serif;
        }

        .tst-header {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
          margin-bottom: 48px;
        }

        .tst-eyebrow {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-weight: 500;
          font-size: 30px;
          color: #1a1a1a;
          margin: 0 0 10px;
        }

        .tst-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 30px;
          color: #1a1a1a;
          margin: 0;
        }

        .tst-rating {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          padding-bottom: 6px;
        }

        .tst-rating-score {
          font-size: 16px;
          font-family: 'Mona Sans';
          font-weight: 700;
          color: #1a1a1a;
        }

        .tst-stars {
          display: flex;
          gap: 2px;
        }

        .tst-star {
          width: 18px;
          height: 18px;
          fill: #F5A623;
        }

        .tst-brand {
          font-size: 18px;
          font-weight: 700;
          color: #3c3c3c;
          letter-spacing: -0.01em;
        }
          .tst-logo{
  height:26px;
  width:auto;
  object-fit:contain;
  display:block;
}

        .tst-brand-mark {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .tst-brand-icon {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          background: #C0392B;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          font-family: 'Playfair Display', serif;
        }

        .tst-carousel-viewport {
          overflow: hidden;
          width: 100%;
          -webkit-mask-image: linear-gradient(to right, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%);
          mask-image: linear-gradient(to right, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%);
        }

        .tst-track {
          display: flex;
          gap: 24px;
          width: max-content;
          padding: 0 40px;
          animation: tst-scroll 34s linear infinite;
        }

        .tst-track:hover {
          animation-play-state: paused;
        }

        @keyframes tst-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .tst-card {
          flex: 0 0 auto;
          width: 260px;
          height: 320px;
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }

        /* --- Quote card --- */
        .tst-card-quote {
          background-color: #FFF6EB;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
        }

        .tst-quote-mark {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 56px;
          line-height: 1;
          color: #8F561E;
          margin-bottom: 8px;
        }

        .tst-quote-text {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 14px;
          line-height: 1.6;
          color: #3a3a3a;
          flex: 1;
        }

        .tst-quote-name {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 14px;
          color: #1a1a1a;
          margin: 0 0 4px;
        }

        .tst-quote-role {
          font-family: 'Playfair Display', serif;
          font-size: 12px;
          color: #6b6b6b;
          margin: 0;
        }

        /* --- Photo card --- */
        .tst-card-photo {
          color: #fff;
        }

        .tst-photo-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .tst-photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0) 65%);
        }

        .tst-play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 46px;
          height: 46px;
          border-radius: 999px;
          background: rgba(255,255,255,0.9);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .tst-play-btn:hover {
          transform: translate(-50%, -50%) scale(1.08);
          background: #ffffff;
        }

        .tst-play-btn svg {
          width: 16px;
          height: 16px;
          margin-left: 2px;
          fill: #1a1a1a;
        }

        .tst-photo-info {
          position: absolute;
          left: 20px;
          bottom: 18px;
          right: 20px;
        }

        .tst-photo-name {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 15px;
          margin: 0 0 2px;
        }

        .tst-photo-role {
          font-family: 'Playfair Display', serif;
          font-size: 12px;
          opacity: 0.9;
          margin: 0;
        }
@media (max-width:640px){

  .tst-section{
    padding:60px 0 70px;
  }

  .tst-header{
    padding:0 20px;
    flex-direction:column;
    align-items:flex-start;
    gap:24px;
    margin-bottom:36px;
  }

  .tst-eyebrow{
    font-size:22px;
    margin-bottom:10px;
  }

  .tst-heading{
    font-size:26px;
    line-height:1.25;
    max-width:320px;
  }

  .tst-rating{
    width:100%;
    display:flex;
    flex-direction:column;
    align-items:flex-start;
    gap:14px;
    padding-bottom:0;
  }

  .tst-rating-score{
    font-size:16px;
  }

  .tst-stars{
    gap:4px;
  }

  .tst-star{
    width:20px;
    height:20px;
  }

  .tst-logo{
    height:30px;
    width:auto;
    display:block;
  }

  .tst-carousel-viewport{
    padding-left:20px;
    -webkit-mask-image:none;
    mask-image:none;
  }

  .tst-track{
    padding:0;
    gap:18px;
  }

  .tst-card{
    width:calc(100vw - 40px);
    max-width:240px;
    height:430px;
    border-radius:18px;
  }

  .tst-card-quote{
    padding:28px 22px;
  }

  .tst-quote-mark{
    font-size:54px;
  }

  .tst-quote-text{
    font-size:15px;
    line-height:1.8;
  }

  .tst-quote-name{
    font-size:16px;
  }

  .tst-quote-role{
    font-size:13px;
  }

  .tst-play-btn{
    width:52px;
    height:52px;
  }

  .tst-play-btn svg{
    width:18px;
    height:18px;
  }

  .tst-photo-info{
    left:18px;
    right:18px;
    bottom:18px;
  }

  .tst-photo-name{
    font-size:16px;
  }

  .tst-photo-role{
    font-size:13px;
  }

}
      `}</style>

      <section className="tst-section">
        <div className="tst-header">
          <div>
            <p className="tst-eyebrow">Testimonials</p>
            <h2 className="tst-heading">Global Partners &amp; Happy Clients</h2>
          </div>

          <div className="tst-rating">
            <span className="tst-rating-score">4.8 Reviews</span>
            <span className="tst-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="tst-star" viewBox="0 0 24 24">
                  <path d="M12 2l2.9 6.6L22 9.3l-5 4.9 1.2 7.1L12 17.8l-6.2 3.5L7 14.2 2 9.3l7.1-0.7L12 2z" />
                </svg>
              ))}
            </span>
          <img
  src="/images/icons/Google.png"
  alt="Google"
  className="tst-logo"
/>
<img
  src="/images/icons/IndiaMART.png"
  alt="IndiaMART"
  className="tst-logo"
/>
          </div>
        </div>

        <div className="tst-carousel-viewport">
          <div className="tst-track">
            {track.map((item, idx) =>
              item.type === "quote" ? (
                <div className="tst-card tst-card-quote" key={idx}>
                  <span className="tst-quote-mark">&#8220;</span>
                  <p className="tst-quote-text">{item.text}</p>
                  <p className="tst-quote-name">{item.name}</p>
                  <p className="tst-quote-role">{item.role}</p>
                </div>
              ) : (
                <div className="tst-card tst-card-photo" key={idx}>
                  <img className="tst-photo-img" src={item.photo} alt={item.name} />
                  <div className="tst-photo-overlay" />
                  <button className="tst-play-btn" aria-label="Play video">
                    <svg viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <div className="tst-photo-info">
                    <p className="tst-photo-name">{item.name}</p>
                    <p className="tst-photo-role">{item.role}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;