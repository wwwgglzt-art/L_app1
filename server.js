// 1. 引入依赖（删除fs，无需读取证书）
import express， { json } from 'express';
import { createPool } from 'mysql2/promise';
import cors from 'cors';

// 2. 初始化Express实例（兼容Render自动分配端口）
const app = express();
const PORT = process.env.PORT || 4000; // 关键：优先使用环境变量端口

// 3. 配置中间件
app.use(json());
app.use(cors());

// 4. 配置MySQL连接池（修复TiDB端口和SSL）
const dbPool = createPool({
  host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
  user: '3MPz42NYYgcq8Mp.root',
  password: 'ZuxPVHFMqTjj9JuR',
  database: 'game_share_forum',
  port: 4000, // 关键：TiDB专用端口
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false // 关键：无证书SSL配置
  }
});

// 5. 测试数据库连接
async function testDbConnection() {
  try {
    const connection = await dbPool.getConnection();
    console.log('✅ TiDB Cloud 连接成功！');
    connection.release();
  } catch (error) {
    console.error('❌ TiDB Cloud 连接失败：', error.message);
    process.exit(1);
  }
}

// 6. API接口（保持不变）
app.post('/api/message', async (req， res) => { /* 原有逻辑 */ });
app.get('/api/messages', async (req, res) => { /* 原有逻辑 */ });

// 7. 启动服务
app.listen(PORT, async () => {
  await testDbConnection();
  console.log(`🚀 后端服务已启动：http://localhost:${PORT}`);
});

