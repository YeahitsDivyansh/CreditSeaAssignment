import xml2js from "xml2js";
import winston from "winston";

// Configure logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "xml-parser" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

class XMLParser {
  constructor() {
    this.parser = new xml2js.Parser({
      explicitArray: false,
      mergeAttrs: true,
      trim: true,
      normalize: true,
      normalizeTags: true,
      explicitRoot: false,
    });
  }

  /**
   * Parse XML buffer and extract credit report data
   * @param {Buffer} xmlBuffer - XML file buffer
   * @param {string} fileName - Original file name
   * @returns {Object} Parsed credit report data
   */
  async parseCreditReport(xmlBuffer, fileName) {
    try {
      const xmlString = xmlBuffer.toString("utf-8");
      const result = await this.parser.parseStringPromise(xmlString);

      logger.info(`Successfully parsed XML file: ${fileName}`);

      // Extract data based on XML structure
      const creditData = this.extractCreditData(result);

      return {
        success: true,
        data: creditData,
        fileName,
      };
    } catch (error) {
      logger.error(`Error parsing XML file ${fileName}:`, error);
      return {
        success: false,
        error: error.message,
        fileName,
      };
    }
  }

  /**
   * Extract credit data from parsed XML
   * @param {Object} parsedXml - Parsed XML object
   * @returns {Object} Extracted credit data
   */
  extractCreditData(parsedXml) {
    try {
      // Extract data based on the actual XML structure
      const data = {
        // Basic Details
        name:
          this.extractValue(parsedXml, ["personalinfo", "name"]) ||
          this.extractValue(parsedXml, ["applicant", "name"]) ||
          this.extractValue(parsedXml, ["name"]),

        mobilePhone:
          this.extractValue(parsedXml, ["personalinfo", "mobile"]) ||
          this.extractValue(parsedXml, ["applicant", "mobile"]) ||
          this.extractValue(parsedXml, ["mobile"]),

        pan:
          this.extractValue(parsedXml, ["personalinfo", "pan"]) ||
          this.extractValue(parsedXml, ["applicant", "pan"]) ||
          this.extractValue(parsedXml, ["pan"]),

        creditScore:
          this.extractNumericValue(parsedXml, ["creditscore"]) ||
          this.extractNumericValue(parsedXml, ["score"]) ||
          this.extractNumericValue(parsedXml, ["credit", "score"]),

        // Report Summary
        reportSummary: this.extractReportSummary(parsedXml),

        // Credit Accounts
        creditAccounts: this.extractCreditAccounts(parsedXml),

        // Addresses
        addresses: this.extractAddresses(parsedXml),
      };

      // Validate required fields
      this.validateRequiredFields(data);

      return data;
    } catch (error) {
      logger.error("Error extracting credit data:", error);
      throw new Error(`Data extraction failed: ${error.message}`);
    }
  }

  /**
   * Extract report summary data
   */
  extractReportSummary(parsedXml) {
    return {
      totalAccounts:
        this.extractNumericValue(parsedXml, [
          "reportsummary",
          "totalaccounts",
        ]) ||
        this.extractNumericValue(parsedXml, ["summary", "totalaccounts"]) ||
        this.extractNumericValue(parsedXml, ["totalaccounts"]) ||
        0,

      activeAccounts:
        this.extractNumericValue(parsedXml, [
          "reportsummary",
          "activeaccounts",
        ]) ||
        this.extractNumericValue(parsedXml, ["summary", "activeaccounts"]) ||
        this.extractNumericValue(parsedXml, ["activeaccounts"]) ||
        0,

      closedAccounts:
        this.extractNumericValue(parsedXml, [
          "reportsummary",
          "closedaccounts",
        ]) ||
        this.extractNumericValue(parsedXml, ["summary", "closedaccounts"]) ||
        this.extractNumericValue(parsedXml, ["closedaccounts"]) ||
        0,

      currentBalanceAmount:
        this.extractNumericValue(parsedXml, [
          "reportsummary",
          "currentbalanceamount",
        ]) ||
        this.extractNumericValue(parsedXml, ["summary", "currentbalance"]) ||
        this.extractNumericValue(parsedXml, ["currentbalance"]) ||
        0,

      securedAccountsAmount:
        this.extractNumericValue(parsedXml, [
          "reportsummary",
          "securedaccountsamount",
        ]) ||
        this.extractNumericValue(parsedXml, ["summary", "securedamount"]) ||
        this.extractNumericValue(parsedXml, ["securedamount"]) ||
        0,

      unsecuredAccountsAmount:
        this.extractNumericValue(parsedXml, [
          "reportsummary",
          "unsecuredaccountsamount",
        ]) ||
        this.extractNumericValue(parsedXml, ["summary", "unsecuredamount"]) ||
        this.extractNumericValue(parsedXml, ["unsecuredamount"]) ||
        0,

      last7DaysCreditEnquiries:
        this.extractNumericValue(parsedXml, [
          "reportsummary",
          "recentenquiries",
        ]) ||
        this.extractNumericValue(parsedXml, ["summary", "recentenquiries"]) ||
        this.extractNumericValue(parsedXml, ["recentenquiries"]) ||
        0,
    };
  }

