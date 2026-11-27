# Setup on your computer

You need: Node.js (v20 or newer) and MongoDB running locally.

## 1. Backend (Express)
Open a terminal in the `Express` folder:

    cd Express
    npm install
    cp .env.example .env        (on Windows: copy .env.example .env)
    npm run seed
    npm run dev

You should see "connected to database" and "application is listening at port 8000".

## 2. Frontend (React)
Open a SECOND terminal in the `Frontend` folder:

    cd Frontend
    npm install
    npm run dev

Open http://localhost:5173

## Logins made by the seed
- Admin:  admin@stringsandharmony.com / admin123
- Seller: seller@stringsandharmony.com / seller123
