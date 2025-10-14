// Temporary in-memory storage for testing when MongoDB is not available
class InMemoryCreditReport {
  constructor() {
    this.reports = new Map();
    this.nextId = 1;
  }

  async save(data) {
    const id = this.nextId++;
    const report = {
      _id: id.toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.reports.set(id.toString(), report);
    return report;
  }

  async findById(id) {
    // Convert to string to handle both numeric and string IDs
    const stringId = id.toString();
    return this.reports.get(stringId) || null;
  }

  async find() {
    return Array.from(this.reports.values());
  }

  async countDocuments() {
    return this.reports.size;
  }

  async findByPAN(pan) {
    return Array.from(this.reports.values()).filter(
      (report) => report.pan && report.pan.toUpperCase() === pan.toUpperCase()
    );
  }

  async findLatestByPAN(pan) {
    const reports = await this.findByPAN(pan);
    return reports.length > 0 ? reports[reports.length - 1] : null;
  }

  async findByIdAndDelete(id) {
    // Convert to string to handle both numeric and string IDs
    const stringId = id.toString();
    const report = this.reports.get(stringId);
    if (report) {
      this.reports.delete(stringId);
      return report;
    }
    return null;
  }
}

// Create singleton instance
const inMemoryStore = new InMemoryCreditReport();

export default inMemoryStore;
