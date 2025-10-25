/*
<script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>

(function () {
    emailjs.init("w11ZYMu5hFqunLeiC");
})();


 /*   // ==== CONFIG ====
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/myznqvoz"; // your endpoint
    const EMAILJS_USER_ID = "w11ZYMu5hFqunLeiC";          // from EmailJS dashboard
    const EMAILJS_SERVICE_ID = "service_kwlx9q9";    // e.g. service_xxx
    const EMAILJS_TEMPLATE_ID = "template_ni012yn";  // e.g. template_xxx
    // =================

    emailjs.init(EMAILJS_USER_ID);

    const form = document.getElementById("rsvpForm");
    const confirmBox = document.getElementById("rsvpConfirmation");
    const confirmText = document.getElementById("confirmText");

    function generateCode() {
        const letters = "IDY&ANIE";
        const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `${letters}-${rand}`;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const code = generateCode();
        data.confirmation_code = code;

        const btn = form.querySelector("button[type='submit']");
        btn.disabled = true;
        btn.textContent = "Sending...";

        try {
            // --- Send to Formspree ---
            const res = await fetch(FORMSPREE_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Submission failed");

            // --- Send confirmation email via EmailJS ---
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                to_email: data.email,
                name: data.name,
                confirm_code: code,
                attend: data.attend,
                guests: data.guests,
                message: data.message,
            });

            // --- Update UI ---
            confirmText.textContent = `Hi ${data.name}, your confirmation code is ${code}. We've also emailed it to ${data.email}.`;
            confirmBox.classList.remove("hidden");
            form.reset();
        } catch (err) {
            console.error(err);
            alert("Something went wrong — please try again later.");
        } finally {
            btn.disabled = false;
            btn.textContent = "Submit RSVP";
        }
    });
})();*/
/*
// RSVP form handling with Formspree + EmailJS confirmation
const rsvpForm = document.getElementById('rsvpForm');
const rsvpConfirmation = document.getElementById('rsvpConfirmation');
const confirmText = document.getElementById('confirmText');

if (rsvpForm) {
    rsvpForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const data = new FormData(rsvpForm);
        const obj = {};
        data.forEach((v, k) => obj[k] = v);

        // Generate confirmation code
        const confirmationCode = 'IDY&ANIE-' + Date.now().toString(36).toUpperCase();
        obj.confirmation_code = confirmationCode;
        data.append('confirmation_code', confirmationCode);

        try {
            // Send to Formspree
            const response = await fetch(rsvpForm.action, {
                method: rsvpForm.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // Show confirmation on screen
                confirmText.textContent = `Your confirmation code: ${confirmationCode}`;
                rsvpConfirmation.classList.remove('hidden');
                rsvpForm.classList.add('hidden');

                // ✉️ Send EmailJS auto confirmation
                await emailjs.send("service_kwlx9q9", "template_ni012yn", {
                    to_email: obj.email,
                    from_name: "Idy & Anie Wedding",
                    guest_name: obj.name || "Guest",
                    num_guests: obj.guests || "1",
                    confirmation_code: confirmationCode
                });

                console.log("✅ Confirmation email sent to guest");

                // Save locally
                const saved = JSON.parse(localStorage.getItem('rsvps') || '[]');
                saved.push(obj);
                localStorage.setItem('rsvps', JSON.stringify(saved));
            } else {
                alert("😕 Oops! Something went wrong. Please try again later.");
            }

        } catch (err) {
            console.error("❌ Error:", err);
            alert("There was an error sending your confirmation email.");
        }

        rsvpForm.reset();
    });
}*/

/* Initialize EmailJS (before your main script) */
(function () {
    emailjs.init({
        publicKey: "w11ZYMu5hFqunLeiC" // 🔑 From EmailJS dashboard
    });
})();


// RSVP form handling with Formspree + EmailJS
const rsvpForm = document.getElementById('rsvpForm');
const rsvpConfirmation = document.getElementById('rsvpConfirmation');
const confirmText = document.getElementById('confirmText');

if (rsvpForm) {
    rsvpForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Gather data
        const data = new FormData(rsvpForm);
        const obj = {};
        data.forEach((v, k) => (obj[k] = v));

        // Generate confirmation code
        const confirmationCode = 'IDY&ANIE-' + Date.now().toString(36).toUpperCase();
        obj.confirmation_code = confirmationCode;
        data.append('confirmation_code', confirmationCode);

        try {
            // 1️⃣ Send data to Formspree
            const response = await fetch(rsvpForm.action, {
                method: rsvpForm.method,
                body: data,
                headers: { Accept: 'application/json' },
            });

            if (response.ok) {
                // 2️⃣ Show confirmation on screen
                confirmText.textContent = `Your RSVP was received 🎉\nConfirmation Code: ${confirmationCode}`;
                rsvpConfirmation.classList.remove('hidden');
                rsvpForm.classList.add('hidden');

                // 3️⃣ Send confirmation email via EmailJS
                await emailjs.send('service_qam3cm2', 'template_gyiinzi', {
                    to_email: obj.email,
                    from_name: 'Idy & Anie Wedding Bells 💍',
                    guest_name: obj.name || 'Guest',
                    num_guests: obj.guests || '1',
                    confirmation_code: confirmationCode,
                });

                console.log('✅ Confirmation email sent successfully to', obj.email);

                // 4️⃣ Save locally (for your record)
                const saved = JSON.parse(localStorage.getItem('rsvps') || '[]');
                saved.push(obj);
                localStorage.setItem('rsvps', JSON.stringify(saved));
            } else {
                alert('😕 Oops! Something went wrong while submitting your RSVP. Please try again.');
            }
        } catch (err) {
            console.error('❌ Error:', err);
            alert('There was an issue sending your confirmation email. Please try again later.');
        }

        // 5️⃣ Reset the form
        rsvpForm.reset();
    });
}

/* 🎊 Confetti Animation */
function launchConfetti() {
    const duration = 5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

// Launch confetti when confirmation box is shown
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('hidden')) {
            launchConfetti();
        }
    });
});

observer.observe(rsvpConfirmation, { attributes: true });   
