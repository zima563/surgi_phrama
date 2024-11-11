const { PrismaClient } = require('@prisma/client');
const { catchError } = require('../../middlewares/catchError');

const prisma = new PrismaClient();
const addMessage = catchError(async (req, res, next) => {
    let message = await prisma.message.create({
        data: {
            ...req.body
        }
    });
    res.json(message);
});

const getAllMessage = catchError(async (req, res, next) => {
    let messages = await prisma.message.findMany();
    res.json(messages)
});

module.exports = {
    addMessage,
    getAllMessage
}