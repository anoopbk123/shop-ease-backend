const multer = require('multer')
const path = require('path')
const createMulterInstance = (folderName) => {
	const storage =	multer.diskStorage({
		destination: (req, file, cb)=>{
			cb(null, `public/images/${folderName}`);
		},
		filename:(req, file, cb)=>{
			const originalName = path.parse(file.originalname);
			cb(null, `${originalName.name}_${Date.now()}${originalName.ext}`);
		}
	})
	return multer({storage});
}
module.exports = createMulterInstance;