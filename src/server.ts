import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';

import ConvertToImage from './routes/convertToImage';
import ConvertToHtml from './routes/convertToHtml';
import ConvertToText from './routes/convertToText';

const PORT = process.env.PORT || 8000;

const server = express();

server.use(morgan('dev'));
server.use(cors());

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(express.static(path.join(__dirname, '../public')));

console.log('Dir: ', path.join(__dirname, '../public'));

server.use('/api/convert-to-text', ConvertToText);
server.use('/api/convert-to-html', ConvertToHtml);
server.use('/api/convert-to-image', ConvertToImage);

server.listen(PORT, () =>
  console.log(`Server running on: http://localhost:${PORT}`)
);

export default server;
