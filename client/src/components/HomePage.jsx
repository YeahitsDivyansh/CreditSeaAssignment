import { Link } from "react-router-dom";
import { Upload, FileText } from "lucide-react";

const HomePage = () => {
  // Removed marketing-style features grid per assignment requirements
  const highlights = [
    { label: "Fast", value: "< 5s processing" },
    { label: "Accurate", value: "99.9% parsing" },
    { label: "Secure", value: "AES-256 at rest" },
  ];

  const stats = [
    { label: "Reports Processed", value: "1,000+" },
    { label: "Active Users", value: "500+" },
    { label: "Success Rate", value: "99.9%" },
    { label: "Processing Time", value: "< 5s" },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          CreditSea
          <span className="block text-indigo-600">XML Processing</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Process and analyze Experian credit pull XML files with our advanced
          MERN stack application. Upload, parse, and view comprehensive credit
          reports in seconds.
        </p>
        <div className="flex text-white flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/upload"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
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
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Compact Highlights (replacing removed marketing section) */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {highlights.map((h, idx) => (
            <div key={idx} className="text-center">
              <div className="text-sm uppercase tracking-wide text-gray-600">
                {h.label}
              </div>
              <div className="text-xl font-semibold text-gray-900">
                {h.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload XML
            </h3>
            <p className="text-gray-600">
              Upload your Experian credit pull XML file using our secure upload
              interface.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Process & Parse
            </h3>
            <p className="text-gray-600">
              Our system automatically parses the XML and extracts all credit
              information.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              View Reports
            </h3>
            <p className="text-gray-600">
              Access comprehensive credit reports with detailed analysis and
              insights.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 rounded-lg p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8 opacity-90">
          Upload your first XML credit report and experience the power of
          CreditSea.
        </p>
        <Link
          to="/upload"
          className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 transition-colors"
        >
          <Upload className="h-5 w-5 mr-2" />
          Start Processing
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
