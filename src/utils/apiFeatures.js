class ApiFeatures {
  constructor(prismaModel, searchQuery) {
    this.prismaModel = prismaModel;
    this.searchQuery = searchQuery;
    this.prismaQuery = { where: {} };
  }

  filter() {
    let filterObj = { ...this.searchQuery };
    let excludedFields = ["page", "sort", "limit", "fields", "keyword"];
    excludedFields.forEach((val) => {
      delete filterObj[val];
    });


    // Add `categoryId` to the query if it's provided in the search query
    if (filterObj.categoryId) {
      this.prismaQuery.where.categoryId = parseInt(filterObj.categoryId, 10);
    }

    // Merge remaining filters
    this.prismaQuery.where = { ...this.prismaQuery.where, ...filterObj };
    return this;
  }

  sort() {
    const sortBy = this.searchQuery.sort
      ? this.searchQuery.sort.split(",").reduce((acc, field) => {
        const [key, order] = field.split(":");
        acc[key] = order === "desc" ? "desc" : "asc";
        return acc;
      }, {})
      : { createdAt: 'asc' };
    this.prismaQuery.orderBy = sortBy;
    return this;
  }

  limitedFields() {
    if (this.searchQuery.fields) {
      const fields = this.searchQuery.fields.split(",").map(field => field.trim());
      this.prismaQuery.select = fields.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {});
    } else {
      delete this.prismaQuery.select;
    }
    return this;
  }

  search(modelName) {
    if (this.searchQuery.keyword) {
      const keyword = this.searchQuery.keyword.toLowerCase();
      if (modelName === "product") {
        this.prismaQuery.where = {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        };
      } else {
        this.prismaQuery.where = {
          ...this.prismaQuery.where,
          name: { contains: keyword, mode: 'insensitive' },
        };
      }
    }
    return this;
  }

  async paginateWithCount(countDocuments) {
    const page = this.searchQuery.page * 1 || 1;
    const limit = this.searchQuery.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    this.paginationResult = {
      currentPage: page,
      limit,
      numberOfPages: Math.ceil(countDocuments / limit),
    };

    if (endIndex < countDocuments) {
      this.paginationResult.next = page + 1;
    }
    if (skip > 0) {
      this.paginationResult.prev = page - 1;
    }

    this.prismaQuery.skip = skip;
    this.prismaQuery.take = limit;

    return this;
  }

  async exec(modelName) {
    if (!this.prismaQuery.select) {
      delete this.prismaQuery.select;
    }

    // Adjust where conditions based on the model
    if (modelName === "product") {
      this.prismaQuery.include = {
        category: true,
        subCategory: true
      };
    } else if (modelName === "subCategory") {
      this.prismaQuery.include = {
        parent: true,
      }
    }

    const result = await this.prismaModel.findMany({
      ...this.prismaQuery,
    });

    return {
      result,
      pagination: this.paginationResult,
    };
  }
}

module.exports = ApiFeatures;
