import ExhibitionDetailClient from "./ExhibitionDetailClient";

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "https://www.ratoomals.com"}/api/exhibitions/${params.id}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    const exhibition = data?.data;

    if (!exhibition) {
      return {
        title: "Exhibition Not Found - Ratoomal's",
        description: "The requested exhibition could not be found.",
      };
    }

    const title = `${exhibition.title} - Ratoomal's Art Exhibition`;
    const description =
      exhibition.description ||
      `Discover ${exhibition.title} — an art exhibition by Ratoomals featuring handcrafted sculptures and heritage pieces from Jaipur, India.`;

    const image = exhibition.mainImage || "https://www.ratoomals.com/images/og-exhibitions.jpg";

    return {
      title,
      description,
      alternates: {
        canonical: `https://www.ratoomals.com/exhibitions/${params.id}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
        url: `https://www.ratoomals.com/exhibitions/${params.id}`,
        siteName: "Ratoomals",
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: exhibition.title,
          },
        ],
      },
    };
  } catch {
    return {
      title: "Exhibition - Ratoomal's",
      description: "Art and cultural exhibition by Ratoomals, Jaipur.",
    };
  }
}

export default function ExhibitionDetailPage() {
  return <ExhibitionDetailClient />;
}
