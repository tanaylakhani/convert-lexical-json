import express from 'express';
import { ConvertToText } from '../controllers/convertToText';

const router = express.Router();
router.post('/', ConvertToText);

export = router;
