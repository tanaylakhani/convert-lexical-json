import express from 'express';
import { ConvertToHtml } from '../controllers/convertToHtml';

const router = express.Router();

router.post('/', ConvertToHtml);

export = router;
