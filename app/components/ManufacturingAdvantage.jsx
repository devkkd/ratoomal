"use client";

const features = [
  {
    title: "Artisanal Production at Scale",
    description:
      "We seamlessly blend Rajasthan's authentic heritage craftsmanship with structured, high-volume manufacturing workflows to meet international demand.",
  },
  {
    title: "Flexible B2B Manufacturing",
    description:
      "Our production lines are fully equipped to handle diverse needs, from massive wholesale bulk orders to bespoke product fabrication (OEM) and private-label partnerships.",
  },
  {
    title: "Certified Quality & Compliance",
    description:
      "Every piece is rigorously monitored from raw material sourcing to final finishing within a fully certified, licensed, and ethically operated manufacturing process.",
  },
  {
    title: "Reliable Lead Times & Logistics",
    description:
      "Optimized factory schedules are deeply integrated with our export-ready documentation and global supply chain to guarantee on-time delivery worldwide.",
  },
];

export default function ManufacturingAdvantage() {
  return (
    <>
      <section className="advantage-section">

        <div className="advantage-container">

          <h2>
            The Ratoomal's Manufacturing Advantage
          </h2>

          <p className="subtitle">
            End-to-End Handicraft Production and Scalable Global Supply.
          </p>

          <div className="advantage-grid">

            {features.map((item, index) => (

              <div
                key={index}
                className={`advantage-card ${
                  index !== features.length - 1 ? "border-right" : ""
                }`}
              >

                <h3>{item.title}</h3>

                <p>{item.description}</p>

              </div>

            ))}

          </div>

        </div>

      </section>

      <style jsx>{`
   .advantage-section{
  width:100%;
  background:#FCF8F1;
  padding:0 72px 100px;
}

.advantage-container{
  width:100%;
  max-width:1400px;
  margin:0 auto;
}

.advantage-container h2{
  margin:0;
  text-align:center;
  font-family:"Playfair Display",serif;
  font-size:50px;
  font-weight:600;
  color:#C08237;
  line-height:1.2;
}

.subtitle{
  margin:28px auto 70px;
  text-align:center;
  font-family:"Playfair Display",serif;
  font-size:18px;
  color:#0E0E0E;
  line-height:1.6;
}

.advantage-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  align-items:stretch;
}

.advantage-card{
  padding:0 36px;
  min-height:280px;
  display:flex;
  flex-direction:column;
}
  .advantage-card:nth-child(even){
  justify-content:flex-end;
}

.advantage-card:nth-child(odd){
  justify-content:flex-start;
}

.border-right{
  border-right:1px solid #CDBFA9;
}

.advantage-card h3{
  margin:0 0 28px;
  font-family:"Playfair Display",serif;
  font-size:18px;
  line-height:1.35;
  font-weight:700;
  color:#0E0E0E;
}

.advantage-card p{
  margin:0;
  font-family:"Playfair Display",serif;
  font-size:14px;
  line-height:1.9;
  color:#0E0E0E;
}

@media (max-width:991px){

  .advantage-section{
    padding:0px 16px 60px;
  }

  .advantage-container h2{
    font-size:30px;
    line-height:1.25;
  }

  .subtitle{
    margin:18px auto 36px;
    font-size:15px;
    line-height:1.6;
    max-width:320px;
  }

.advantage-grid{
  grid-template-columns:repeat(2,minmax(0,1fr));
  column-gap:20px;
  row-gap:32px;
  align-items:start;
}

.advantage-card{
  padding:0 16px;
  min-height:210px;
  display:flex;
  flex-direction:column;
}

.advantage-card:nth-child(odd){
  justify-content:flex-start;
  border-right:1px solid #CDBFA9;
}

.advantage-card:nth-child(even){
  justify-content:flex-end;
}

.border-right{
  border-right:none;
}

  .advantage-card h3{
    font-size:18px;
    margin-bottom:12px;
    line-height:1.35;
  }

  .advantage-card p{
    font-size:13px;
    line-height:1.75;
  }
}

@media (max-width:600px){

  .advantage-container h2{
    font-size:30px;
  }

  .subtitle{
    font-size:13px;
    margin-bottom:30px;
  }

  .advantage-grid{
    gap:24px 16px;
  }

  .advantage-card h3{
    font-size:16px;
  }

  .advantage-card p{
    font-size:12px;
    line-height:1.7;
  }
}

      `}</style>
    </>
  );
}