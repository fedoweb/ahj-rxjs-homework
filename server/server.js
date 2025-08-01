const Koa = require('koa');
const Router = require('@koa/router');
const faker = require('faker');
const cors = require('@koa/cors');

const app = new Koa();
const router = new Router();

// Генерация случайного сообщения
function generateMessage() {
  return {
    id: faker.random.uuid(), 
    from: faker.internet.email(),
    subject: faker.lorem.words(),
    body: faker.lorem.paragraphs(),
    received: Date.now() - faker.random.number({ min: 10000, max: 10000000 })
  };
}

router.get('/messages/unread', async (ctx) => {
  // Генерируем случайное количество сообщений (0-5)
  const count = faker.random.number({ min: 0, max: 5 });
  const messages = Array.from({ length: count }, generateMessage);
  
  // Формируем ответ
  ctx.body = {
    status: 'ok',
    timestamp: Date.now(),
    messages
  };
});

// Настройка CORS
app.use(cors({
  origin: ctx => {
    const allowedOrigins = [
      'http://localhost:9000',
      'https://fedoweb.github.io',
      'https://ahj-rxjs-homework-*.vercel.app'
    ];
    
    const requestOrigin = ctx.headers.origin;
    
    // Разрешаем все поддомены Vercel
    if (requestOrigin && requestOrigin.includes('ahj-rxjs-homework-') && 
        requestOrigin.endsWith('.vercel.app')) {
      return requestOrigin;
    }
    
    if (allowedOrigins.includes(requestOrigin)) {
      return requestOrigin;
    }
    
    return allowedOrigins[0]; // Возвращаем первый разрешенный, если не нашли
  },
  allowMethods: ['GET'],
  credentials: true,
  exposeHeaders: ['Content-Length', 'X-Koa-Request-Id'],
  maxAge: 3600
}));

// Подключение роутера
app.use(router.routes());
app.use(router.allowedMethods());

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

// Экспорт для Vercel
module.exports = app.callback();
