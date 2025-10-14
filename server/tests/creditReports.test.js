import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import CreditReport from '../models/CreditReport.js';

// Test database setup
const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/creditsea_test';

describe('Credit Reports API', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(MONGODB_TEST_URI);
  });

  afterAll(async () => {
    // Clean up and close connection
    await CreditReport.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the test database before each test
    await CreditReport.deleteMany({});
  });

  describe('GET /api/credit-reports', () => {
    it('should return empty array when no reports exist', async () => {
      const response = await request(app)
        .get('/api/credit-reports')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reports).toEqual([]);
      expect(response.body.data.pagination.totalCount).toBe(0);
    });

    it('should return reports with pagination', async () => {
      // Create test reports
      const testReports = [
        {
          name: 'John Doe',
          mobilePhone: '9876543210',
          pan: 'ABCDE1234F',
          creditScore: 750,
          reportSummary: {
            totalAccounts: 5,
            activeAccounts: 3,
            closedAccounts: 2,
            currentBalanceAmount: 50000,
            securedAccountsAmount: 30000,
            unsecuredAccountsAmount: 20000,
            last7DaysCreditEnquiries: 1
          },
          creditAccounts: [],
          addresses: [],
          xmlFileName: 'test1.xml'
        },
        {
          name: 'Jane Smith',
          mobilePhone: '9876543211',
          pan: 'ABCDE1234G',
          creditScore: 650,
          reportSummary: {
            totalAccounts: 3,
            activeAccounts: 2,
            closedAccounts: 1,
            currentBalanceAmount: 30000,
            securedAccountsAmount: 20000,
            unsecuredAccountsAmount: 10000,
            last7DaysCreditEnquiries: 0
          },
          creditAccounts: [],
          addresses: [],
          xmlFileName: 'test2.xml'
        }
      ];

      await CreditReport.insertMany(testReports);

      const response = await request(app)
        .get('/api/credit-reports')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reports).toHaveLength(2);
      expect(response.body.data.pagination.totalCount).toBe(2);
    });
  });

  describe('GET /api/credit-reports/:id', () => {
    it('should return 404 for non-existent report', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/credit-reports/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('REPORT_NOT_FOUND');
    });

    it('should return report by valid ID', async () => {
      const testReport = new CreditReport({
        name: 'John Doe',
        mobilePhone: '9876543210',
        pan: 'ABCDE1234F',
        creditScore: 750,
        reportSummary: {
          totalAccounts: 5,
          activeAccounts: 3,
          closedAccounts: 2,
          currentBalanceAmount: 50000,
          securedAccountsAmount: 30000,
          unsecuredAccountsAmount: 20000,
          last7DaysCreditEnquiries: 1
        },
        creditAccounts: [],
        addresses: [],
        xmlFileName: 'test.xml'
      });

      const savedReport = await testReport.save();

      const response = await request(app)
        .get(`/api/credit-reports/${savedReport._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(savedReport._id.toString());
      expect(response.body.data.name).toBe('John Doe');
    });
  });

  describe('GET /api/credit-reports/pan/:pan', () => {
    it('should return 400 for invalid PAN format', async () => {
      const response = await request(app)
        .get('/api/credit-reports/pan/invalid-pan')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid PAN format');
    });

    it('should return reports by valid PAN', async () => {
      const testReport = new CreditReport({
        name: 'John Doe',
        mobilePhone: '9876543210',
        pan: 'ABCDE1234F',
        creditScore: 750,
        reportSummary: {
          totalAccounts: 5,
          activeAccounts: 3,
          closedAccounts: 2,
          currentBalanceAmount: 50000,
          securedAccountsAmount: 30000,
          unsecuredAccountsAmount: 20000,
          last7DaysCreditEnquiries: 1
        },
        creditAccounts: [],
        addresses: [],
        xmlFileName: 'test.xml'
      });

      await testReport.save();

      const response = await request(app)
        .get('/api/credit-reports/pan/ABCDE1234F')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.pan).toBe('ABCDE1234F');
      expect(response.body.data.reports).toHaveLength(1);
    });
  });

  describe('DELETE /api/credit-reports/:id', () => {
    it('should return 404 for non-existent report', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/credit-reports/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('REPORT_NOT_FOUND');
    });

    it('should delete report by valid ID', async () => {
      const testReport = new CreditReport({
        name: 'John Doe',
        mobilePhone: '9876543210',
        pan: 'ABCDE1234F',
        creditScore: 750,
        reportSummary: {
          totalAccounts: 5,
          activeAccounts: 3,
          closedAccounts: 2,
          currentBalanceAmount: 50000,
          securedAccountsAmount: 30000,
          unsecuredAccountsAmount: 20000,
          last7DaysCreditEnquiries: 1
        },
        creditAccounts: [],
        addresses: [],
        xmlFileName: 'test.xml'
      });

      const savedReport = await testReport.save();

      const response = await request(app)
        .delete(`/api/credit-reports/${savedReport._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.deletedId).toBe(savedReport._id.toString());

      // Verify report is deleted
      const deletedReport = await CreditReport.findById(savedReport._id);
      expect(deletedReport).toBeNull();
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('CreditSea API is running');
    });
  });
});
