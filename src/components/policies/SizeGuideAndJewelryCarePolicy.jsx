import React from "react";
import { Helmet } from "react-helmet-async";
import "../../styles/TermsAndConditions.css";

const SizeGuideAndJewelryCarePolicy = () => {
  return (
  <div className="terms-conditions container mx-auto px-4 py-10 max-w-4xl text-gray-800 leading-relaxed">
      <Helmet>
        <title>Size Guide & Jewelry Care Policy | Crosbae</title>
        <meta
          name="description"
          content="Find the perfect fit and keep your Crosbae jewelry shining. Learn about sizing, measurement tips, and jewelry care guidelines."
        />
      </Helmet>

      <h1 className="text-4xl font-bold mb-6 text-center">
        Size Guide & Jewelry Care Policy
      </h1>

      <p className="mb-6">
        <strong>Effective Date:</strong> [Insert Date]
      </p>

      <p className="mb-4">
        At <strong>Crosbae</strong>, we want to ensure your jewelry fits perfectly and lasts a lifetime. 
        Please read our Size Guide and Jewelry Care Policy before making a purchase.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">1. Size Guide</h2>

      <h3 className="text-xl font-medium mt-4 mb-2">Size Accuracy</h3>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>
          All measurements listed on our product pages are in millimeters (mm) or inches, depending on the item.
        </li>
        <li>
          We make every effort to ensure the size information is accurate, but slight variations may occur 
          due to handcrafted processes or measurement methods.
        </li>
      </ul>

      <h3 className="text-xl font-medium mt-4 mb-2">How to Measure</h3>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>
          <strong>Rings:</strong> Use a ring sizer or a piece of string to measure the circumference of your finger. 
          Compare it with our size chart.
        </li>
        <li>
          <strong>Bracelets:</strong> Measure your wrist and add 0.5–1 cm for a comfortable fit.
        </li>
        <li>
          <strong>Necklaces & Chains:</strong> Measure your neck or check the listed chain length to ensure the desired fit.
        </li>
      </ul>

      <p className="mb-4">
        <strong>Tip:</strong> If you are between sizes, we recommend choosing the larger size for comfort.
      </p>

      <h3 className="text-xl font-medium mt-4 mb-2">Size Exchanges</h3>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>
          If sizing is incorrect, refer to our <strong>Refund & Return Policy</strong> for exchanges.
        </li>
        <li>
          Customized or engraved jewelry cannot be exchanged for sizing issues unless there is a manufacturing defect.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        2. Jewelry Care & Maintenance
      </h2>

      <p className="mb-4">To keep your Crosbae jewelry looking its best:</p>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>
          <strong>Avoid Contact with Chemicals:</strong> Remove jewelry before using perfumes, lotions, or cleaning agents.
        </li>
        <li>
          <strong>Keep Jewelry Dry:</strong> Avoid wearing jewelry in water (swimming pools, showers, or washing dishes).
        </li>
        <li>
          <strong>Store Properly:</strong> Store in the provided jewelry box or a soft pouch to prevent scratches and tarnishing.
        </li>
        <li>
          <strong>Clean Gently:</strong> Use a soft, dry cloth to clean your jewelry. Avoid abrasive materials or harsh chemicals.
        </li>
        <li>
          <strong>Handle with Care:</strong> Remove jewelry before exercising, heavy lifting, or other activities that may cause damage.
        </li>
      </ul>

      <p className="mb-4">
        Following these steps will help maintain the shine and durability of your jewelry.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">3. Contact Us</h2>
      <p className="mb-2">
        If you need help with sizing, care instructions, or have any questions about your jewelry:
      </p>
      <ul className="list-none pl-6">
        <li><strong>Crosbae</strong></li>
        <li>
          Email:{" "}
          <a
            href="mailto:support@crosbae.com"
            className="text-blue-600 hover:underline"
          >
            support@crosbae.com
          </a>
        </li>
        <li>
          Website:{" "}
          <a
            href="https://www.crosbae.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            https://www.crosbae.com
          </a>
        </li>
      </ul>
    </div>
  );
};

export default SizeGuideAndJewelryCarePolicy;
