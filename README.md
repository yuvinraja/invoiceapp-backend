# Invoice Management System - Backend API

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://jwt.io/)

> A robust, production-ready RESTful API for comprehensive invoice management, built with modern TypeScript, enterprise-grade security, and scalable architecture.

## 🚀 Project Overview

This backend system powers a comprehensive invoice management platform designed for small to medium businesses operating in the Indian GST ecosystem. The API handles complex tax calculations (CGST/SGST/IGST), multi-client management, and provides real-time business analytics dashboard capabilities.

### Problem Statement & Solution

**Challenge**: Small businesses struggle with GST-compliant invoice generation, client management, and financial analytics tracking.

**Solution**: A feature-rich API that automates Indian tax calculations, manages client relationships, and provides actionable business insights through comprehensive reporting endpoints.

## ✨ Key Features

### 🧮 Advanced Tax Engine
- **Smart GST Calculation**: Automatic CGST/SGST vs IGST determination based on shipping addresses
- **Multi-Tax Rate Support**: Configurable tax rates with validation
- **Real-time Calculations**: Dynamic subtotal, tax, and total computations

### 👥 Client Relationship Management
- **Smart Client Detection**: Automatic client creation and duplicate prevention
- **Complete Profile Management**: GST numbers, addresses, and contact information
- **Client Analytics**: Revenue tracking per client with top performers identification

### 📊 Business Intelligence Dashboard
- **Revenue Analytics**: Total revenue, average invoice value, and trend analysis
- **Invoice Type Distribution**: TAX vs PROFORMA invoice breakdown
- **Tax Type Analytics**: CGST/SGST vs IGST usage patterns
- **Client Performance Metrics**: Top revenue-generating clients

### 🔐 Enterprise-Grade Security
- **JWT Authentication**: Secure token-based authentication with HTTP-only cookies
- **Password Encryption**: bcrypt hashing with salt rounds
- **Environment Validation**: Zod-based configuration validation
- **CORS Protection**: Configurable cross-origin resource sharing

### 📸 File Management
- **Cloudinary Integration**: Scalable logo upload and management
- **Multer Middleware**: Robust file handling with validation

## 🛠 Technologies & Architecture

### Backend Stack
- **Runtime**: Node.js with TypeScript for type safety and scalability
- **Framework**: Express.js with modular route architecture
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Authentication**: JWT with secure cookie implementation
- **File Storage**: Cloudinary for optimized image management
- **Validation**: Zod for runtime type checking and environment validation

### Development Tools
- **TypeScript**: Full type safety with strict configuration
- **Prisma**: Database schema management with automated migrations
- **Nodemon**: Hot reload for development efficiency
- **Morgan**: HTTP request logging for debugging

### Security Implementation
- **Helmet**: Security headers configuration
- **bcryptjs**: Password hashing and verification
- **Cookie Security**: HTTP-only, secure, and SameSite configurations
- **Environment Variables**: Secure configuration management

## 📁 Project Structure

```
src/
├── config/
│   ├── db.ts              # Prisma client configuration
│   └── env.ts             # Environment validation with Zod
├── controllers/
│   ├── authController.ts  # Authentication logic (signup/signin/logout)
│   ├── invoiceController.ts # Invoice CRUD and tax calculations
│   ├── statsController.ts  # Business analytics and reporting
│   └── userController.ts   # User profile management
├── middlewares/
│   ├── authMiddleware.ts   # JWT verification middleware
│   └── corsMiddleware.ts   # CORS configuration
├── routes/
│   ├── authRoutes.ts       # Authentication endpoints
│   ├── invoiceRoutes.ts    # Invoice management endpoints
│   ├── statsRoutes.ts      # Analytics endpoints
│   └── userRoutes.ts       # User management endpoints
├── lib/
│   ├── cloudinary.ts       # Cloudinary configuration
│   └── multer.ts           # File upload middleware
├── app.ts                  # Express application setup
└── server.ts               # Server initialization
prisma/
├── schema.prisma           # Database schema definition
└── migrations/             # Database migration history
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Cloudinary account (for file uploads)

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/invoiceapp"

# Authentication
JWT_SECRET="your-super-secure-jwt-secret"

# Server Configuration
PORT=5000
FRONTEND_URL="http://localhost:3000"
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yuvinraja/invoiceapp-backend.git
   cd invoiceapp-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Production build**
   ```bash
   npm run build
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints
```typescript
POST /api/auth/signup    # User registration
POST /api/auth/signin    # User login
POST /api/auth/logout    # User logout
```

