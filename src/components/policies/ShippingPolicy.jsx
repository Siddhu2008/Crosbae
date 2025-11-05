import React from "react";
import { Helmet } from "react-helmet-async";
import "../../styles/TermsAndConditions.css";

const ShippingPolicy = () => {
  return (
  <div className="terms-conditions container mx-auto px-4 py-10 max-w-4xl text-gray-800 leading-relaxed">
      <Helmet>
        <title>Shipping Policy | Crosbae</title>
        <meta
          name="description"
          content="Learn about Crosbae's shipping process, delivery times, charges, and policies for both domestic and international orders."
        />
      </Helmet>

      <h1>Shipping Policy</h1>

      <p>
        <strong>Effective Date:</strong> [Insert Date]
      </p>

      <p>
        Thank you for shopping with <strong>Crosbae</strong>. We aim to deliver
        your jewelry safely and on time. Please read our shipping policy
        carefully to understand how we process and ship your orders.
      </p>

      <h2>1. Order Processing</h2>
      <ul>
        <li>
          All orders are processed within 1–3 business days after payment
          confirmation.
        </li>
        <li>
          Orders placed on weekends or holidays will be processed on the next
          working day.
        </li>
        <li>
          You will receive a confirmation of your order and shipment details via
          Email, WhatsApp, or both once your order has been shipped, along with
          a tracking number (if applicable).
        </li>
      </ul>

      <h2>2. Shipping Time</h2>
      <ul>
        <li>
          <strong>Domestic Orders (India):</strong> Delivery usually takes 3–7
          business days after dispatch, depending on your location.
        </li>
        <li>
          <strong>International Orders:</strong> Delivery time may vary between
          10–20 business days, depending on the destination and customs
          clearance.
        </li>
      </ul>
      <p>
        Delivery times are estimates and may be affected by courier delays or
        unforeseen circumstances.
      </p>

      <h2>3. Shipping Charges</h2>
      <ul>
        <li>Shipping is free on all prepaid orders above ₹999.</li>
        <li>
          For Cash on Delivery (COD) orders, a small COD charge may apply.
        </li>
        <li>
          International shipping rates will be calculated at checkout based on
          the destination.
        </li>
      </ul>

      <h2>4. Order Tracking</h2>
      <p>
        Once your order is shipped, you can track it via the courier’s website
        or through updates provided by Crosbae via Email or WhatsApp.
      </p>

      <h2>5. Address Information</h2>
      <p>
        Please ensure your shipping address is complete and accurate before
        placing your order. We are not responsible for delays or lost packages
        due to incorrect addresses or missing information.
      </p>

      <h2>6. Delayed or Lost Shipments</h2>
      <p>
        If your package is delayed, please allow a few extra days as couriers
        may experience high volume or weather-related issues. If your package is
        lost in transit, contact us at{" "}
        <a href="mailto:support@crosbae.com">support@crosbae.com</a>, and we
        will work with the courier to resolve the issue.
      </p>

      <h2>7. International Shipping and Customs</h2>
      <p>
        For international orders, customs fees, import duties, and taxes may
        apply depending on your country’s regulations. These charges are not
        included in our prices and are the responsibility of the customer.
      </p>

      <h2>8. Damaged Packages</h2>
      <p>
        If your package arrives damaged, please take clear photos of the item
        and packaging, and contact us immediately at{" "}
        <a href="mailto:support@crosbae.com">support@crosbae.com</a>. We will
        assist you in resolving the issue as quickly as possible.
      </p>

      <h2>9. Contact Us</h2>
      <p>For any shipping-related questions, please contact us:</p>
      <ul className="contact-list">
        <li>
          <strong>Crosbae</strong>
        </li>
        <li>
          Email:{" "}
          <a href="mailto:support@crosbae.com">support@crosbae.com</a>
        </li>
        <li>
          Website:{" "}
          <a
            href="https://www.crosbae.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.crosbae.com
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ShippingPolicy;
