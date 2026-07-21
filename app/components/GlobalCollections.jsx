"use client";

const collections = [
  {
    title: "Elephants",
    image: "/images/global/1.png",
  },
  {
    title: "Owls",
    image: "/images/global/2.png",
  },
  {
    title: "Incense Burners",
    image: "/images/global/3.png",
  },
  {
    title: "Ganesha",
    image: "/images/global/4.png",
  },
  {
    title: "Candle Holders",
    image: "/images/global/5.png",
  },
  {
    title: "Contemporary Products",
    image: "/images/global/9.png",
  },
  {
    title: "Wall Hangings",
    image: "/images/global/7.png",
  },
];

export default function GlobalCollections() {
  return (
    <>
      <section className="global-section">

        <div className="global-container">

          <div className="global-top">

            <div className="global-heading">

              <h2>
                Global Export Collections
              </h2>

            </div>

            <div className="global-content">

              <p>
                From classic Indian icons to elegant decor and wildlife figures,
                our handcrafted collections are curated specifically for
                international export, retail resale, and custom commercial
                spaces.
              </p>

            </div>

          </div>

     <div className="collection-grid">
  {collections.map((item, index) => (
    <div
      key={index}
      className={`collection-card ${
        index >= 4 ? "bottom-row" : ""
      }`}
    >
      <div className="collection-image">
        <img
          src={item.image}
          alt={item.title}
        />
      </div>

      <h3>{item.title}</h3>
    </div>
  ))}
</div>

</div>

</section>

<style jsx>{`

.global-section{
  width:100%;
  background:#FFFCF5;
  padding:90px 102px;
}

.global-container{
  width:100%;
  max-width:1400px;
  margin:0 auto;
}

.global-top{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:90px;
  margin-bottom:65px;
}

.global-heading{
  width:42%;
}

.global-content{
  width:48%;
}

.global-heading h2{
  margin:0;
  font-family:"Playfair Display",serif;
  font-size:30px;
  line-height:1.08;
  font-weight:600;
  color:#C08237;
  letter-spacing:-0.02em;
}

.global-content p{
  margin:0;
  font-family:"Playfair Display",serif;
  font-size:14px;
  line-height:1.55;
  color:#222;
  font-weight:400;
}

.collection-grid{
  display:grid;
  grid-template-columns:repeat(12,1fr);
  column-gap:14px;
  row-gap:32px;
}

.collection-card{
  text-align:center;
}

.collection-card:nth-child(1){
  grid-column:span 3;
}

.collection-card:nth-child(2){
  grid-column:span 3;
}

.collection-card:nth-child(3){
  grid-column:span 3;
}

.collection-card:nth-child(4){
  grid-column:span 3;
}

.collection-card:nth-child(5){
  grid-column:2 / span 3;
}

.collection-card:nth-child(6){
  grid-column:5 / span 3;
}

.collection-card:nth-child(7){
  grid-column:8 / span 3;
}

.collection-image{
  width:100%;
  overflow:hidden;
  border-radius:26px;
  background:#f6f1e8;
}

.collection-image img{
  display:block;
  width:100%;
  height:auto;
  transition:transform .45s ease;
}

.collection-card:hover img{
  transform:scale(1.05);
}

.collection-card h3{
  margin:18px 0 0;
  font-family:"Playfair Display",serif;
  font-size:16px;
  line-height:1.3;
  color:#222;
  font-weight:700;
}
  @media (max-width:1200px){

  .global-heading h2{
    font-size:28px;
  }

  .global-content p{
    font-size:14px;
  }

}

@media (max-width:991px){

  .global-section{
    padding:70px 20px;
  }

  .global-top{
    flex-direction:column;
    gap:24px;
    margin-bottom:40px;
  }

  .global-heading,
  .global-content{
    width:100%;
  }

  .global-heading h2{
    font-size:26px;
    line-height:1.2;
  }

  .global-content p{
    font-size:16px;
    line-height:1.7;
  }

  .collection-grid{
    grid-template-columns:repeat(2,1fr);
    gap:18px;
  }

  .collection-card,
  .collection-card:nth-child(1),
  .collection-card:nth-child(2),
  .collection-card:nth-child(3),
  .collection-card:nth-child(4),
  .collection-card:nth-child(5),
  .collection-card:nth-child(6),
  .collection-card:nth-child(7){
    grid-column:auto;
  }

  .collection-image{
    border-radius:18px;
  }

  .collection-card h3{
    font-size:12px;
    margin-top:12px;
  }

}

@media (max-width:600px){

  .global-section{
    padding:55px 16px;
  }

  .global-heading h2{
    font-size:20px;
  }

  .global-content p{
    font-size:11px;
    line-height:1.6;
  }

  .collection-grid{
    grid-template-columns:repeat(2,1fr);
    gap:22px;
  }

  .collection-card h3{
    font-size:12px;
  }

}

      `}</style>
    </>
  );
}