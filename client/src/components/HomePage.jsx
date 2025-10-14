import { Link } from 'react-router-dom';
import { Upload, FileText, TrendingUp, Shield, Clock, Users } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Upload,
      title: 'Easy XML Upload',
      description: 'Simply drag and drop your XML credit report files for instant processing and analysis.'
    },
    {
      icon: FileText,
      title: 'Comprehensive Reports',
      description: 'View detailed credit reports with all essential information including accounts, addresses, and scores.'
    },
    {
      icon: TrendingUp,
      title: 'Credit Score Analysis',
      description: 'Get insights into credit scores with visual indicators and detailed breakdowns.'
    },
    {
      icon: Shield,
      title: 'Secure Processing',
      description: 'Your data is processed securely with industry-standard encryption and privacy protection.'
    },
    {
      icon: Clock,
      title: 'Real-time Processing',
      description: 'Upload and process XML files instantly with real-time status updates and notifications.'
    },
    {
      icon: Users,
      title: 'Multi-user Support',
      description: 'Support for multiple credit reports with advanced filtering and search capabilities.'
    }
  ];

  const stats = [
    { label: 'Reports Processed', value: '1,000+' },
    { label: 'Active Users', value: '500+' },
    { label: 'Success Rate', value: '99.9%' },
    { label: 'Processing Time', value: '< 5s' }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          CreditSea
          <span className="block text-blue-600">XML Processing</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Process and analyze Experian credit pull XML files with our advanced MERN stack application. 
          Upload, parse, and view comprehensive credit reports in seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/upload"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload XML File
          </Link>
          <Link
            to="/reports"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-5 w-5 mr-2" />
            View Reports
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose CreditSea?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 ml-3">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload XML</h3>
            <p className="text-gray-600">
              Upload your Experian credit pull XML file using our secure upload interface.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Process & Parse</h3>
            <p className="text-gray-600">
              Our system automatically parses the XML and extracts all credit information.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Reports</h3>
            <p className="text-gray-600">
              Access comprehensive credit reports with detailed analysis and insights.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 rounded-lg p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8 opacity-90">
          Upload your first XML credit report and experience the power of CreditSea.
        </p>
        <Link
          to="/upload"
          className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
        >
          <Upload className="h-5 w-5 mr-2" />
          Start Processing
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
