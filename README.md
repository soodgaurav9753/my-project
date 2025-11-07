# 💸 Expense Tracker Web App

A beautifully designed and powerful Expense Tracker built with **Next.js**, featuring:
- Dashboard with graphs
- OTP-based login/signup
- CSV export
- Expense/income categorization
- Forgot password via email
- And more…

---

## 📦 How to Setup (Step-by-Step Guide)

### ✅ Step 1: Download & Extract

1. Download the `.zip` file provided.
2. Extract the contents.
3. Open the extracted folder in your code editor.  
   👉 **VS Code is recommended for beginners**.

---

### ⚙️ Step 2: Configure Environment Variables

This app requires your own configuration to function properly. In the root folder, you'll find a file named:

.env.example

javascript
Copy
Edit

➡️ Rename `.env.example` to `.env`  
➡️ Open the `.env` file and **replace the placeholder values** as shown below:

```env
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password
JWT_SECRET=your_random_secret_key
MONGODB=mongodb+srv://your_mongodb_connection_string
🔐 How to Get These Values:
📧 1. MAIL_USER and MAIL_PASS for Nodemailer (Gmail):
Use a Gmail account for sending OTP emails.

Go to: https://myaccount.google.com/apppasswords

Generate an App Password (16 characters) for "Mail" and "Other".

Use your Gmail ID as MAIL_USER, and generated password as MAIL_PASS.

🛡️ 2. JWT_SECRET:
Any random long string (e.g., use https://generate-random.org)

Example: JWT_SECRET=Jhsu2@hds78_jH8d9_sksk!

🗄️ 3. MONGODB:
Get your connection string from MongoDB Atlas

Example:
mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

▶️ Step 3: Run the App Locally
After setting up .env file:

bash
Copy
Edit
npm install       # Install dependencies
npm run dev       # Start development server at http://localhost:3000
🏗️ Step 4: Build for Production
To build the project for deployment:

bash
Copy
Edit
npm run build     # Builds the app
To preview production build locally:

bash
Copy
Edit
npm start
🚀 How to Deploy (Free Hosting Options)
📌 Option 1: Vercel (Recommended)
Go to https://vercel.com

Import your GitHub repository or upload the project

In "Environment Variables" section, add:

MAIL_USER

MAIL_PASS

JWT_SECRET

MONGODB

Click Deploy — done ✅

📌 Option 2: Render
Go to https://render.com

Create a new Web Service

Add your environment variables

Deploy your app in seconds

🛡️ Disclaimer
This is a self-hosted project. You must provide your own credentials for Gmail and MongoDB.
The developer is not responsible for any misuse, data breach, or security issue resulting from incorrect configuration.
DO NOT share your .env file publicly.

🙌 Support
For any setup issues or feedback, feel free to contact the developer.