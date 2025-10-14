import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Phone, CreditCard, MapPin, Calendar, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { creditReportsAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const ReportDetails = () => {
  const { id } = useParams();
  const { currentReport, setCurrentReport, setLoading, setError } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!currentReport || currentReport._id !== id) {
      fetchReport();
    }
  }, [id]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await creditReportsAPI.getReportById(id);
      if (response.success) {
        setCurrentReport(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      setError('Failed to fetch report details');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCreditScoreColor = (score) => {
    if (score >= 750) return 'text-green-600 bg-green-100';
    if (score >= 650) return 'text-yellow-600 bg-yellow-100';
    if (score >= 550) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getCreditScoreLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Poor';
  };

  const getAccountStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      case 'suspended':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'written_off':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAccountStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'closed':
        return 'text-gray-600 bg-gray-100';
      case 'suspended':
        return 'text-yellow-600 bg-yellow-100';
      case 'written_off':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!currentReport) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report details...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'accounts', label: 'Credit Accounts', icon: CreditCard },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/reports"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentReport.name}</h1>
            <p className="text-gray-600 mt-1">PAN: {currentReport.pan}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-full text-lg font-semibold ${getCreditScoreColor(currentReport.creditScore)}`}>
              {currentReport.creditScore}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Credit Score</div>
              <div className="text-sm font-medium">{getCreditScoreLabel(currentReport.creditScore)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Report Summary */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {currentReport.reportSummary?.totalAccounts || 0}
                </div>
                <div className="text-sm text-gray-600">Total Accounts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {currentReport.reportSummary?.activeAccounts || 0}
                </div>
                <div className="text-sm text-gray-600">Active Accounts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {currentReport.reportSummary?.closedAccounts || 0}
                </div>
                <div className="text-sm text-gray-600">Closed Accounts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {currentReport.reportSummary?.last7DaysCreditEnquiries || 0}
                </div>
                <div className="text-sm text-gray-600">Recent Enquiries</div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(currentReport.reportSummary?.currentBalanceAmount)}
                </div>
                <div className="text-sm text-gray-600">Current Balance</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(currentReport.reportSummary?.securedAccountsAmount)}
                </div>
                <div className="text-sm text-gray-600">Secured Amount</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(currentReport.reportSummary?.unsecuredAccountsAmount)}
                </div>
                <div className="text-sm text-gray-600">Unsecured Amount</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'accounts' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Credit Accounts</h2>
            <p className="text-gray-600 mt-1">
              {currentReport.creditAccounts?.length || 0} account{(currentReport.creditAccounts?.length || 0) !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {currentReport.creditAccounts?.length > 0 ? (
            <div className="divide-y">
              {currentReport.creditAccounts.map((account, index) => (
                <div key={index} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {account.bankName}
                        </h3>
                        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAccountStatusColor(account.accountStatus)}`}>
                          {getAccountStatusIcon(account.accountStatus)}
                          <span className="ml-1 capitalize">{account.accountStatus}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 font-mono">
                        Account: {account.accountNumber}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        Type: {account.accountType.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Current Balance</div>
                      <div className="font-semibold">{formatCurrency(account.currentBalance)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Amount Overdue</div>
                      <div className={`font-semibold ${account.amountOverdue > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatCurrency(account.amountOverdue)}
                      </div>
                    </div>
                    {account.creditLimit && (
                      <div>
                        <div className="text-sm text-gray-600">Credit Limit</div>
                        <div className="font-semibold">{formatCurrency(account.creditLimit)}</div>
                      </div>
                    )}
                    {account.emiAmount && (
                      <div>
                        <div className="text-sm text-gray-600">EMI Amount</div>
                        <div className="font-semibold">{formatCurrency(account.emiAmount)}</div>
                      </div>
                    )}
                  </div>
                  
                  {(account.openedDate || account.lastPaymentDate) && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      {account.openedDate && (
                        <div>
                          <span className="font-medium">Opened:</span> {formatDate(account.openedDate)}
                        </div>
                      )}
                      {account.lastPaymentDate && (
                        <div>
                          <span className="font-medium">Last Payment:</span> {formatDate(account.lastPaymentDate)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-600">
              No credit accounts found in this report.
            </div>
          )}
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Addresses</h2>
            <p className="text-gray-600 mt-1">
              {currentReport.addresses?.length || 0} address{(currentReport.addresses?.length || 0) !== 1 ? 'es' : ''} found
            </p>
          </div>
          
          {currentReport.addresses?.length > 0 ? (
            <div className="divide-y">
              {currentReport.addresses.map((address, index) => (
                <div key={index} className="p-6">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900 capitalize">
                          {address.type} Address
                        </h3>
                      </div>
                      <div className="text-gray-700">
                        <div>{address.address}</div>
                        {(address.city || address.state || address.pincode) && (
                          <div className="mt-1">
                            {address.city && <span>{address.city}</span>}
                            {address.city && address.state && <span>, </span>}
                            {address.state && <span>{address.state}</span>}
                            {address.pincode && <span> - {address.pincode}</span>}
                          </div>
                        )}
                        {address.country && (
                          <div className="text-sm text-gray-600 mt-1">{address.country}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-600">
              No addresses found in this report.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportDetails;