  /**
   * Extract credit accounts data
   */
  extractCreditAccounts(parsedXml) {
    const accounts = [];

    // Try different possible paths for accounts
    const accountPaths = [
      ["creditaccounts", "account"],
      ["accounts", "account"],
      ["creditaccounts"],
      ["accounts"],
    ];

    for (const path of accountPaths) {
      const accountData = this.extractValue(parsedXml, path);
      if (accountData) {
        const accountArray = Array.isArray(accountData)
          ? accountData
          : [accountData];

        accountArray.forEach((account) => {
          if (account && typeof account === "object") {
            accounts.push({
              accountNumber:
                account.accountnumber ||
                account.account_number ||
                account.number ||
                "N/A",
              accountType: this.mapAccountType(
                account.type || account.accounttype || "other"
              ),
              bankName:
                account.bankname ||
                account.bank_name ||
                account.bank ||
                "Unknown Bank",
              currentBalance:
                this.extractNumericValue(account, ["currentbalance"]) || 0,
              amountOverdue:
                this.extractNumericValue(account, ["amountoverdue"]) || 0,
              creditLimit:
                this.extractNumericValue(account, ["creditlimit"]) || null,
              accountStatus: this.mapAccountStatus(account.status || "active"),
              openedDate: this.parseDate(
                account.openeddate || account.opened_date
              ),
              lastPaymentDate: this.parseDate(
                account.lastpaymentdate || account.last_payment
              ),
              emiAmount:
                this.extractNumericValue(account, ["emiamount"]) || null,
            });
          }
        });
        break; // Use first successful path
      }
    }

    return accounts;
  }

  /**
   * Extract addresses data
   */
  extractAddresses(parsedXml) {
    const addresses = [];

    const addressPaths = [
      ["addresses", "address"],
      ["address"],
      ["personalinfo", "addresses", "address"],
    ];

    for (const path of addressPaths) {
      const addressData = this.extractValue(parsedXml, path);
      if (addressData) {
        const addressArray = Array.isArray(addressData)
          ? addressData
          : [addressData];

        addressArray.forEach((addr) => {
          if (addr && typeof addr === "object") {
            addresses.push({
              type: addr.type || "current",
              address: addr.address || addr.fulladdress || "N/A",
              city: addr.city || "",
              state: addr.state || "",
              pincode: addr.pincode || addr.pin || "",
              country: addr.country || "India",
            });
          }
        });
        break;
      }
    }

    return addresses;
  }

  /**
   * Extract value from nested object using path array
   */
  extractValue(obj, path) {
    if (!obj || !path || path.length === 0) return null;

    let current = obj;
    for (const key of path) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return null;
      }
    }
    return current;
  }

  /**
   * Extract numeric value from nested object
   */
  extractNumericValue(obj, path) {
    const value = this.extractValue(obj, path);
    if (value === null || value === undefined) return 0;

    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  }

  /**
   * Parse date string
   */
  parseDate(dateString) {
    if (!dateString) return null;

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  /**
   * Map account type to standardized values
   */
  mapAccountType(type) {
    if (!type) return "other";

    const typeStr = type.toLowerCase();
    if (typeStr.includes("credit") || typeStr.includes("card"))
      return "credit_card";
    if (typeStr.includes("personal")) return "personal_loan";
    if (typeStr.includes("home") || typeStr.includes("housing"))
      return "home_loan";
    if (typeStr.includes("auto") || typeStr.includes("vehicle"))
      return "auto_loan";

    return "other";
  }

  /**
   * Map account status to standardized values
   */
  mapAccountStatus(status) {
    if (!status) return "active";

    const statusStr = status.toLowerCase();
    if (statusStr.includes("closed") || statusStr.includes("terminated"))
      return "closed";
    if (statusStr.includes("suspended")) return "suspended";
    if (statusStr.includes("written") || statusStr.includes("off"))
      return "written_off";

    return "active";
  }

  /**
   * Validate required fields
   */
  validateRequiredFields(data) {
    const requiredFields = ["name", "mobilePhone", "pan", "creditScore"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Validate PAN format
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(data.pan)) {
      throw new Error("Invalid PAN format");
    }

    // Validate credit score range
    if (data.creditScore < 300 || data.creditScore > 900) {
      throw new Error("Credit score must be between 300 and 900");
    }
  }
}

export default XMLParser;
