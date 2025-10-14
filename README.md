# CreditSea - XML Credit Report Processing Application

A fullstack MERN application for processing and analyzing XML credit pull data from Experian. The application provides a comprehensive solution for uploading, parsing, storing, and viewing credit reports with a modern, responsive user interface.

## 🚀 Features

### Backend Features
- **XML File Upload**: RESTful API endpoint for secure XML file uploads
- **Data Extraction**: Advanced XML parsing with comprehensive data extraction
- **MongoDB Storage**: Well-designed schema for storing credit report data
- **RESTful APIs**: Complete CRUD operations for credit reports
- **Error Handling**: Robust error handling and validation
- **Security**: Rate limiting, CORS protection, and input validation
- **Logging**: Comprehensive logging with Winston

### Frontend Features
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **File Upload**: Drag-and-drop XML file upload with validation
- **Report Viewing**: Comprehensive credit report display with multiple views
- **Real-time Updates**: Live status updates and notifications
- **Search & Filter**: Advanced filtering and sorting capabilities
- **Mobile Responsive**: Optimized for all device sizes

### Data Processing
- **Basic Details**: Name, Mobile Phone, PAN, Credit Score
- **Report Summary**: Account statistics, balance information, recent enquiries
- **Credit Accounts**: Detailed account information with status tracking
- **Addresses**: Multiple address management with type classification

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Multer** - File upload handling
- **xml2js** - XML parsing
- **Joi** - Data validation
- **Winston** - Logging
- **Jest** - Testing framework

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **MongoDB** (v5 or higher)
- **npm** or **yarn**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd credit-sea-assignment
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your configuration
# MONGODB_URI=mongodb://localhost:27017/creditsea
# PORT=5000
# NODE_ENV=development

# Start MongoDB (if not already running)
# On Windows: net start MongoDB
# On macOS: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

# Start the backend server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to client directory (in a new terminal)
cd client

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your configuration
# VITE_API_URL=http://localhost:5000/api

# Start the frontend development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 📁 Project Structure

```
credit-sea-assignment/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── config/            # Configuration files
│   ├── middleware/        # Express middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── tests/            # Test files
│   ├── logs/             # Log files
│   ├── package.json
│   └── server.js
└── README.md
```

## 🔧 API Endpoints

### Credit Reports
- `POST /api/credit-reports/upload` - Upload XML file
- `GET /api/credit-reports` - Get all reports (with pagination)
- `GET /api/credit-reports/:id` - Get report by ID
- `GET /api/credit-reports/pan/:pan` - Get reports by PAN
- `GET /api/credit-reports/pan/:pan/latest` - Get latest report by PAN
- `DELETE /api/credit-reports/:id` - Delete report

### Health Check
- `GET /health` - API health status

## 📊 Database Schema

### CreditReport Model
```javascript
{
  // Basic Details
  name: String,
  mobilePhone: String,
  pan: String (validated format),
  creditScore: Number (300-900),
  
  // Report Summary
  reportSummary: {
    totalAccounts: Number,
    activeAccounts: Number,
    closedAccounts: Number,
    currentBalanceAmount: Number,
    securedAccountsAmount: Number,
    unsecuredAccountsAmount: Number,
    last7DaysCreditEnquiries: Number
  },
  
  // Credit Accounts
  creditAccounts: [{
    accountNumber: String,
    accountType: String,
    bankName: String,
    currentBalance: Number,
    amountOverdue: Number,
    creditLimit: Number,
    accountStatus: String,
    openedDate: Date,
    lastPaymentDate: Date,
    emiAmount: Number
  }],
  
  // Addresses
  addresses: [{
    type: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  }],
  
  // Metadata
  reportDate: Date,
  xmlFileName: String,
  processingStatus: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

### Test Coverage
The application includes comprehensive tests for:
- API endpoints
- Data validation
- Error handling
- Database operations

## 📝 Usage Guide

### 1. Upload XML File
1. Navigate to the Upload page
2. Drag and drop or select an XML file
3. Wait for processing to complete
4. View the generated report

### 2. View Reports
1. Go to the Reports page
2. Browse all uploaded reports
3. Use filters and sorting options
4. Click on any report to view details

### 3. Report Details
- **Overview**: Basic information and summary statistics
- **Credit Accounts**: Detailed account information
- **Addresses**: Address history and details

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive data validation
- **File Type Validation**: Only XML files allowed
- **File Size Limits**: Maximum 10MB file size
- **CORS Protection**: Configured for secure cross-origin requests
- **Error Handling**: Secure error messages without sensitive data exposure

## 🚀 Deployment

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/creditsea
PORT=5000
NODE_ENV=production
MAX_FILE_SIZE=10485760
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_NODE_ENV=production
```

### Production Build
```bash
# Backend
cd server
npm start

# Frontend
cd client
npm run build
npm run preview
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env file
   - Verify database permissions

2. **File Upload Issues**
   - Check file size (max 10MB)
   - Ensure file is valid XML format
   - Verify file permissions

3. **API Connection Issues**
   - Check if backend server is running
   - Verify API URL in frontend .env
   - Check CORS configuration

### Logs
- Backend logs: `server/logs/`
- Check console for frontend errors
- Use browser developer tools for debugging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

## 🎯 Future Enhancements

- [ ] User authentication and authorization
- [ ] Advanced reporting and analytics
- [ ] Data export functionality
- [ ] Real-time notifications
- [ ] Bulk file processing
- [ ] API rate limiting per user
- [ ] Data encryption at rest
- [ ] Audit logging
- [ ] Performance monitoring
- [ ] Automated testing pipeline

---

**Built with ❤️ using the MERN stack**
