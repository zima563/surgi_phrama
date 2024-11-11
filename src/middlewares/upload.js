const multer = require('multer');

// Setup multer to store files in memory
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

exports.uploadSingleFile = (fieldname) => upload.single(fieldname);
exports.uploadArrayOfFiles = (fieldname) => upload.array(fieldname, 10);
exports.uploadFieldsOfFiles = (fields) => upload.fields(fields);
