# 🚀 webleads: Your Modern Web Lead Management Application

![Project Banner](https://via.placeholder.com/1200x400/0A2540/FFFFFF?text=webleads+-+Elevate+Your+Lead+Management)
_A sleek and efficient solution for managing web leads, brought to you by Alok345._

Welcome to **webleads**! This project is designed to provide a robust and intuitive platform for collecting, organizing, and managing your web leads. Built with a cutting-edge tech stack, `webleads` offers a seamless user experience, powerful data handling capabilities, and a focus on performance and developer experience.

Whether you're looking to streamline your sales pipeline, track customer interest, or simply manage contact information, `webleads` equips you with the tools to do it effectively.

## ✨ Features

`webleads` comes packed with a suite of features designed to make lead management effortless and efficient:

*   **Intuitive User Interface:** A modern, responsive, and accessible UI crafted with Radix UI and Tailwind CSS for a superior user experience across all devices.
*   **Robust Data Management:** Leverage Firebase for secure and scalable storage of your lead data, ensuring reliability and real-time synchronization.
*   **Efficient Data Export:** Seamlessly export your lead data into industry-standard formats like Excel (`.xlsx`) and CSV, facilitating easy integration with other tools and reporting.
*   **Dynamic Animations:** Engaging and smooth user interactions powered by Framer Motion, adding a polished feel to the application.
*   **Comprehensive Iconography:** A rich set of beautiful and consistent icons provided by Lucide React to enhance clarity and visual appeal.
*   **Developer-Friendly Architecture:** Built on Next.js, offering excellent performance, server-side rendering, and a highly organized project structure.
*   **Component-Based Design:** Easy to extend and maintain thanks to a modular component architecture following Shadcn/UI conventions.

## 🛠️ Tech Stack

`webleads` is built with a powerful and modern set of technologies, ensuring high performance, scalability, and an excellent developer experience.

---

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radix-ui&logoColor=white" alt="Radix UI" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Lucide_React-282828?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide React" />
  <img src="https://img.shields.io/badge/XLSX-4CAF50?style=for-the-badge&logo=microsoft-excel&logoColor=white" alt="XLSX" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
</p>

---

*   **Framework**: [Next.js](https://nextjs.org/) (v16.0.10) – React framework for production.
*   **Frontend Library**: [React](https://reactjs.org/) (v19.2.1) – For building user interfaces.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v3) – A utility-first CSS framework.
*   **UI Components**: [Radix UI](https://www.radix-ui.com/) – Low-level UI components for building design systems.
*   **Backend/Database**: [Firebase](https://firebase.google.com/) (v12.6.0) – Backend services including Firestore for database.
*   **Animation**: [Framer Motion](https://www.framer.com/motion/) – Production-ready motion library for React.
*   **Icons**: [Lucide React](https://lucide.dev/) – A beautiful and consistent icon library.
*   **Data Handling**: [XLSX](https://www.npmjs.com/package/xlsx) & [FileSaver](https://www.npmjs.com/package/file-saver) – For reading, parsing, and writing spreadsheet files, and client-side file saving.
*   **Utilities**: `clsx`, `tailwind-merge`, `class-variance-authority` – For managing CSS classes dynamically.

## 📂 Project Structure

The project follows a well-organized structure to ensure maintainability and scalability, leveraging Next.js's App Router conventions.

```
webleads/
├── .vscode/               # VSCode specific settings
├── app/                   # Next.js App Router (root layout, pages, API routes)
│   ├── api/               # API routes
│   └── (root)/            # Main application pages
│       └── page.js        # Example root page
├── components/            # Reusable UI components (e.g., Shadcn/UI style components)
├── components.json        # Configuration file, typically for Shadcn/UI
├── hooks/                 # Custom React hooks for shared logic
├── lib/                   # Utility functions, Firebase initialization, helper modules
├── public/                # Static assets (images, fonts, favicons)
├── utils/                 # General purpose utility functions
├── .gitignore             # Specifies intentionally untracked files to ignore
├── firebase-debug.log     # Firebase debug logs (ignored)
├── jsconfig.json          # JavaScript language configuration
├── next.config.js         # Next.js configuration
├── package-lock.json      # Records the exact versions of dependencies
├── package.json           # Project metadata and dependencies
├── postcss.config.js      # PostCSS configuration for Tailwind CSS
├── README.md              # This file
└── tailwind.config.js     # Tailwind CSS configuration
```

## 🚀 Installation & Setup Instructions

To get `webleads` up and running on your local machine, follow these simple steps.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: [LTS version recommended](https://nodejs.org/en/download/) (v18.x or higher)
*   **npm** or **Yarn** or **pnpm** or **Bun**: Your preferred package manager.
    *   `npm` is included with Node.js.
    *   `yarn`: `npm install -g yarn`
    *   `pnpm`: `npm install -g pnpm`
    *   `bun`: `npm install -g bun`

### 1. Clone the Repository

```bash
git clone https://github.com/Alok345/webleads.git
cd webleads
```

### 2. Install Dependencies

Using your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Firebase Project Setup

`webleads` uses Firebase for its backend. You'll need to set up a new Firebase project and configure it.

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  Register a new web app in your Firebase project settings.
3.  Copy your Firebase configuration object. It will look something like this:

    ```javascript
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    ```

4.  Enable Firestore Database in your Firebase project.
5.  (Optional but recommended) Set up Firebase Authentication if you plan to add user login functionality.

### 4. Environment Variables

Create a `.env.local` file in the root of your project (same level as `package.json`) and add your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
```

Replace the placeholder values with your actual Firebase project configuration. Make sure to prefix these variables with `NEXT_PUBLIC_` so Next.js can expose them to the client-side.

## ▶️ Usage

Once everything is set up, you can run the application in development mode or build it for production.

### Development Mode

To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The page will auto-update as you edit files in the `app/` directory.

### Build for Production

To build the application for production:

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

This command optimizes your application for production, generating static assets and server-side code.

### Start Production Server

To start the production server after building:

```bash
npm run start
# or
yarn start
# or
pnpm start
# or
bun start
```

This will run your optimized Next.js application, typically on [http://localhost:3000](http://localhost:3000).

### Linting

To check for code quality and style issues:

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
# or
bun lint
```

## 📚 Learn More

To dive deeper into the technologies used in this project, check out these resources:

*   [Next.js Documentation](https://nextjs.org/docs) – Learn about Next.js features and API.
*   [Learn Next.js](https://nextjs.org/learn) – An interactive Next.js tutorial.
*   [Tailwind CSS Documentation](https://tailwindcss.com/docs) – Comprehensive guide to Tailwind CSS.
*   [Radix UI Documentation](https://www.radix-ui.com/docs) – Guides and API reference for Radix UI.
*   [Firebase Documentation](https://firebase.google.com/docs) – Everything you need to know about Firebase.

## ☁️ Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

*   Developed with passion by [Alok345](https://github.com/Alok345).
*   Bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
*   Special thanks to the open-source communities behind Next.js, React, Tailwind CSS, Radix UI, Firebase, Framer Motion, and Lucide React.