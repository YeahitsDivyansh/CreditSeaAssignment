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
    return this.reports.get(id) || null;
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
    const report = this.reports.get(id);
    if (report) {
      this.reports.delete(id);
      return report;
    }
    return null;
  }
}

// Create singleton instance
const inMemoryStore = new InMemoryCreditReport();

export default inMemoryStore;
