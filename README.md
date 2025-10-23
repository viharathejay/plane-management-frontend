cd ~/Desktop/plane-management-frontend
cat > README.md << 'EOF'
# ✈️ Plane Management System - Frontend

Beautiful React web application for booking airplane seats with colorful gradient UI.

## 🎨 Features
- Interactive seating plan
- Real-time seat booking
- Search tickets
- View all bookings
- Beautiful gradient design
- Smooth animations

## 🛠️ Tech Stack
- React 18
- Lucide React Icons
- Modern CSS Gradients

## 📦 Installation
```bash
# Clone the repository
git clone https://github.com/viharathejay/plane-management-frontend.git
cd plane-management-frontend

# Install dependencies
npm install

# Start the app
npm start
```

App runs at: `http://localhost:3000`

## ⚙️ Backend Required
Make sure the backend is running at `http://localhost:8080`

Backend repo: [plane-management-system](https://github.com/viharathejay/plane-management-system)

## 🎯 Features
- **Seating Plan:** Visual seat map (green=available, pink=booked)
- **Book Seat:** Easy booking form with validation
- **Search:** Find tickets by row/seat
- **Tickets:** View all bookings and total sales

## 👨‍💻 Author
Vihara
EOF

git add README.md
git commit -m "Add README documentation"
git push
