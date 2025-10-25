# 💒 Idy & Anie Wedding Bells — RSVP & Gift Registry Website

A modern, elegant **wedding website** built with **React**, featuring:
- A responsive layout for guests to view wedding details  
- **RSVP form integration** with **Formspree** for submission management  
- **EmailJS auto-reply system** for guest confirmation  
- A personalized **gift registry** and contact section  

---

## ✨ Features

✅ Elegant wedding design with soft Sage Green theme  
✅ RSVP form with instant confirmation code  
✅ Formspree backend for message handling  
✅ EmailJS integration for automatic confirmation emails  
✅ Gift registry section with external store links  
✅ Responsive design for all devices  
✅ LocalStorage fallback to store guest data (if offline)

---

## 🧠 Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend  | React (Vite or CRA setup) |
| Styling   | TailwindCSS / CSS3 |
| Backend (Form) | [Formspree](https://formspree.io/) |
| Email Automation | [EmailJS](https://www.emailjs.com/) |
| Deployment | Vercel / Netlify |
| Data Config | JSON files (rsvpConfig.json) |

---

## ⚙️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/JeruH-dev/Idy---Anie-Wedding-Bells.git
   cd Idy---Anie-Wedding-Bells

2. **Install Dependencies**

    npm install


3. **Create Config File**
    Inside src/data/, create a file called rsvpConfig.json:

        {
        "formspreeURL": "https://formspree.io/f/YOUR_FORM_ID",
        "emailjsServiceId": "YOUR_SERVICE_ID",
        "emailjsTemplateId": "YOUR_TEMPLATE_ID",
        "emailjsPublicKey": "YOUR_PUBLIC_KEY"
        }


4. **Run Development Server**

        npm run dev


        Your site will be available at http://localhost:5173/