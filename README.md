# 诗词赏析平台

基于 Vue 3 + TypeScript + Supabase 的现代化诗词赏析应用。

## 功能特性

- 📚 **丰富的诗词库** - 包含唐诗宋词等经典作品
- 🔍 **智能搜索** - 支持按标题、作者、内容搜索
- ❤️ **个人收藏** - 用户可收藏喜欢的诗词
- 📖 **详细赏析** - 提供创作背景、逐句解析、艺术特色
- 🎨 **现代化UI** - 基于 Element Plus 的优雅界面
- 🔒 **用户认证** - 完整的注册登录系统
- 📱 **响应式设计** - 支持移动端和桌面端

## 技术栈

### 前端
- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全的JavaScript
- **Pinia** - 状态管理库
- **Vue Router** - 路由管理
- **Element Plus** - UI组件库
- **Vite** - 构建工具

### 后端
- **Supabase** - 开源BaaS平台
- **PostgreSQL** - 关系型数据库
- **Row Level Security** - 行级安全策略

## 项目结构

```
src/
├── api/           # API接口
├── components/    # 通用组件
├── config/        # 配置文件
├── router/        # 路由配置
├── stores/        # 状态管理
├── styles/        # 样式文件
└── views/         # 页面组件
```

## 快速开始

### 环境要求

- Node.js 16+ 
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 环境配置

复制环境变量文件并配置Supabase连接信息：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置您的Supabase项目信息：

```env
VITE_SUPABASE_URL=您的Supabase项目URL
VITE_SUPABASE_ANON_KEY=您的Supabase匿名密钥
```

### 开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看应用。

### 构建生产版本

```bash
npm run build
```

## 数据库设置

### 1. 创建Supabase项目

1. 访问 [Supabase官网](https://supabase.com) 注册账号
2. 创建新项目
3. 获取项目URL和匿名密钥

### 2. 执行数据库迁移

在Supabase SQL编辑器中执行以下步骤：

1. 执行 `supabase/migrations/001_create_poem_tables.sql` 创建表结构
2. 执行 `supabase/migrations/002_insert_sample_data.sql` 插入示例数据

### 3. 配置认证

在Supabase仪表板中：
1. 启用邮箱认证
2. 配置重定向URL
3. 设置行级安全策略

## API接口

### 诗词相关
- `GET /poems` - 获取诗词列表
- `GET /poems/:id` - 获取诗词详情
- `POST /search` - 搜索诗词
- `GET /popular` - 获取热门诗词

### 用户相关
- `POST /auth/signup` - 用户注册
- `POST /auth/signin` - 用户登录
- `GET /favorites` - 获取用户收藏
- `POST /favorites` - 添加收藏
- `DELETE /favorites/:id` - 移除收藏

## 部署

### Vercel部署

1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. 配置环境变量
4. 部署完成

### 其他平台

项目支持部署到：
- Netlify
- GitHub Pages
- 阿里云/腾讯云等云平台

## 开发指南

### 代码规范

- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化
- 遵循Vue 3组合式API规范

### 提交规范

使用约定式提交格式：

```bash
feat: 添加新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
```

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：

- 邮箱：example@email.com
- GitHub Issues

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 基础诗词浏览功能
- 用户认证系统
- 响应式设计