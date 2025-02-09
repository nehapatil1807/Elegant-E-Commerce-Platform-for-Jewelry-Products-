# SpringBoot-Project

# E-Commerce Platform

## Overview
This project is a full-stack e-commerce platform consisting of a **React frontend** and a **Spring Boot backend**. The application provides authentication, product management, and order processing features.

## Features
- **User Authentication** (JWT-based login/register/logout)
- **Product Management** (Admin can add/edit/delete products)
- **Cart & Order Processing**
- **Secure Payment Integration** (Planned Feature)
- **Admin Dashboard for Order Management**
- **Responsive UI with Tailwind CSS**

---

## **Frontend (React)**

### **Tech Stack**
- React
- Tailwind CSS for styling
- React Router for navigation

### **Installation & Setup**
1. Navigate to the React project directory:
   ```sh
   cd Front_End
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```
4. The frontend will be available at `http://localhost:5173`

### **Project Structure**
```
react/
├── public/          # Static assets
├── src/             # Source code
│   ├── components/  # UI components
│   ├── pages/       # Page views
│   ├── data.js      # Sample data storage
│   ├── App.js       # Main application file
│   └── index.js     # React entry point
└── package.json     # Dependencies
```

---

## **Backend (Spring Boot API)**

### **Tech Stack**
- Spring Boot (Java)
- Spring Security with JWT Authentication
- MySQL Database
- Maven for dependency management

### **Installation & Setup**
1. Navigate to the backend directory:
   ```sh
   cd Back_End
   ```
2. Configure the database in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   ```
3. Build & run the application:
   ```sh
   mvn clean install
   mvn spring-boot:run
   ```
4. The backend will run at `http://localhost:8080`

### **API Endpoints**
| Endpoint                 | Method | Description               |
|--------------------------|--------|---------------------------|
| `/auth/login`           | POST   | User login with JWT       |
| `/auth/register`        | POST   | New user registration     |
| `/products`             | GET    | Fetch all products        |
| `/products/{id}`        | GET    | Fetch product details     |
| `/cart/add`             | POST   | Add item to cart          |
| `/order/checkout`       | POST   | Place an order            |

### **Project Structure**
```
spring boot api/
├── src/main/java/com/cdac/
│   ├── config/        # Security & JWT configuration
│   ├── controller/    # REST API controllers
│   ├── service/       # Business logic layer
│   ├── repository/    # Database access layer
│   ├── model/         # Entity models
│   └── ECommerceApplication.java  # Main class
└── pom.xml            # Maven dependencies
```

---

## **Connecting Frontend & Backend**
1. Update API base URL in the React project:
   ```js
   const API_BASE_URL = "http://localhost:8080";
   ```
2. Ensure both **frontend (port 5173)** and **backend (port 8080)** are running.
3. Open the frontend in your browser to test full functionality.

---

## **Future Enhancements**
- Payment Gateway Integration (Stripe/PayPal)
- User Reviews & Ratings
- Admin Dashboard Enhancements



