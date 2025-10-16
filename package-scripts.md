# 项目脚本说明

## 开发脚本

### `npm run dev`
启动开发服务器，支持热重载
- 端口：5173
- 热重载：启用
- 类型检查：启用

### `npm run build`
构建生产版本
- 输出目录：`dist/`
- 代码压缩：启用
- 类型检查：启用

### `npm run preview`
预览生产构建
- 端口：4173
- 静态文件服务

## 测试脚本

### `npm run test`
运行单元测试
- 测试框架：Vitest
- 覆盖率报告：生成

### `npm run test:ui`
启动测试UI界面
- 可视化测试界面
- 交互式测试运行

## 代码质量脚本

### `npm run lint`
运行ESLint代码检查
- 自动修复：启用（`--fix`）
- 忽略文件：`.gitignore`
- 文件类型：`.vue`, `.js`, `.jsx`, `.cjs`, `.mjs`, `.ts`, `.tsx`, `.cts`, `.mts`

### `npm run format`
使用Prettier格式化代码
- 目标目录：`src/`
- 配置文件：`.prettierrc.json`

## 部署脚本

### `npm run vercel-build`
Vercel构建脚本
- 修复Vite执行权限
- 运行生产构建

## 环境变量配置

### 开发环境 (.env)
```env
VITE_SUPABASE_URL=您的Supabase项目URL
VITE_SUPABASE_ANON_KEY=您的Supabase匿名密钥
VITE_APP_TITLE=诗词赏析平台
VITE_API_BASE_URL=http://localhost:3000/api
```

### 生产环境
在部署平台（Vercel、Netlify等）配置环境变量

## 数据库迁移脚本

### 手动执行迁移
1. 登录Supabase控制台
2. 进入SQL编辑器
3. 按顺序执行迁移文件：
   - `001_create_poem_tables.sql`
   - `002_insert_sample_data.sql`
   - `003_enable_full_text_search.sql`

### 迁移文件说明
- **001**: 创建基础表结构和索引
- **002**: 插入示例数据
- **003**: 启用高级搜索功能

## 故障排除

### 常见问题

1. **构建失败**
   - 检查Node.js版本（需要16+）
   - 清除node_modules并重新安装依赖

2. **Supabase连接失败**
   - 检查环境变量配置
   - 验证Supabase项目状态

3. **类型检查错误**
   - 运行 `npm run lint --fix`
   - 检查TypeScript配置

### 性能优化建议

1. **开发时**
   - 使用 `npm run dev` 获得最佳开发体验
   - 启用热重载提高开发效率

2. **生产构建**
   - 使用 `npm run build` 生成优化版本
   - 启用代码分割和压缩

3. **数据库优化**
   - 定期执行迁移脚本中的索引优化
   - 监控查询性能