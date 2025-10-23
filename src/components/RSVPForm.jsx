import React, { useState } from "react";
import rsvpConfig from "../data/rsvpConfig.json";

const RSVPForm = () => {
    const [formData, setFormData] = useState({});
    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("sending...");

        try {
            const response = await fetch(rsvpConfig.formspreeEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus("success");
                setFormData({});
            } else {
                throw new Error("Error submitting RSVP");
            }
        } catch (error) {
            setStatus("error");
        }
    };

    const renderField = (key, field) => {
        switch (field.type) {
            case "text":
            case "email":
            case "number":
                return (
                    <input
                        type={field.type}
                        name={key}
                        placeholder={field.label}
                        required={field.required}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg outline-none"
                    />
                );
            case "radio":
                return (
                    <div className="space-y-1">
                        <p className="font-semibold">{field.label}</p>
                        {field.options.map((opt) => (
                            <label key={opt} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name={key}
                                    value={opt}
                                    onChange={handleChange}
                                    required={field.required}
                                />
                                <span>{opt}</span>
                            </label>
                        ))}
                    </div>
                );
            case "textarea":
                return (
                    <textarea
                        name={key}
                        placeholder={field.label}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg outline-none"
                        rows="4"
                    />
                );
            default:
                return null;
        }
    };

    return (
        <section id="rsvp" className="py-10 px-5 bg-[#f8f9fa]">
            <div className="max-w-xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6 text-gray-700">RSVP</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {Object.entries(rsvpConfig.fields).map(([key, field]) => (
                        <div key={key}>{renderField(key, field)}</div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
                    >
                        Submit RSVP
                    </button>
                </form>

                {status === "sending..." && (
                    <p className="mt-3 text-gray-600">Sending your RSVP...</p>
                )}
                {status === "success" && (
                    <p className="mt-3 text-green-600 font-semibold">
                        Thank you! Your RSVP was sent successfully 🎉
                    </p>
                )}
                {status === "error" && (
                    <p className="mt-3 text-red-600 font-semibold">
                        Oops! Something went wrong. Try again later 😢
                    </p>
                )}
            </div>
        </section>
    );
};

export default RSVPForm;