### Invoice Management
```typescript
GET    /api/invoices     # Fetch user invoices with pagination
POST   /api/invoices     # Create new invoice with automatic tax calculation
GET    /api/invoices/:id # Get specific invoice details
DELETE /api/invoices/:id # Delete invoice
```

### Business Analytics
```typescript
GET /api/stats           # Revenue analytics and invoice statistics
GET /api/stats/clients   # Top performing clients analysis
```

### User Management
```typescript
GET  /api/user/profile   # Get user profile
PUT  /api/user/profile   # Update user profile
POST /api/user/logo      # Upload company logo
```

### Example: Create Invoice Request
```json
{
  "invoiceNumber": 1001,
  "invoiceType": "TAX",
  "taxType": "CGST_SGST",
  "taxRate": 18,
  "invoiceDate": "2024-01-15T00:00:00.000Z",
  "client": {
    "name": "ABC Corporation",
    "gstin": "29ABCDE1234F1Z5",
    "address": "123 Business St",
    "city": "Mumbai",
    "state": "Maharashtra"
  },
  "items": [
    {
      "description": "Web Development Services",
      "hsnCode": "998314",
      "quantity": 1,
      "rate": 50000
    }
  ]
}
```

## 📊 Business Impact & Technical Achievements

### Performance Optimizations
- **Database Indexing**: Optimized queries for user-specific data retrieval
- **Prisma Relations**: Efficient joins and data fetching strategies
- **Calculated Fields**: Pre-computed totals to reduce real-time calculation overhead

### Scalability Considerations
- **Modular Architecture**: Clean separation of concerns for easy maintenance
- **Type Safety**: Comprehensive TypeScript implementation reduces runtime errors
- **Migration Strategy**: Version-controlled database schema changes
- **Environment Abstraction**: Easy deployment across different environments

### Code Quality & Maintainability
- **Clean Code Principles**: Self-documenting code with meaningful variable names
- **Error Handling**: Comprehensive try-catch blocks with proper error responses
- **Validation Layer**: Input validation at multiple levels (Zod, Prisma)
- **Security Best Practices**: Industry-standard authentication and authorization

## 🔄 Project Status

**Current Status**: ✅ **Production Ready**

### Completed Features
- ✅ Complete authentication system with JWT
- ✅ Invoice CRUD operations with tax calculations
- ✅ Client management system
- ✅ Business analytics dashboard
- ✅ File upload integration
- ✅ Database migrations and schema management

### Future Enhancements
- 🔄 Email notifications for invoice generation
- 🔄 PDF generation and download functionality
- 🔄 Advanced reporting with date range filters
- 🔄 Multi-currency support
- 🔄 API rate limiting and caching

## 🤝 Contributing

This project demonstrates enterprise-level development practices and is open for collaboration. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain test coverage for new features
- Update documentation for API changes
- Follow conventional commit messages

## 📬 Contact & Links

**Developer**: Yuvin Raja  
**GitHub**: [github.com/yuvinraja](https://github.com/yuvinraja)  
**Project Repository**: [invoiceapp-backend](https://github.com/yuvinraja/invoiceapp-backend)

---

*This project showcases expertise in modern backend development, database design, API architecture, and business logic implementation. It demonstrates the ability to build production-ready applications with proper security, scalability, and maintainability considerations.*

## 🎯 Skills Demonstrated

- **Backend Architecture**: RESTful API design and implementation
- **Database Design**: Complex relational modeling with Prisma ORM
- **Security Implementation**: Authentication, authorization, and data protection
- **Business Logic**: Complex tax calculations and financial analytics
- **Type Safety**: Comprehensive TypeScript implementation
- **DevOps Practices**: Environment management and deployment preparation
- **Code Quality**: Clean code principles and maintainable architecture
