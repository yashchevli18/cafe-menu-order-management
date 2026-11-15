# Brew & Bean – Cafe Menu & Order Management System

A MERN web app for a coffee shop. Customers scan the QR code on their table, browse the menu, add items to a cart and place an order without creating an account. They can then track their order with the order number and phone number.

**Live demo:** https://cafe-menu-order-management.vercel.app
**API docs (Swagger):** https://brew-and-bean-api-qqi9.onrender.com/api/docs

> The API runs on Render's free plan, so the first request after a period of inactivity can take up to a minute.

## Tech stack

| Part | Technologies |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS 4, React Router, Axios, Context API, Formik + Yup, Lucide React, React Hot Toast, qrcode.react |
| Backend | Node.js, Express 5, Mongoose, express-validator, Helmet, CORS, express-rate-limit, Swagger (swagger-jsdoc + swagger-ui-express) |
| Database | MongoDB Atlas |
| Hosting | Vercel (frontend), Render (backend) |

## Run locally

**Requirements:** Node.js 20+ and a MongoDB Atlas connection string.

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/brew_and_bean?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
MANAGEMENT_API_KEY=<any long random string>
```

Then load the sample menu and start the API:

```bash
npm run seed     # adds 26 menu items (safe to run again)
npm run dev      # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=/api
```

```bash
npm run dev      # http://localhost:5173
```

Open http://localhost:5173. To simulate scanning a table QR code, open http://localhost:5173/menu?table=5.

## Useful URLs (local)

| URL | Purpose |
| --- | --- |
| http://localhost:5173 | Customer website |
| http://localhost:5173/table-qr | Generate QR codes for tables |
| http://localhost:5000/api/docs | Swagger API docs. Click **Authorize** and enter `MANAGEMENT_API_KEY` for menu create/update/delete and order management |
| http://localhost:5000/api/health | Health check |

## Scripts

| Folder | Command | What it does |
| --- | --- | --- |
| backend | `npm run dev` | Start the API with auto-reload |
| backend | `npm start` | Start the API (production) |
| backend | `npm run seed` | Insert or refresh the sample menu |
| backend | `npm run test:api` | Run the API smoke tests (API must be running) |
| frontend | `npm run dev` | Start the website |
| frontend | `npm run build` | Build the website for production |
