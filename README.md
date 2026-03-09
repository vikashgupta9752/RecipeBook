# 🍳 CookBook

CookBook is a modern, full-stack social recipe application built with the MERN stack. It allows users to discover, create, share, and interact with recipes in a beautiful, responsive interface. Whether you're a professional chef or a home cook, CookBook helps you organize your culinary life and connect with a community of food lovers.

## ✨ Features

### 🍽️ Recipe Management

- **Create & Edit:** Rich text editor for recipes including ingredients, step-by-step instructions, cooking time, difficulty, and nutritional info.
- **Forking System:** "Fork" any recipe to create your own version, keeping a link to the original inspiration.
- **Smart Interactions:** Like, Save (Bookmark), and Comment on recipes.
- **Dietary Tags:** Automatic categorization for Vegetarian/Non-Vegetarian and other dietary preferences.
- **Unique View Tracking:** Intelligent view counting system that tracks unique visits per user/IP every 24 hours.

### 🔍 Discovery & Navigation

- **Discover Page:** Powerful search and filtering options to find the perfect dish.
- **Trending Section:** Algorithmic "Trending" page featuring top recipes in a stylish Bento Grid layout.
- **Featured Recipes:** curated slider showcasing highlight recipes.
- **Responsive Design:** Fully responsive UI that works seamlessly on desktop, tablet, and mobile.

### 👥 Community & Social

- **User Profiles:** Customize your profile with an avatar and bio.
- **Activity Feed:** Stay updated with notifications when people like, comment, or fork your recipes.
- **Friends & Groups:** Connect with other cooks and join culinary groups (Feature in progress).

### 🛡️ Admin Dashboard

- **Comprehensive Overview:** Dashboard with real-time statistics on users, recipes, and engagement.
- **User Management:** Admins can view, suspend, promote, or delete users.
- **Content Moderation:** Full control to edit or delete any recipe.
- **Stats Control:** Manually adjust view and like counts for recipes to boost visibility.
- **Daily Inspirations:** Manage the "Daily Quote" displayed to users.

### 🎨 UI/UX

- **Modern Aesthetics:** Clean, minimalist design with glassmorphism elements.
- **Dark Mode:** Built-in dark theme support that respects system preferences or user toggle.
- **Smooth Animations:** Polished transitions and micro-interactions.

---

## 🛠️ Tech Stack

### Frontend

- **React:** UI Library
- **Vite:** Build tool for fast development
- **Tailwind CSS:** Utility-first styling
- **Lucide React:** Beautiful, consistent icons
- **Axios:** HTTP client
- **React Router:** Navigation

### Backend

- **Node.js & Express:** Server-side runtime and framework
- **MongoDB & Mongoose:** NoSQL Database and ODM
- **JWT (JSON Web Tokens):** Secure authentication
- **Bcrypt:** Password hashing

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (Local or Atlas URI)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/cookbook.git
    cd cookbook
    ```

2.  **Install Server Dependencies**

    ```bash
    cd server
    npm install
    ```

3.  **Install Client Dependencies**
    ```bash
    cd ../client
    npm install
    ```

### Configuration

1.  **Server Environment Variables**
    Create a `.env` file in the `server` directory:

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    ```

2.  **Client Environment Variables** (Optional)
    Create a `.env` file in the `client` directory if you need to override the API URL:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

### Running the App

1.  **Start the Backend Server**

    ```bash
    # In /server directory
    npm run server
    # OR for development with nodemon
    npm run dev
    ```

2.  **Start the Frontend Client**

    ```bash
    # In /client directory
    npm run dev
    ```

3.  Open your browser and navigate to `http://localhost:5173`.

---

## 👑 Admin Access

To access the Admin Dashboard:

1.  Register a new user account.
2.  Manually update the user document in MongoDB to set `isAdmin: true`, or use the provided seeding script:
    ```bash
    # In /server directory
    node createAdmin.js
    ```
3.  Log in and navigate to `/admin` or click the Admin link in the sidebar.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
