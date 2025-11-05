import React from "react";
import { Helmet } from "react-helmet-async";
import "../../styles/TermsAndConditions.css";


const CookiesPolicy = () => {
  return (
    <div className="terms-conditions container mx-auto px-4 py-10 max-w-4xl text-gray-800 leading-relaxed">
      <Helmet>
        <title>Cookies Policy | Crosbae</title>
        <meta
          name="description"
          content="Learn how Crosbae uses cookies and similar technologies to enhance your browsing and shopping experience on our website."
        />
      </Helmet>

      <h1 className="text-4xl font-bold mb-6 text-center">Cookies Policy</h1>

      <p className="mb-6">
        <strong>Effective Date:</strong> [Insert Date]
      </p>

      <p className="mb-4">
        This Cookies Policy explains how <strong>Crosbae</strong> uses cookies
        and similar technologies when you visit or interact with our website{" "}
        <a
          href="https://www.crosbae.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          https://www.crosbae.com
        </a>
        . By using our website, you agree to the use of cookies as described in
        this policy.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">1. What Are Cookies?</h2>
      <p className="mb-4">
        Cookies are small text files stored on your device when you visit a
        website. They help websites recognize your device, remember your
        preferences, and improve your overall browsing experience.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        2. How We Use Cookies
      </h2>
      <p className="mb-4">Crosbae uses cookies and similar technologies to:</p>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>Enhance website functionality and performance</li>
        <li>Remember your preferences and shopping cart items</li>
        <li>Analyze website traffic and visitor behavior</li>
        <li>Improve your browsing experience and personalize content</li>
        <li>Deliver relevant marketing and promotional offers</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        3. Types of Cookies We Use
      </h2>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>
          <strong>Essential Cookies:</strong> Required for the website to
          function properly (e.g., checkout and login).
        </li>
        <li>
          <strong>Performance Cookies:</strong> Collect data on website usage
          and help us improve site performance.
        </li>
        <li>
          <strong>Functional Cookies:</strong> Allow us to remember your
          preferences, such as language or location.
        </li>
        <li>
          <strong>Advertising Cookies:</strong> Used to show personalized ads
          and measure marketing campaign effectiveness.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        4. Managing Cookies
      </h2>
      <p className="mb-4">
        You can control or delete cookies through your browser settings. Most
        browsers allow you to:
      </p>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>View the cookies stored on your device</li>
        <li>Delete existing cookies</li>
        <li>Block or restrict cookies from specific websites</li>
      </ul>
      <p className="mb-4">
        Please note that disabling cookies may affect certain features or
        functionality of our website.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        5. Third-Party Cookies
      </h2>
      <p className="mb-4">
        We may use third-party services (like Google Analytics or Meta Pixel) to
        collect information about your browsing behavior. These third parties
        may use their own cookies in accordance with their privacy policies.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        6. Updates to This Policy
      </h2>
      <p className="mb-4">
        Crosbae may update this Cookies Policy from time to time to reflect
        changes in technology, laws, or our practices. Any updates will be
        posted on this page with a revised effective date.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">7. Contact Us</h2>
      <p className="mb-2">
        If you have any questions about our Cookies Policy, please contact us:
      </p>
      <ul className="list-none pl-6">
        <li>
          <strong>Crosbae</strong>
        </li>
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

export default CookiesPolicy;
