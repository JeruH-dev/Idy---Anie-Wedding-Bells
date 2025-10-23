import RSVPandGifts from "./components/RSVPandGifts";

function App() {
    return (
        <div className="App">
            {/* other wedding sections */}
            <RSVPandGifts />
            {/* footer */}
        </div>
    );
}

export default App;
import React, { useState } from "react";
import weddingData from "../data/weddingData.json";
const RSVPandGifts = () => {
    const { formspreeEndpoint, rsvpFields, giftRegistry } = weddingData;
    const [formData, setFormData] = useState({});
    const [status, setStatus] = useState("");
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("sending");
        try {
            const response = await fetch(formspreeEndpoint, {
                method: "POST",
                headers: { Accept: "application/json" },
                body: new FormData(e.target),
            });

            if (response.ok) {
                setStatus("success");
                setFormData({});
                e.target.reset();
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
        }
    };

    return (
        <div className="p-6 md:p-10 bg-white rounded-2xl shadow-md max-w-3xl mx-auto mt-10">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
                💌 RSVP
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {rsvpFields.map((field) => {
                    if (field.type === "select") {
                        return (
                            <div key={field.id}>
                                <label className="block mb-1 font-medium">{field.label}</label>
                                <select
                                    name={field.id}
                                    required={field.required}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-400"
                                >
                                    <option value="">Select...</option>
                                    {field.options.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        );
                    } else if (field.type === "textarea") {
                        return (
                            <div key={field.id}>
                                <label className="block mb-1 font-medium">{field.label}</label>
                                <textarea
                                    name={field.id}
                                    placeholder={field.placeholder}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-400"
                                ></textarea>
                            </div>
                        );
                    } else {
                        return (
                            <div key={field.id}>
                                <label className="block mb-1 font-medium">{field.label}</label>
                                <input
                                    type={field.type}
                                    name={field.id}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-400"
                                />
                            </div>
                        );
                    }
                })}
                <button
                    type="submit"
                    disabled={status === "sending"}
                    className="bg-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition-all w-full"
                >
                    {status === "sending" ? "Sending..." : "Submit RSVP"}
                </button>
            </form>

            {status === "success" && (
                <p className="mt-4 text-green-600 text-center font-medium">
                    🎉 Thank you! Your RSVP has been received.
                </p>
            )}
            {status === "error" && (
                <p className="mt-4 text-red-600 text-center font-medium">
                    ❌ Oops! Something went wrong. Try again later.
                </p>
            )}

            <div className="mt-10">
                <h2 className="text-3xl font-bold text-center text-green-700 mb-4">
                    🎁 Gift Registry
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                    {giftRegistry.map((gift) => (
                        <a
                            key={gift.id}
                            href={gift.link}
                            target="_blank"
                            rel="noreferrer"
                            className="border border-green-100 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-green-400 transition-all flex flex-col items-center text-center"
                        >
                            <span className="text-4xl mb-2">{gift.icon}</span>
                            <h3 className="font-semibold text-lg text-green-800 mb-1">
                                {gift.name}
                            </h3>
                            <p className="text-sm text-gray-600">{gift.description}</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};