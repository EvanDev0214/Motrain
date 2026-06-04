import 'dotenv/config';
import app from '@/app';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

  console.log(`Server is running at ${baseUrl}`);
});
