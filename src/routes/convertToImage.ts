import express from 'express';
import { ConvertToImage } from '../controllers/convertToImage';

const router = express.Router();
router.post('/', ConvertToImage);

export = router;
