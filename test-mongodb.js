// MongoDB连接测试脚本
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/my-app';

async function testConnection() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ MongoDB 连接成功！');

    const db = client.db();

    // 测试创建用户
    const testUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword123',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(testUser);
    console.log('✅ 测试用户创建成功，ID:', result.insertedId);

    // 测试查询用户
    const foundUser = await db.collection('users').findOne({ email: 'test@example.com' });
    console.log('✅ 用户查询成功:', foundUser.username);

    // 清理测试数据
    await db.collection('users').deleteOne({ _id: result.insertedId });
    console.log('✅ 测试数据清理完成');

  } catch (error) {
    console.error('❌ MongoDB 连接或操作失败:', error.message);
  } finally {
    await client.close();
    console.log('🔌 MongoDB 连接已关闭');
  }
}

testConnection();