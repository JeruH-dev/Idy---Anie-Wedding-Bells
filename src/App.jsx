import GiftRegistry from "./components/GiftRegistry";

import emailjs from "@emailjs/browser";
emailjs.init("w11ZYMu5hFqunLeiC"); // 🔑 From EmailJS dashboard

function App() {
    return (
        <>
            {/* Other sections */}
            <GiftRegistry />
            {/* Footer or next section */}
        </>
    );
}

import RSVPForm from "./components/RSVPForm";

function App() {
    return (
        <>
            {/* other sections */}
            <RSVPForm />
            {/* other sections */}
        </>
    );
}

export default App;




