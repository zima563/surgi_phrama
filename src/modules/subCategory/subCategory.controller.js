const { PrismaClient } = require('@prisma/client');
const { catchError } = require('../../middlewares/catchError');
const apiError = require('../../utils/apiError');
const ApiFeatures = require('../../utils/apiFeatures');

const prisma = new PrismaClient();
const addSubCategory = catchError(async (req, res, next) => {

    // Initialize an object to store the data to be saved
    const newDocumentData = { ...req.body };
    // Convert parentId to integer if it exists
    if (req.body.parentId) {
        newDocumentData.parentId = parseInt(req.body.parentId, 10); // Handle invalid value
    }
    let subCategory = await prisma.subCategory.create({
        data: newDocumentData,
    });
    res.json(subCategory);
});

const getAllSubCategory = catchError(async (req, res, next) => {
    if (req.query.parentId) {
        req.query.parentId = parseInt(req.query.parentId, 10)
    }
    let apiFeatures = new ApiFeatures(prisma.subCategory, { ...req.query })
        .filter()
        .sort()
        .search("subCategory")
        .limitedFields();

    // Get the count for pagination
    const countDocuments = await prisma.subCategory.count({
        where: { ...apiFeatures.prismaQuery.where }, // Include the where conditions
    });

    await apiFeatures.paginateWithCount(countDocuments); // Call paginate after getting the count

    // Execute the query for the documents
    const subCategories = await apiFeatures.exec("subCategory");

    // Create the response object
    const response = {
        paginationResult: apiFeatures.paginationResult, // Include pagination details
        subCategories: subCategories.result
    };

    res.json(response);
});

const getSubCategory = catchError(async (req, res, next) => {
    let { id } = req.params;
    id = parseInt(id, 10)
    let subCategory = await prisma.subCategory.findUnique({
        where: { id },
        include: { parent: true }
    })
    !subCategory && next(new apiError("subCategory not found", 404));
    subCategory && res.json(subCategory);
})

const updateSubCategory = catchError(async (req, res, next) => {
    let { id } = req.params;
    id = parseInt(id, 10)
    req.body.parentId = parseInt(req.body.parentId);
    let subCategory = await prisma.subCategory.update({
        where: { parentId: id },
        data: req.body
    });
    res.json(subCategory)
})

const deleteSubCategory = catchError(async (req, res, next) => {
    let { id } = req.params;
    id = parseInt(id, 10);
    let subCategory = await prisma.subCategory.findUnique({
        where: { id },
    });
    if (subCategory) {
        await prisma.subCategory.delete({
            where: { id },
        });
        return res.json(subCategory);
    }
    next(new apiError("not subCategory found"))

})

module.exports = {
    addSubCategory,
    getAllSubCategory,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory
}