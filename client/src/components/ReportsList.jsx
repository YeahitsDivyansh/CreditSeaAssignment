import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Trash2,
  Calendar,
  User,
  CreditCard,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { creditReportsAPI } from "../services/api";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";

const ReportsList = () => {
  const {
    reports,
    pagination,
    loading,
    setReports,
    setLoading,
    setError,
    deleteReport,
  } = useApp();
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchReports();
  }, [sortBy, sortOrder]);

  const fetchReports = async (page = 1) => {
    setLoading(true);
    try {
      const response = await creditReportsAPI.getAllReports({
        page,
        limit: 10,
        sortBy,
        sortOrder,
      });

      if (response.success) {
        setReports(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      setError("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reportId, pan) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the credit report for PAN: ${pan}?`
      )
    ) {
      return;
    }

    try {
      const response = await creditReportsAPI.deleteReport(reportId);
      if (response.success) {
        deleteReport(reportId);
        toast.success("Report deleted successfully");
      } else {
        toast.error(response.message || "Failed to delete report");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCreditScoreColor = (score) => {
    if (score >= 750) return "text-green-600 bg-green-100";
    if (score >= 650) return "text-yellow-600 bg-yellow-100";
    if (score >= 550) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getCreditScoreLabel = (score) => {
    if (score >= 750) return "Excellent";
    if (score >= 650) return "Good";
    if (score >= 550) return "Fair";
    return "Poor";
  };

  if (loading && reports.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading credit reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Credit Reports</h1>
          <p className="text-gray-600 mt-1">
            {pagination.totalCount} report
            {pagination.totalCount !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="createdAt">Date Created</option>
              <option value="reportDate">Report Date</option>
              <option value="creditScore">Credit Score</option>
            </select>
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
          >
            <TrendingUp
              className={`h-4 w-4 ${sortOrder === "desc" ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      {reports.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reports found
          </h3>
          <p className="text-gray-600 mb-4">
            Upload an XML file to get started
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Upload XML File
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {report.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-mono">
                      PAN: {report.pan}
                    </p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getCreditScoreColor(
                      report.creditScore
                    )}`}
                  >
                    {report.creditScore}
                  </div>
                </div>

                {/* Credit Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Credit Score
                    </span>
                    <span className="text-sm text-gray-600">
                      {getCreditScoreLabel(report.creditScore)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        report.creditScore >= 750
                          ? "bg-green-500"
                          : report.creditScore >= 650
                          ? "bg-yellow-500"
                          : report.creditScore >= 550
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${(report.creditScore / 900) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {report.reportSummary?.totalAccounts || 0}
                    </div>
                    <div className="text-xs text-gray-600">Total Accounts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {report.reportSummary?.activeAccounts || 0}
                    </div>
                    <div className="text-xs text-gray-600">Active Accounts</div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <User className="h-4 w-4 mr-2" />
                  <span>{report.mobilePhone}</span>
                </div>

                {/* Date */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(report.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    to={`/reports/${report._id}`}
                    className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDelete(report._id, report.pan)}
                    className="px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
            {Math.min(
              pagination.currentPage * pagination.limit,
              pagination.totalCount
            )}{" "}
            of {pagination.totalCount} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => fetchReports(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => fetchReports(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsList;
