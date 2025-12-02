// 1. 引入依赖
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

// 2. 初始化Express实例
const app = express();
const PORT = 3001; // 后端服务端口（需与前端API_BASE_URL对应）

// 3. 配置中间件（解析JSON请求、允许跨域）
app.use(express.json());
app.use(cors()); // 允许前端跨域请求


// 4. 配置MySQL连接池（核心：连接到game_share_forum数据库）
const dbPool = mysql.createPool({
  host: 'localhost',        // 本地MySQL地址（默认）
  user: 'root',             // 你的MySQL用户名（默认是root）
  password: 'L3139404875a', // 替换为你安装MySQL时设置的密码（若为空则填''）
  database: 'game_share_forum', // 刚创建的数据库名
  charset: 'utf8mb4',       // 匹配数据库字符集（支持多语言）
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


// 5. 测试数据库连接（启动时执行）
async function testDbConnection() {
  try {
    const connection = await dbPool.getConnection();
    console.log('✅ MySQL 连接成功！已连接到 game_share_forum 数据库');
    connection.release(); // 释放连接回池
  } catch (error) {
    console.error('❌ MySQL 连接失败：', error.message);
    process.exit(1); // 连接失败则退出服务
  }
}


// 6. 编写API接口（对应前端的发布/获取消息）
// 接口1：发布游戏分享（POST请求，对应前端提交表单）
app.post('/api/message', async (req, res) => {
  try {
    const { username, message, poster_id } = req.body;

    // 验证必填字段
    if (!message) {
      return res.status(400).json({ error: '分享内容不能为空' });
    }

    // 执行SQL插入（插入到messages表）
    const [result] = await dbPool.execute(
      'INSERT INTO messages (username, message, poster_id) VALUES (?, ?, ?)',
      [username, message, poster_id]
    );

    res.status(200).json({ success: true, messageId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: '发布失败：' + error.message });
  }
});


// 接口2：获取所有游戏分享（GET请求，对应前端查看留言）
app.get('/api/messages', async (req, res) => {
  try {
    // 执行SQL查询（按时间倒序，最新的在前面）
    const [rows] = await dbPool.execute(
      'SELECT * FROM messages ORDER BY created_at DESC'
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: '获取分享失败：' + error.message });
  }
});


// 7. 启动后端服务
app.listen(PORT, async () => {
  await testDbConnection(); // 启动时先测试数据库连接
  console.log(`🚀 Node.js 后端服务已启动：http://localhost:${PORT}`);
});