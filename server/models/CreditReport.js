import mongoose from 'mongoose';

// Address Schema
const addressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['current', 'previous', 'permanent'],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: String,
  state: String,
  pincode: String,
  country: String
});

// Credit Account Schema
const creditAccountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    enum: ['credit_card', 'personal_loan', 'home_loan', 'auto_loan', 'other'],
    required: true
  },
  bankName: {
    type: String,
    required: true
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  amountOverdue: {
    type: Number,
    default: 0
  },
  creditLimit: Number,
  accountStatus: {
    type: String,
    enum: ['active', 'closed', 'suspended', 'written_off'],
    default: 'active'
  },
  openedDate: Date,
  lastPaymentDate: Date,
  emiAmount: Number
});

// Main Credit Report Schema
const creditReportSchema = new mongoose.Schema({
  // Basic Details
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobilePhone: {
    type: String,
    required: true,
    trim: true
  },
  pan: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format']
  },
  creditScore: {
    type: Number,
    min: 300,
    max: 900,
    required: true
  },
  
  // Report Summary
  reportSummary: {
    totalAccounts: {
      type: Number,
      default: 0
    },
    activeAccounts: {
      type: Number,
      default: 0
    },
    closedAccounts: {
      type: Number,
      default: 0
    },
    currentBalanceAmount: {
      type: Number,
      default: 0
    },
    securedAccountsAmount: {
      type: Number,
      default: 0
    },
    unsecuredAccountsAmount: {
      type: Number,
      default: 0
    },
    last7DaysCreditEnquiries: {
      type: Number,
      default: 0
    }
  },
  
  // Credit Accounts Information
  creditAccounts: [creditAccountSchema],
  
  // Addresses
  addresses: [addressSchema],
  
  // Metadata
  reportDate: {
    type: Date,
    default: Date.now
  },
  xmlFileName: {
    type: String,
    required: true
  },
  processingStatus: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  errorMessage: String,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
creditReportSchema.index({ pan: 1 });
creditReportSchema.index({ mobilePhone: 1 });
creditReportSchema.index({ createdAt: -1 });
creditReportSchema.index({ reportDate: -1 });

// Pre-save middleware to update the updatedAt field
creditReportSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for calculating total balance
creditReportSchema.virtual('totalBalance').get(function() {
  return this.creditAccounts.reduce((total, account) => total + (account.currentBalance || 0), 0);
});

// Virtual for calculating total overdue
creditReportSchema.virtual('totalOverdue').get(function() {
  return this.creditAccounts.reduce((total, account) => total + (account.amountOverdue || 0), 0);
});

// Method to get active accounts
creditReportSchema.methods.getActiveAccounts = function() {
  return this.creditAccounts.filter(account => account.accountStatus === 'active');
};

// Method to get closed accounts
creditReportSchema.methods.getClosedAccounts = function() {
  return this.creditAccounts.filter(account => account.accountStatus === 'closed');
};

// Static method to find reports by PAN
creditReportSchema.statics.findByPAN = function(pan) {
  return this.find({ pan: pan.toUpperCase() }).sort({ reportDate: -1 });
};

// Static method to find latest report by PAN
creditReportSchema.statics.findLatestByPAN = function(pan) {
  return this.findOne({ pan: pan.toUpperCase() }).sort({ reportDate: -1 });
};

// Ensure virtual fields are serialized
creditReportSchema.set('toJSON', { virtuals: true });
creditReportSchema.set('toObject', { virtuals: true });

const CreditReport = mongoose.model('CreditReport', creditReportSchema);

export default CreditReport;
