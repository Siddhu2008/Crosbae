import React from "react";
import { Helmet } from "react-helmet-async";
import "../../styles/TermsAndConditions.css";

const PrivacyPolicy = () => {
  return (
  <div className="terms-conditions container mx-auto px-4 py-10 max-w-4xl text-gray-800 leading-relaxed">
      <Helmet>
        <title>Privacy Policy | Crosbae</title>
        <meta
          name="description"
          content="Read Crosbae's Privacy Policy to understand how we collect, use, and protect your personal information."
        />
      </Helmet>

      <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
      <p className="mb-6">
        <strong>Effective Date:</strong> [Insert Date]
      </p>

      <p className="mb-4">
        At <strong>Crosbae</strong>, your privacy is very important to us. This
        Privacy Policy explains how we collect, use, and protect your personal
        information when you visit or make a purchase from our website{" "}
        <a
          href="https://www.crosbae.com"
          className="text-blue-600 hover:underline"
        >
          https://www.crosbae.com
        </a>
        . By using our website, you agree to this Privacy Policy.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        1. Information We Collect
      </h2>
      <p className="mb-4">
        We collect personal information that you provide when you make a
        purchase, create an account, or contact us. This may include your name,
        email address, phone number, billing and shipping address, and payment
        details. We also automatically collect certain information about your
        device, such as your IP address, browser type, and browsing activity on
        our site.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        2. How We Use Your Information
      </h2>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>Process and deliver your orders</li>
        <li>Communicate with you about your purchases or inquiries</li>
        <li>
          Send updates, promotions, or marketing messages (you can opt out
          anytime)
        </li>
        <li>Improve our website and customer experience</li>
        <li>Prevent fraudulent activities</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        3. Sharing Your Information
      </h2>
      <p className="mb-4">
        We do not sell or rent your personal information. We only share your
        data with trusted third parties that help us operate our business, such
        as payment gateways, shipping partners, and marketing or analytics
        services. These partners are required to protect your information and
        use it only for the purposes we specify.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">4. Cookies</h2>
      <p className="mb-4">
        We use cookies and similar technologies to improve your shopping
        experience. Cookies help us remember your preferences and analyze
        website traffic. You can disable cookies in your browser settings, but
        some parts of the site may not function properly.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">5. Data Security</h2>
      <p className="mb-4">
        We use secure servers and SSL encryption to keep your personal
        information safe. However, no online method is 100% secure. In case of
        any data breach, we will take appropriate steps as required by law.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">6. Your Rights</h2>
      <p className="mb-4">
        You have the right to access, update, or delete your personal
        information. You can also request that we stop sending you marketing
        emails at any time. To exercise these rights, please contact us at{" "}
        <a
          href="mailto:support@crosbae.com"
          className="text-blue-600 hover:underline"
        >
          support@crosbae.com
        </a>
        .
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        7. Children’s Privacy
      </h2>
      <p className="mb-4">
        Our website is not intended for users under 18 years of age. We do not
        knowingly collect personal information from minors. If you believe a
        child has provided us with personal data, please contact us immediately.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        8. Changes to This Policy
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page with an updated “Effective Date.” Please review it
        periodically.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">9. Contact Us</h2>
      <p className="mb-2">If you have any questions about this Privacy Policy or your personal information, please contact us at:</p>
      <ul className="pl-6 list-none">
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
            className="text-blue-600 hover:underline"
          >
            https://www.crosbae.com
          </a>
        </li>
      </ul>
    </div>
  );
};

export default PrivacyPolicy;
