// Server component — purely static, no interactivity.
// Styles live in globals.css (.advantage-*)

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
    <section className="advantage-section">
      <div className="advantage-container">

        <h2>The Ratoomal&apos;s Manufacturing Advantage</h2>

        <p className="advantage-subtitle">
          End-to-End Handicraft Production and Scalable Global Supply.
        </p>

        <div className="advantage-grid">
          {features.map((item, index) => (
            <div
              key={index}
              className={`advantage-card ${
                index !== features.length - 1 ? "advantage-border-right" : ""
              }`}
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
