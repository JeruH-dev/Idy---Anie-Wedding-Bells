import React from "react";
import giftRegistry from "../data/giftRegistry.json";
import { Gift, CreditCard, Banknote, ShoppingBag } from "lucide-react";

const iconMap = {
    amazon: <ShoppingBag className="w-6 h-6 text-green-600" />,
    "credit-card": <CreditCard className="w-6 h-6 text-green-600" />,
    bank: <Banknote className="w-6 h-6 text-green-600" />,
    gift: <Gift className="w-6 h-6 text-green-600" />
};

const GiftRegistry = () => {
    return (
        <section id="gift-registry" className="py-12 bg-white">
            <div className="max-w-4xl mx-auto px-5 text-center">
                <h2 className="text-3xl font-bold mb-3 text-gray-800">
                    {giftRegistry.title}
                </h2>
                <p className="text-gray-600 mb-8">{giftRegistry.subtitle}</p>

                <div className="grid sm:grid-cols-2 gap-6">
                    {giftRegistry.registry.map((item, idx) => (
                        <div
                            key={idx}
                            className="border rounded-2xl p-5 hover:shadow-lg transition duration-300 bg-[#f8f9fa]"
                        >
                            <div className="flex justify-center mb-3">
                                {iconMap[item.icon] || <Gift className="w-6 h-6 text-green-600" />}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                {item.name}
                            </h3>
                            <p className="text-gray-500 mb-4 whitespace-pre-line">
                                {item.description}
                            </p>
                            {item.url && (
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
                                >
                                    Visit
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GiftRegistry;
