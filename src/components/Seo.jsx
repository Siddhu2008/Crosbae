import React from "react";
import { Helmet } from "react-helmet-async";

const Seo = ({
  title,
  description,
  keywords,
  imageUrl,
  url,
  structuredData,
  noIndex,
}) => {
  const siteName = "Cros Bae";
  const siteUrl = "https://www.crosbae.com"; // Replace with your actual domain
  const defaultDescription = "Discover the finest collection of imitation jewellery crafted with precision and passion. Every piece tells a story of elegance and style.";
  const defaultKeywords = "imitation jewellery, artificial jewellery, fashion jewellery, rings, necklaces, earrings, bangles";
  const defaultImage = `${siteUrl}/default-og-image.jpg`; // A default image for social sharing

  const pageTitle = title ? `${title} - ${siteName}` : `${siteName} - Finest Imitation Jewellery`;
  const pageDescription = description || defaultDescription;
  const pageKeywords = `cros bae, ${keywords || defaultKeywords}`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url ? `${siteUrl}${url}` : siteUrl} />

      {/* Open Graph / Facebook Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:url" content={url ? `${siteUrl}${url}` : siteUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={imageUrl || defaultImage} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl || defaultImage} />

      {/* Structured Data */}
      {structuredData &&
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>}
    </Helmet>
  );
};

export default Seo;