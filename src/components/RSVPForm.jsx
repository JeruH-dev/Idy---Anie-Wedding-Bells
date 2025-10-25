import React, { useState } from "react";
import emailjs from "@emailjs/browser";

import rsvpConfig from "../data/rsvpConfig.json";

await emailjs.send(
    rsvpConfig.emailjsServiceId,
    rsvpConfig.emailjsTemplateId,
    {
        to_email: formData.email,
        guest_name: formData.name,
        confirmation_code: code
    },
    rsvpConfig.emailjsPublicKey
    
);


const RSVPForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        attend: "yes",
        guests: "",
        message: "",
    });

    const [confirmationCode, setConfirmationCode] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Handle field change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Generate confirmation code
        const code = "IDY&ANIE" + Date.now().toString(36).toUpperCase();
        setConfirmationCode(code);

        // ---- 1️⃣ Send RSVP to Formspree ----
        try {
            const formspreeResponse = await fetch("https://formspree.io/f/myznqvoz", {
                method: "POST",
                headers: { Accept: "application/json" },
                body: new FormData(e.target),
            });

            if (!formspreeResponse.ok) {
                throw new Error("Formspree submission failed");
            }

            // ---- 2️⃣ Send confirmation email via EmailJS ----
            try {
                await emailjs.send(
                    "service_qam3cm2", // your EmailJS service ID
                    "template_gyiinzi", // your EmailJS template ID
                    {
                        to_email: formData.email,
                        from_name: "Idy & Anie Wedding 💍",
                        guest_name: formData.name,
                        num_guests: formData.guests || "1",
                        confirmation_code: code,
                    },
                    "w11ZYMu5hFqunLeiC" // 🔑 Replace with your EmailJS Public Key
                );

                console.log("✅ Confirmation email sent successfully");
            } catch (emailErr) {
                console.error("❌ EmailJS Error:", emailErr);
                alert("We couldn’t send your confirmation email. Check console for details.");
            }

            // ---- 3️⃣ Save locally for reference ----
            const savedRSVPs = JSON.parse(localStorage.getItem("rsvps") || "[]");
            savedRSVPs.push({ ...formData, confirmation_code: code });
            localStorage.setItem("rsvps", JSON.stringify(savedRSVPs));

            // ---- 4️⃣ Reset and show confirmation message ----
            setFormData({
                name: "",
                email: "",
                attend: "yes",
                guests: "",
                message: "",
            });
            setSubmitted(true);
        } catch (err) {
            console.error("❌ RSVP submission failed:", err);
            alert("Something went wrong — please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="rsvp" className="rsvp container">
            <h2>RSVP</h2>

            {!submitted ? (
                <form id="rsvpForm" className="rsvp-form" onSubmit={handleSubmit}>
                    <label htmlFor="name">Full Name</label>
                    <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Will you attend?</label>
                    <div className="radio-row">
                        <label>
                            <input
                                type="radio"
                                name="attend"
                                value="yes"
                                checked={formData.attend === "yes"}
                                onChange={handleChange}
                            />{" "}
                            Yes, I’ll be there
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="attend"
                                value="no"
                                checked={formData.attend === "no"}
                                onChange={handleChange}
                            />{" "}
                            Sorry, can’t make it
                        </label>
                    </div>

                    <label htmlFor="guests">Number of Guests</label>
                    <input
                        id="guests"
                        name="guests"
                        type="number"
                        min="0"
                        value={formData.guests}
                        onChange={handleChange}
                    />

                    <label htmlFor="message">Message (optional)</label>
                    <textarea
                        id="message"
                        name="message"
                        rows="3"
                        value={formData.message}
                        onChange={handleChange}
                    ></textarea>

                    <button type="submit" className="btn primary" disabled={loading}>
                        {loading ? "Submitting..." : "Submit RSVP"}
                    </button>
                </form>
            ) : (
                <div id="rsvpConfirmation" className="rsvp-confirm" role="status" aria-live="polite">
                    <h3>Thanks — your RSVP is confirmed 🎉</h3>
                    <p>Confirmation Code: <strong>{confirmationCode}</strong></p>
                    <p>A confirmation email has been sent to <strong>{formData.email}</strong>.</p>
                </div>
            )}
        </section>
    );
};

export default RSVPForm;
