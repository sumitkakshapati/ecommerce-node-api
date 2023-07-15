import multer from 'multer';

const storage = multer.memoryStorage();

export default multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 1 MB (max file size)
  },
});
