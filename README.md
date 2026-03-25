# CampusCart

> A full-stack, real-time marketplace platform designed specifically for college students to buy, sell, and trade items securely within their university ecosystem.

## 🚀 Key Features

- **Real-Time Bidding & Chat**: Integrated Socket.io for instantaneous communication between buyers and sellers, including typing indicators and read receipts.
- **Secure Authentication**: Robust JWT-based authentication system with `.edu` email validation to restrict access to verified students.
- **Dynamic UI/UX**: Built with Next.js and Tailwind CSS. Features highly responsive layouts, Framer Motion animations (spring modals, staggered lists), and skeleton loading states for seamless perceptions of speed.
- **Optimized Data Layer**: PostgreSQL database modeled with Prisma ORM. Implements a normalized schema encompassing users, products, categories, messages, and wishlists.
- **RESTful API Architecture**: Decoupled Express.js backend exposing scalable, modular endpoints.

## 🛠️ Technology Stack

**Frontend:**
- React 18, Next.js (App Router)
- Tailwind CSS, Framer Motion
- TypeScript

**Backend & Database:**
- Node.js, Express.js
- PostgreSQL, Prisma ORM
- Socket.io (WebSocket for real-time messaging)
- bcryptjs & JSON Web Tokens (Security)

---

## 📸 Screenshots

*(Add screenshots of your application here — e.g., Homepage, Product Listing, Real-time Chat UI)*

---

## ⚙️ Local Development

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally

### 1. Clone the repository
```bash
git clone https://github.com/dhyey1710/campuscart.git
cd campuscart
```

### 2. Environment Setup

Create a `.env` file in the `backend` directory based on the following template:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/campuscart"
JWT_SECRET="generate-a-strong-random-secret"
CLIENT_URL="http://localhost:3000"
PORT=5000
```

### 3. Install Dependencies & Setup Database

**Terminal 1 (Backend & Database):**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

**Terminal 2 (Frontend):**
```bash
# From the root directory
npm install
npm run dev
```

### 4. Access the Platform
- **Frontend App:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## 📈 Future Enhancements

- **Payment Gateway Integration**: Implement Stripe to handle on-platform escrow and direct deposits.
- **Advanced Filtering**: Full-text search and faceted navigation for item discovery.
- **Mobile Application**: React Native port sharing the same backend ecosystem.

---

*Designed and developed by [Dhyey](https://github.com/dhyey1710)*
