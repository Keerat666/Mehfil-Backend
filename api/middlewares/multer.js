const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/")
  },
  fileFilter: (req, file, cb) => {
    console.log(file)
    const fileTypes = /jpeg|jpg|png|mp4|flv/
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    )

    if (extName) {
      return cb(null, true)
    }
    cb("Error: Filetype not supported")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`)
  }
})

const upload = multer({ storage: storage })

module.exports = upload
