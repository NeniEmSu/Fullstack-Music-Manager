const multer = require('multer')

const MIME_TYPPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_')
    const extension = MIME_TYPPES[file.mimetype]
    callback(
      null,
      name + new Date().toISOString().replace(/:/g, '-') + '.' + extension
    )
  }
})

module.exports = multer({
  storage
}).single('image')