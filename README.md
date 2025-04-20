# 🐣 Poultry Nexus ERP

A modular ERP system tailored for poultry equipment manufacturing and logistics. Designed to handle procurement, stock,
production, and order management workflows with precision, unit conversions, dimensions tracking, and automation.

---

## 🚀 What This Project Does

This ERP system covers:

- ✅ **Product Catalog**: Products, bundles, unit groups, categories
- ✅ **Stock Management**:
    - Real-time stock levels
    - UOM conversion support
    - Dimension-based inventory (e.g., width, height)
- ✅ **Order Management**:
    - Customers & sales orders
    - Order items and product bundles
    - Priority-based stock reservation
- ✅ **Stock Reservation Engine**:
    - Smart logic for dimensions, UOM, and bundle resolution
    - Revoke lower priority reservations automatically
- ✅ **Future-Ready Modules**:
    - Production work orders (planned)
    - Procurement requests (planned)

---

## 🛠️ Requirements

Only Docker is required:

- Docker (with Docker Compose)

---

## ⚙️ Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/Ahmed-31/poultry-nexus.git
cd poultry-nexus

# 2. Run the app using Docker
docker compose up -d --build
```

---

## 📚 Project Structure

```
app/
├── Models/               # Core models (Product, Order, Stock, etc.)
├── Services/             # Reservation logic, production hooks
├── Http/Controllers/     # API endpoints
├── Helpers/              # Stock helpers, dimension utilities
├── Console/              # Commands for cleanup, reporting
```

---

## 🧠 Key Concepts

- **UOM Groups & Conversion**: Each product belongs to a UOM group with a base unit. All stock is stored in base and
  input units.
- **Dimension-Aware Stock**: Products may have dimensional constraints (e.g. length, width).
- **Priority-Based Reservation**: Higher-priority orders can override stock reserved by lower ones.
- **Future Handling**:
    - Missing stock triggers `stock_shortages` which link to planned procurement/production modules.
    - Depleted stock is retained or removed based on relationships and cleanup strategy.

---

## ✅ What’s Working

- [x] Multi-product stock handling with dimensions
- [x] Orders, bundles, and nested reservations
- [x] Full stock reservation engine
- [x] Queue-ready structure

---

## 🔧 To-Do / Planned

- [ ] Production Module with Work Orders
- [ ] Procurement Module with Approvals
- [ ] Notifications and approvals dashboard
- [ ] UI for bundle progress tracking
- [ ] Admin settings for cleanup/auto-build

---

## 👤 Author

**Ahmed Elrefae**  
Backend Developer  
Email: ahmedelrefae56@gmail.com
GitHub: https://github.com/Ahmed-31

---

## 📄 License

MIT
