# 诗词赏析平台

一个基于 Vue 3 + TypeScript + Supabase 的现代化诗词赏析应用，提供智能搜索、多维度解析和个性化学习体验。

## 项目特色

- 🎯 **智能搜索**: 支持诗词标题、作者、诗句片段的模糊搜索
- 📚 **专业赏析**: 提供创作背景、逐句解析、艺术特色等多维度内容
- 🔍 **关键词注解**: 点击关键词查看详细解释和出处
- ❤️ **个性化收藏**: 支持收藏喜欢的诗词并添加个人笔记
- 📱 **响应式设计**: 完美适配桌面端和移动端
- 🎨 **优雅界面**: 国风设计风格，提供良好的阅读体验

## 技术栈

### 前端技术
- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 下一代前端构建工具
- **Pinia** - Vue 状态管理库
- **Vue Router** - Vue 官方路由
- **Element Plus** - 企业级 UI 组件库
- **Sass/SCSS** - CSS 预处理器

### 后端服务
- **Supabase** - 开源 Firebase 替代品
- **PostgreSQL** - 关系型数据库
- **REST API** - 标准的 RESTful 接口

## 项目结构

```
src/
├── api/           # API 接口封装
├── components/     # 可复用组件
├── composables/    # 组合式函数
├── config/         # 配置文件
├── router/         # 路由配置
├── stores/         # 状态管理
├── styles/         # 样式文件
├── types/          # 类型定义
├── utils/          # 工具函数
└── views/          # 页面组件
```

## 快速开始

### 环境要求

- Node.js 16.0+
- npm 7.0+ 或 yarn 1.22+

### 安装依赖

```bash
npm install
```

### 环境配置

1. 复制环境变量文件：
```bash
cp .env.example .env
```

2. 配置 Supabase 信息：
```bash
# .env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

### 代码格式化

```bash
npm run format
```

## 功能模块

### 1. 首页 (/)
- 热门诗词推荐
- 智能搜索入口
- 导航菜单

### 2. 搜索页面 (/search)
- 实时搜索建议
- 搜索结果展示
- 热门搜索标签

### 3. 诗词详情 (/poem/:id)
- 原文与译文展示
- 创作背景介绍
- 逐句解析赏析
- 艺术特色分析
- 关键词注解功能

### 4. 收藏页面 (/favorites)
- 收藏列表管理
- 快速查看功能
- 批量移除操作

## API 接口

### 诗词相关
- `poemApi.searchPoems(keyword: string)` - 搜索诗词
- `poemApi.getPoemDetail(poemId: string)` - 获取诗词详情
- `poemApi.getPopularPoems()` - 获取热门诗词

### 用户相关
- `userApi.getUserFavorites(userId: string)` - 获取用户收藏
- `userApi.addFavorite(userId, poemId)` - 添加收藏
- `userApi.removeFavorite(favoriteId)` - 移除收藏
- `userApi.checkFavorite(userId, poemId)` - 检查收藏状态

## 数据库设计

### 主要数据表
- `poems` - 诗词基本信息
- `poem_authors` - 作者信息
- `poem_analysis` - 诗词赏析内容
- `user_favorites` - 用户收藏关系

### 表结构示例

```sql
-- 诗词表
CREATE TABLE poems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  author_id UUID REFERENCES poem_authors(id),
  dynasty VARCHAR,
  content TEXT NOT NULL,
  translation TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 作者表
CREATE TABLE poem_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  biography TEXT,
  dynasty VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 开发规范

### 代码规范
- 使用 ESLint + Prettier 统一代码风格
- 遵循 Vue 3 Composition API 最佳实践
- 使用 TypeScript 进行类型检查
- 组件采用单文件组件 (SFC) 格式

### 提交规范
使用 Conventional Commits 格式：
- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具变动

## 部署指南

### Vercel 部署
1. Fork 项目到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署完成

### Netlify 部署
1. 构建项目：`npm run build`
2. 上传 dist 目录到 Netlify
3. 配置重定向规则

## 贡献指南

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'feat: Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件到项目维护者

---

**享受诗词之美，感受传统文化魅力！** 📚✨