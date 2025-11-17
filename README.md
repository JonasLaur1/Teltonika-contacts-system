# Teltonika Contact System

A modern, full-stack contact management application built for Teltonika's internship program. This system provides a clean and intuitive interface for managing contacts with complete CRUD functionality, powered by Vue 3 and PocketBase.

## 📋 Overview

This contact management system allows users to efficiently store, view, update, and delete contact information. Built with modern web technologies.

The application demonstrates practical implementation of:
- RESTful API integration with PocketBase backend
- Reactive component-based UI with Vue 3
- Modern development workflow using Vite
- Responsive design principles with Tailwind CSS
- Client-side routing for smooth navigation

## 🚀 Features

### Contact Management
- **Add Contacts** - Create new contact entries with name, email, phone number, and position/role
- **View Contacts** - Browse through all stored contacts in an organized, easy-to-read layout
- **Edit Contacts** - Update contact information whenever details change
- **Delete Contacts** - Remove outdated contacts with confirmation to prevent accidental deletions

### Technical Highlights
- **Form Validation** - Ensures data integrity with client-side validation before submission
- **Responsive Design** - Fluid layout that adapts to any screen size using Tailwind's utility classes
- **Single Page Application** - Fast navigation without page reloads thanks to Vue Router
- **Component Architecture** - Modular, reusable components for maintainable code
- **Real-time Data Sync** - PocketBase integration ensures data consistency across sessions

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **Vue 3** | Progressive JavaScript framework for building reactive user interfaces |
| **Vite** | Next-generation build tool providing lightning-fast HMR and optimized builds |
| **PocketBase** | Open-source backend providing database, REST API, and admin panel in one |
| **Tailwind CSS** | Utility-first CSS framework for rapid UI development |
| **Vue Router** | Official routing library for Vue.js single-page applications |

## ⚙️ Installation & Setup

### Prerequisites

Before getting started, ensure you have:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- Basic command line knowledge

### Backend Setup (PocketBase)

1. **Download PocketBase**
   - Visit [pocketbase.io](https://pocketbase.io/) and download the version for your operating system
   - Extract the executable to a directory of your choice

2. **Start PocketBase Server**
   ```bash
   # On macOS/Linux
   ./pocketbase serve

   # On Windows
   pocketbase.exe serve
   ```
   PocketBase will start on `http://127.0.0.1:8090` by default

3. **Configure Admin Panel**
   - Open `http://127.0.0.1:8090/_/` in your browser
   - Create an admin account on first visit
   - This account allows you to manage your database

4. **Create Contacts Collection**
   - In the admin panel, navigate to **Collections**
   - Click **New Collection**
   - Set collection name to `contacts` (important: use this exact name)
   - Add the following fields:

   | Field Name | Type | Required |
   |------------|------|----------|
   | name | Text | ✓ |
   | email | Email | ✓ |
   | phone | Text | ✓ |
   | position | Text | ✗ |

### Frontend Setup (Vue Application)

1. **Clone the Repository**
   ```bash
   git clone https://github.com/JonasLaur1/Teltonika-contacts-system.git
   cd Teltonika-contacts-system/client
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   This will install all required packages defined in `package.json`

3. **Configure PocketBase Connection**
   
   Open `src/services/pocketbaseService.js` and verify the PocketBase URL:
   ```javascript
   const pb = new PocketBase('http://127.0.0.1:8090');
   ```
   Update this if you're running PocketBase on a different port or host

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

🎉 **You're all set!** Open your browser and start managing contacts.

## 🔧 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint and fix code
npm run lint
```

## 🐛 Troubleshooting

### Cannot connect to PocketBase
- **Check if PocketBase is running**: Look for the process in your terminal
- **Verify the URL**: Ensure `pocketbaseService.js` has the correct PocketBase URL
- **Firewall**: Make sure port 8090 isn't blocked by your firewall

### Collection not found error
- **Collection name**: Must be exactly `contacts` (lowercase, no spaces)
- **Fields**: Verify all required fields are created with correct types
- **API rules**: Check that the collection has proper read/write permissions

### Changes not appearing
- **Hard refresh**: Try Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- **Check console**: Look for JavaScript errors in browser developer tools
- **Verify data**: Check PocketBase admin UI to see if data was saved
- **Cache**: Clear browser cache if issues persist

### Styling issues
- **Dependencies**: Run `npm install` to ensure all packages are installed
- **Tailwind config**: Verify `tailwind.config.js` exists and is configured correctly
- **Build process**: Try deleting `node_modules` and running `npm install` again

## 🤝 Contributing

This project was created as part of Teltonika's internship program. While it's primarily for educational purposes, suggestions and improvements are welcome!

## 📝 License

This project was created for Teltonika's internship program and serves as a demonstration of front-end development capabilities.

---

**Built with ❤️ during Teltonika's Internship Program**
