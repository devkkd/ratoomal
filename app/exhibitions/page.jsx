import ExhibitionsClient from "./ExhibitionsClient";

export const metadata = {
  title: "Art Exhibitions - Ratoomal's | Handicraft & Cultural Exhibitions from Jaipur",
  description: "Explore upcoming and current art exhibitions by Ratoomals. Discover handcrafted sculptures, cultural showcases, and heritage exhibitions from Jaipur, India.",
  keywords: "art exhibitions, handicraft exhibitions, Jaipur art, cultural exhibitions, sculpture exhibitions, Ratoomals exhibitions, Indian handicraft events",
  alternates: {
    canonical: "https://www.ratoomals.com/exhibitions",
  },
  openGraph: {
    title: "Art Exhibitions - Ratoomal's Handicraft & Cultural Showcases",
    description: "Discover extraordinary art and cultural exhibitions featuring handcrafted sculptures and heritage pieces from Jaipur, India.",
    type: "website",
    url: "https://www.ratoomals.com/exhibitions",
    siteName: "Ratoomals",
    images: [
      {
        url: "https://www.ratoomals.com/images/og-exhibitions.jpg",
        width: 1200,
        height: 630,
        alt: "Ratoomals Art Exhibitions - Handcrafted Sculptures from Jaipur",
      },
    ],
  },
};

export default function ExhibitionsPage() {
  return <ExhibitionsClient />;
}
