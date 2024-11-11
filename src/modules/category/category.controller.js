const { PrismaClient } = require('@prisma/client');
const { catchError } = require('../../middlewares/catchError');
const apiError = require('../../utils/apiError');
const ApiFeatures = require('../../utils/apiFeatures');

const prisma = new PrismaClient();
const addCategory = catchError(async (req, res, next) => {
    let category = await prisma.category.create({
        data: {
            ...req.body
        }
    });
    res.json(category);
});

const getAllCategory = catchError(async (req, res, next) => {
    let apiFeatures = new ApiFeatures(prisma.category, { ...req.query })
        .filter()
        .sort()
        .search("category")
        .limitedFields();

    // Get the count for pagination
    const countDocuments = await prisma.category.count({
        where: { ...apiFeatures.prismaQuery.where }, // Include the where conditions
    });

    await apiFeatures.paginateWithCount(countDocuments); // Call paginate after getting the count

    // Execute the query for the documents
    const categories = await apiFeatures.exec('category');

    // Create the response object
    const response = {
        paginationResult: apiFeatures.paginationResult, // Include pagination details
        categories: categories.result
    };

    res.json(response);
});

const getCategory = catchError(async (req, res, next) => {
    let { id } = req.params;
    id = parseInt(id, 10)
    let category = await prisma.category.findUnique({
        where: { id }
    })
    !category && next(new apiError("category not found", 404));
    category && res.json(category);
})

const updateCategory = catchError(async (req, res, next) => {
    let { id } = req.params;
    id = parseInt(id, 10);
    let category = await prisma.category.update({
        where: { id },
        data: req.body
    });
    res.json(category)
})

const deleteCategory = catchError(async (req, res, next) => {
    let { id } = req.params;
    id = parseInt(id, 10);
    let category = await prisma.category.findUnique({
        where: { id }
    })
    if (category) {
        await prisma.category.delete({
            where: { id },
        });
        return res.json(category)
    }
    next(new apiError("not category found"))

})

module.exports = {
    addCategory,
    getAllCategory,
    getCategory,
    updateCategory,
    deleteCategory
}