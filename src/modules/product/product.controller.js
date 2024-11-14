const { PrismaClient } = require('@prisma/client');
const { catchError } = require('../../middlewares/catchError');
const { v4: uuidv4 } = require('uuid');
const path = require("path")
const fs = require("fs")
const sharp = require("sharp")
const apiError = require('../../utils/apiError');
const ApiFeatures = require('../../utils/apiFeatures');


const prisma = new PrismaClient();
const addProduct = catchError(async (req, res, next) => {
    // Initialize an object to store the data to be saved
    const newDocumentData = { ...req.body };

    if (req.body.categoryId) {
        newDocumentData.categoryId = parseInt(req.body.categoryId, 10);
    }

    if (req.body.subCategoryId) {
        newDocumentData.subCategoryId = parseInt(req.body.subCategoryId, 10);
    }

    if (req.file) {
        let cleanedFilename = req.file.originalname
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_.]/g, ''); // Clean the filename

        const resizedFilename = uuidv4() + encodeURIComponent(cleanedFilename);
        const imagePath = path.join('uploads/', resizedFilename);

        // Resize and save the image
        await sharp(req.file.buffer)
            .toFile(imagePath);

        newDocumentData.image = resizedFilename; // Assign to the data object
    }
    let product = await prisma.product.create({
        data: newDocumentData,
    });
    res.json(product);
});

const getAllProduct = catchError(async (req, res, next) => {
    let apiFeatures = new ApiFeatures(prisma.product, { ...req.query })
        .filter()
        .sort()
        .search("product")
        .limitedFields();

    // Get the count for pagination
    const countDocuments = await prisma.product.count({
        where: { ...apiFeatures.prismaQuery.where }, // Include the where conditions
    });

    await apiFeatures.paginateWithCount(countDocuments); // Call paginate after getting the count

    // Execute the query for the documents
    const products = await apiFeatures.exec("product");

    // Create response object
    const response = {
        paginationResult: apiFeatures.paginationResult,
        products: products.result.map(product => {
            product.image = process.env.MEDIA_BASE_URL + product.image; // Update imgCover URL

            return {
                ...product,
            };
        }),

    };

    res.json(response);
});

const getProduct = catchError(async (req, res, next) => {
    let { id } = req.params;
    id = parseInt(id, 10)
    let product = await prisma.product.findUnique({
        where: { id },
        include: { category: true, subCategory: true }
    })
    product.image = process.env.MEDIA_BASE_URL + product.image; // Update imgCover URL
    !product && next(new apiError("product not found", 404));
    product && res.json(product);
})

const updateProduct = catchError(async (req, res, next) => {
    let { id } = req.params;
    id = parseInt(id, 10)
    if (req.body.categoryId) {
        req.body.categoryId = parseInt(req.body.categoryId, 10)
    }
    if (req.body.subCategoryId) {
        req.body.subCategoryId = parseInt(req.body.subCategoryId, 10)
    }
    // Define a helper function to delete a file
    const deleteFile = (filePath) => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Delete the file
        }
    };


    let product = await prisma.product.findUnique({
        where: { id }
    })



    if (product) {
        // Process single image
        if (req.file) {
            let cleanedFilename = req.file.originalname
                .replace(/\s+/g, '_')
                .replace(/[^a-zA-Z0-9_.]/g, '');
            const resizedFilename = uuidv4() + encodeURIComponent(cleanedFilename);
            const imagePath = path.join('uploads/', resizedFilename);

            await sharp(req.file.buffer)
                .toFile(imagePath);

            // Delete the old image if it exists
            if (product.image) {
                deleteFile(path.join('uploads/', product.image));
            }
            req.body.image = resizedFilename; // Set the new image filename
        }
        await prisma.product.update({
            where: { id },
            data: {
                ...req.body,
            }
        });
        return res.json(product)
    }
    next(new apiError("not product found"))
})

const deleteProduct = catchError(async (req, res, next) => {
    let { id } = req.params;
    id = parseInt(id, 10);
    // Define a helper function to delete a file
    const deleteFile = (filePath) => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Delete the file
        }
    };
    let product = await prisma.product.findUnique({
        where: { id },
    });
    // Delete the old imgCover if it exists
    if (product.image) {
        deleteFile(path.join('uploads/', product.image));
    }

    if (product) {
        await prisma.product.delete({
            where: { id },
        });
        return res.json(product);
    }
    next(new apiError("not product found"))

})

module.exports = {
    addProduct,
    getAllProduct,
    getProduct,
    updateProduct,
    deleteProduct
}