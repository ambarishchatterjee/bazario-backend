// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./config/db");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const connectMongo = require("connect-mongo");
const flash = require('connect-flash')


const app = express();
app.use((req, res, next) => {
  console.log("Request hit:", req.method, req.url);
  next();
});

db();

//session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: connectMongo.create({
      collectionName: "sessions",
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 2 }, //2 hrs
  })
);

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);

//flash
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// =======================
// Middleware
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));

// Static folder for public files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));


//swagger
const swaggerDocs = require("./swagger");
swaggerDocs(app)


// =======================
// Routes
// =======================
const authRoutes = require("./routes/authRoutes");
//const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const adminViewRoutes = require("./routes/adminViewRoutes");
const adminActionRoutes = require("./routes/adminActionRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/vendors", vendorRoutes);

app.use("/admin", adminViewRoutes);
app.use("/admin", adminActionRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send({ message: "Multi-vendor API is running 🚀" });
});

// =======================
// Error handling middleware
// =======================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// =======================
// MongoDB Connection
// =======================

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
