exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

exports.isVendor = (req, res, next) => {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "Access denied: Vendors only" });
  }
  next();
};

exports.isBuyer = (req, res, next) => {
  if (req.user.role !== "buyer") {
    return res.status(403).json({ message: "Access denied: Buyers only" });
  }
  next();
};
