const multer = require('multer');

const acceptedType = {'application/pdf': 'pdf'}
const crypto = require('crypto')

const upload = multer({
    storage: multer.diskStorage({
        destination: `${__dirname}../../uploads/`,
        filename: (req, file, callback) => {
            const filename = crypto.pseudoRandomBytes(16).toString("hex")
            const extension = acceptedType[file.mimetype]
            callback(null, `${filename}.${extension}`)
        }
    }),
    fileFilter: (req, file, callback) => {
        if (acceptedType[file.mimetype]) {
            callback(null, true);
        } else {
            //without creating new error and the server will return 500 error
            callback(new Error("Invalid file type"));
        }
    }
        
})
exports.upload = upload