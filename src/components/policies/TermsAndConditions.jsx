import React from "react";
import { Helmet } from "react-helmet-async";
import "../../styles/TermsAndConditions.css"; // ✅ Import the CSS for luxury design and spacing

const TermsAndConditions = () => {
  return (
    <div className="terms-conditions container mx-auto px-4 py-10 max-w-4xl text-gray-800 leading-relaxed">
      <Helmet>
        <title>Terms & Conditions | Crosbae</title>
        <meta
          name="description"
          content="Read Crosbae's Terms and Conditions outlining our policies on purchases, returns, website usage, and more."
        />
      </Helmet>

      <h1 className="text-4xl font-bold mb-6 text-center">Terms & Conditions</h1>

      <p className="mb-6">
        <strong>Effective Date:</strong> [Insert Date]
      </p>

      <p className="mb-4">
        Welcome to <strong>Crosbae</strong>! These Terms and Conditions ("Terms")
        govern your use of our website{" "}
        <a
          href="https://www.crosbae.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          https://www.crosbae.com
        </a>{" "}
        and any related services offered by Crosbae. By accessing or using our
        site, you agree to these Terms in full. Please read them carefully before
        using our services.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">1. General Information</h2>
      <p className="mb-4">
        The website is operated by <strong>Crosbae</strong>. By visiting or
        purchasing from our site, you engage in our “Service” and agree to comply
        with these Terms, including our Privacy Policy and other policies linked
        on this website.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">2. Eligibility</h2>
      <p className="mb-4">
        By using this website, you confirm that you are at least 18 years old or
        are accessing the site under the supervision of a parent or legal
        guardian. You agree to provide accurate and up-to-date information when
        creating an account or making a purchase.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">3. Products and Services</h2>
      <p className="mb-4">
        We make every effort to display our jewelry products accurately. However,
        slight variations may occur due to screen differences or handcrafted
        processes. Crosbae reserves the right to modify or discontinue any
        product without prior notice.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">4. Pricing and Payments</h2>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>All prices are listed in INR and include applicable taxes unless otherwise stated.</li>
        <li>Crosbae reserves the right to change prices at any time.</li>
        <li>In case of pricing or technical errors, we may cancel your order and refund any amount paid.</li>
        <li>Payments must be made using the secure methods provided at checkout.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">5. Order Acceptance</h2>
      <p className="mb-4">
        All orders are subject to acceptance and availability. We reserve the right to
        refuse or cancel any order for reasons including payment failure, inaccurate
        product information, or suspected fraud. You will be notified in such cases and
        refunded if payment was made.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">6. Shipping and Delivery</h2>
      <p className="mb-4">
        For detailed shipping information, please refer to our{" "}
        <a href="/shipping-policy" className="text-blue-600 hover:underline">
          Shipping Policy
        </a>
        . Delivery timelines are estimates and may vary due to courier delays or
        unforeseen events.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">7. Returns, Refunds & Exchanges</h2>
      <p className="mb-4">
        Please review our{" "}
        <a href="/refund-return-policy" className="text-blue-600 hover:underline">
          Refund & Return Policy
        </a>{" "}
        for detailed terms on eligible returns, exchanges, and refund timelines.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">8. Use of Website</h2>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>You agree not to misuse our website or engage in unlawful activities.</li>
        <li>You must not upload harmful, offensive, or fraudulent content.</li>
        <li>You may not interfere with the site’s security or functionality.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">9. Intellectual Property</h2>
      <p className="mb-4">
        All content on this website, including images, text, graphics, and logos,
        are the property of Crosbae. You may not reproduce, distribute, or use our
        content without written permission.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">10. User Accounts</h2>
      <p className="mb-4">
        If you create an account, you are responsible for maintaining the
        confidentiality of your credentials. Crosbae is not liable for any losses
        arising from unauthorized account use.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">11. Limitation of Liability</h2>
      <p className="mb-4">
        Crosbae shall not be liable for any indirect, incidental, or consequential
        damages arising from the use of our site or products. Your use of the
        website is at your own risk.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">12. Indemnification</h2>
      <p className="mb-4">
        You agree to indemnify and hold Crosbae and its affiliates harmless from
        any claims or damages resulting from your violation of these Terms or your
        misuse of our website.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">13. Third-Party Links</h2>
      <p className="mb-4">
        Our website may contain links to third-party sites. Crosbae is not
        responsible for the content or privacy practices of these external sites.
        Visiting them is at your own discretion.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">14. Privacy</h2>
      <p className="mb-4">
        Your use of this website is also governed by our{" "}
        <a href="/privacy-policy" className="text-blue-600 hover:underline">
          Privacy Policy
        </a>
        . Please review it to understand how we collect, use, and protect your
        personal data.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">15. Termination</h2>
      <p className="mb-4">
        We reserve the right to suspend or terminate your access to our website
        at any time without notice if you violate these Terms or engage in
        harmful activity.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">16. Governing Law</h2>
      <p className="mb-4">
        These Terms are governed by the laws of <strong>India</strong>. Any disputes
        shall be subject to the exclusive jurisdiction of the courts in{" "}
        <strong>[Your City/State, e.g., Mumbai, Maharashtra]</strong>.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">17. Changes to These Terms</h2>
      <p className="mb-4">
        Crosbae may update these Terms from time to time. Updates will be posted
        on this page with a revised effective date. Please review periodically to
        stay informed.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">18. Contact Us</h2>
      <p className="mb-2">
        If you have any questions or concerns about these Terms and Conditions,
        please contact us:
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
          Phone:{" "}
          <a href="tel:+918268686863" className="text-blue-600 hover:underline">
            +91 8268686863
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

export default TermsAndConditions;
