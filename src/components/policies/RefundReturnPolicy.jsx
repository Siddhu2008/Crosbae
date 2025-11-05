import React from "react";
import { Helmet } from "react-helmet-async";
import "../../styles/TermsAndConditions.css";

const RefundReturnPolicy = () => {
	return (
		<div className="terms-conditions container mx-auto px-4 py-10 max-w-4xl text-gray-800 leading-relaxed">
			<Helmet>
				<title>Refund & Return Policy | Crosbae</title>
				<meta
					name="description"
					content="Learn about Crosbae's return, refund, and exchange policies for a smooth and transparent shopping experience."
				/>
			</Helmet>

			<h1 className="text-4xl font-bold mb-6 text-center">Refund & Return Policy</h1>

			<p className="mb-6">
				<strong>Effective Date:</strong> [Insert Date]
			</p>

			<p className="mb-4">
				Thank you for shopping with <strong>Crosbae</strong>. We want you to
				love your purchase, but if you are not completely satisfied, we’re here
				to help.
			</p>

			<h2 className="text-2xl font-semibold mt-8 mb-3">1. Returns</h2>
			<ul className="list-disc pl-6 mb-4 space-y-1">
				<li>You can request a return within 7 days of receiving your order.</li>
				<li>
					To be eligible for a return, your item must be unused, unworn, and in
					the same condition that you received it, with original packaging and
					tags intact.
				</li>
				<li>
					Certain items such as personalized or custom jewelry cannot be
					returned unless they arrive damaged or defective.
				</li>
				<li>
					To start a return, please contact us at
					<a href="mailto:support@crosbae.com" className="text-blue-600 hover:underline"> support@crosbae.com</a>
					with your order number and reason for return.
				</li>
				<li>
					Once your return is approved, we’ll provide you with the return
					instructions.
				</li>
			</ul>
			<p className="mb-4">Please do not send any items back without authorization from our team.</p>

			<h2 className="text-2xl font-semibold mt-8 mb-3">2. Refunds</h2>
			<ul className="list-disc pl-6 mb-4 space-y-1">
				<li>
					Once we receive and inspect your returned item, we’ll notify you of
					the status of your refund.
				</li>
				<li>
					If approved, your refund will be processed to your original payment
					method within 5–10 business days.
				</li>
				<li>Shipping charges, if applicable, are non-refundable.</li>
			</ul>

			<h2 className="text-2xl font-semibold mt-8 mb-3">3. Exchanges</h2>
			<p className="mb-4">
				We only replace items if they are defective or damaged. If you need to
				exchange a defective item for the same product, please email us at
				<a href="mailto:support@crosbae.com" className="text-blue-600 hover:underline"> support@crosbae.com</a>
				within 48 hours of delivery with photos of the issue.
			</p>

			<h2 className="text-2xl font-semibold mt-8 mb-3">4. Non-Returnable Items</h2>
			<p className="mb-4">Please note that the following items cannot be returned or refunded:</p>
			<ul className="list-disc pl-6 mb-4 space-y-1">
				<li>Custom or personalized jewelry</li>
				<li>Gift cards</li>
				<li>Items purchased during sale or clearance events</li>
			</ul>

			<h2 className="text-2xl font-semibold mt-8 mb-3">5. Late or Missing Refunds</h2>
			<p className="mb-4">
				If you haven’t received your refund yet, first check your bank or
				payment account again. Then contact your credit card company or bank,
				as it may take some time before your refund is officially posted. If
				you’ve done all of this and still haven’t received your refund, please
				contact us at <a href="mailto:support@crosbae.com" className="text-blue-600 hover:underline">support@crosbae.com</a>.
			</p>

			<h2 className="text-2xl font-semibold mt-8 mb-3">6. Damaged or Wrong Items</h2>
			<p className="mb-4">
				If your order arrives damaged or you receive the wrong item, please
				contact us immediately with photos of the product and packaging. We will
				review and arrange a replacement or refund as applicable.
			</p>

			<h2 className="text-2xl font-semibold mt-8 mb-3">7. Contact Us</h2>
			<p className="mb-2">For any questions regarding returns or refunds, please contact us:</p>
			<ul className="list-none pl-6">
				<li><strong>Crosbae</strong></li>
				<li>
					Email: <a href="mailto:support@crosbae.com" className="text-blue-600 hover:underline">support@crosbae.com</a>
				</li>
				<li>
					Website: <a href="https://www.crosbae.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.crosbae.com</a>
				</li>
			</ul>
		</div>
	);
};

export default RefundReturnPolicy;
