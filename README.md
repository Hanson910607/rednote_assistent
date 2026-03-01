# RedNote Assistant - 小红书助手

## 项目简介

RedNote Assistant 是一个基于 AI 的小红书内容创作助手，帮助用户快速生成高质量的小红书文案和选题推荐。

## 版本信息

- **版本**: v1.0.0
- **更新日期**: 2024-02-11

## 功能特性

### 1. 文案生成
- 支持 11 种风格（简洁、专业、情感、可爱、奢华、接地气、幽默、闺蜜、种草、反常识、沉浸）
- 支持 12 种内容类型（生活、穿搭美妆、知识科普、产品种草、情感故事、职场成长、娱乐休闲、宠物日记、母婴育儿、运动健身、情感治愈、平替测评）
- 自动生成标题、正文、emoji 和标签
- 提供爆款潜力分析

### 2. 选题推荐
- 支持 10 个领域（美妆、穿搭、美食、旅行、健身、职场、育儿、宠物、生活、健康）
- 自动生成选题评估（用户需求、竞争度、创新度、自我匹配度）
- 提供趋势分析

### 3. 模型供应商支持
- OpenAI（GPT-4、GPT-3.5-turbo、GPT-4o、GPT-4o-mini）
- DeepSeek（DeepSeek-Chat、DeepSeek-Coder）
- Claude（Claude-3-Sonnet、Claude-3-Opus、Claude-3-Haiku、Claude-3.5-Sonnet）
- Anthropic（Claude 系列）
- Gemini（Gemini-Pro、Gemini-1.5-Pro、Gemini-1.5-Flash）
- 智谱AI（GLM-4、GLM-4-Flash、GLM-4-Air、GLM-3-Turbo）
- 硅基流动（DeepSeek-V3、Qwen2.5-7B-Instruct、InternLM2.5-20B-Chat）
- 通义千问（Qwen-Turbo、Qwen-Plus、Qwen-Max、Qwen-LongContext）
- 百川智能（Baichuan2-Turbo、Baichuan2-53B、Baichuan-13B-Chat）
- Moonshot AI（Moonshot-V1-8K、Moonshot-V1-32K、Moonshot-V1-128K）
- Qwen（Qwen-Turbo、Qwen-Plus、Qwen-Max、Qwen-LongContext）
- 自定义供应商

### 4. 安全特性
- API 密钥加密存储（AES-256 + PBKDF2）
- 请求限流（15 分钟内每个 IP 最多 100 个请求）
- 请求超时处理（60 秒）
- 安全头配置（X-Frame-Options、X-Content-Type-Options、X-XSS-Protection、CSP）
- HTTPS 支持

### 5. 性能优化
- 前端路由懒加载
- 代码分割（vendor、element-plus、utils）
- Gzip 压缩
- 静态资源缓存（1 年）
- 响应缓存（1 小时）
- Terser 压缩优化

## 技术栈

### 前端
- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **UI 组件库**: Element Plus
- **HTTP 客户端**: Axios
- **加密**: CryptoJS

### 后端
- **框架**: Express.js
- **安全**: Helmet、CORS、Rate Limit
- **缓存**: NodeCache
- **日志**: Morgan
- **压缩**: Compression

### 部署
- **容器化**: Docker
- **Web 服务器**: Nginx
- **SSL/TLS**: 支持 HTTPS

## 项目结构

```
rednote-assistent/
├── frontend/                 # 前端代码
│   ├── src/
│   │   ├── __tests__/       # 测试文件
│   │   ├── components/      # 组件
│   │   ├── composables/     # 组合式函数
│   │   ├── stores/          # 状态管理
│   │   ├── types/           # 类型定义
│   │   ├── utils/           # 工具函数
│   │   └── views/           # 页面
│   ├── package.json
│   ├── vite.config.ts
│   └── vitest.config.ts
├── server.js                 # 后端服务器
├── package.json
├── Dockerfile                # Docker 配置
├── docker-compose.yml        # Docker Compose 配置
├── nginx.conf                # Nginx 配置（HTTP）
├── nginx-https.conf          # Nginx 配置（HTTPS）
├── DOCKER_ECS_DEPLOY.md      # 部署文档
└── README.md                 # 项目文档
```

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd rednote-assistent
```

### 2. 安装依赖

```bash
npm run install:all
```

### 3. 配置环境变量

创建 `frontend/.env.local` 文件：

```env
VITE_CRYPTO_SECRET=your-secret-key-here
```

### 4. 启动开发服务器

```bash
npm run dev
```

### 5. 访问应用

打开浏览器访问：http://localhost:5173

## 部署

### Docker 部署

```bash
# 构建镜像
npm run docker:build

# 运行容器
npm run docker:run
```

### Docker Compose 部署

```bash
docker-compose up -d --build
```

### 阿里云 ECS 部署

详细部署步骤请查看 [DOCKER_ECS_DEPLOY.md](./DOCKER_ECS_DEPLOY.md)

## 测试

### 运行测试

```bash
cd frontend
npm run test
```

### 测试覆盖率

```bash
npm run test:coverage
```

### 测试 UI

```bash
npm run test:ui
```

## API 文档

### 健康检查

```
GET /api/health
```

**响应**:
```json
{
  "status": "ok",
  "message": "Backend server is running"
}
```

### 文案生成

```
POST /api/copywriter/generate
```

**请求头**:
```
x-llm-settings: {"provider":"deepseek","apiKey":"your-api-key","apiUrl":"https://api.deepseek.com/v1/chat/completions","model":"deepseek-chat"}
```

**请求体**:
```json
{
  "topic": "产品",
  "type": "生活分享",
  "style": "简洁明了",
  "keywords": "关键词"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "titles": ["标题1", "标题2", "标题3", "标题4", "标题5"],
    "content": "正文内容",
    "emojis": ["emoji1", "emoji2", "emoji3"],
    "hashtags": ["标签1", "标签2", "标签3"],
    "analysis": {
      "level": "A",
      "score": 85,
      "advantages": ["优点1", "优点2", "优点3"],
      "disadvantages": ["缺点1", "缺点2"],
      "suggestions": ["建议1", "建议2", "建议3"]
    }
  },
  "cached": false
}
```

### 选题推荐

```
POST /api/topic-selector/generate
```

**请求头**:
```
x-llm-settings: {"provider":"deepseek","apiKey":"your-api-key","apiUrl":"https://api.deepseek.com/v1/chat/completions","model":"deepseek-chat"}
```

**请求体**:
```json
{
  "domain": "beauty"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "topics": [
      {
        "name": "选题名称",
        "type": "选题类型",
        "level": "A",
        "description": "选题描述",
        "evaluation": {
          "userDemand": 85,
          "competition": 70,
          "innovation": 80,
          "selfMatch": 85,
          "total": 80
        }
      }
    ],
    "total": 10,
    "domain": "beauty",
    "trendAnalysis": {
      "currentTrends": ["趋势1", "趋势2", "趋势3"],
      "crossPlatformTrends": ["跨平台趋势1", "跨平台趋势2"],
      "seasonalFactors": ["季节因素1", "季节因素2"],
      "userNeeds": ["用户需求1", "用户需求2"]
    }
  },
  "cached": false
}
```

## 安全建议

1. **API 密钥安全**：
   - 不要在代码中硬编码 API 密钥
   - 使用环境变量存储敏感信息
   - 定期轮换 API 密钥

2. **HTTPS 部署**：
   - 生产环境必须使用 HTTPS
   - 使用 SSL/TLS 证书
   - 配置 HSTS 头

3. **访问控制**：
   - 配置防火墙规则
   - 限制 IP 访问
   - 使用速率限制

4. **数据安全**：
   - 加密存储敏感数据
   - 定期备份数据
   - 实施数据清除策略

## 性能优化建议

1. **前端优化**：
   - 使用虚拟滚动处理长列表
   - 实现图片懒加载
   - 使用 Web Workers 处理复杂计算

2. **后端优化**：
   - 实现数据库连接池
   - 使用 Redis 缓存
   - 实现请求队列

3. **网络优化**：
   - 使用 CDN 加速静态资源
   - 启用 HTTP/2
   - 配置 Gzip 压缩

## 故障排查

### 常见问题

1. **API 请求失败**：
   - 检查 API 密钥是否正确
   - 检查 API URL 是否正确
   - 检查模型名称是否正确
   - 检查网络连接

2. **Docker 容器无法启动**：
   - 检查端口是否被占用
   - 检查 Docker 日志
   - 检查防火墙配置

3. **前端构建失败**：
   - 检查 Node.js 版本
   - 清除 node_modules 重新安装
   - 检查 TypeScript 错误

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

- 项目地址：https://github.com/your-repo/rednote-assistent
- 问题反馈：https://github.com/your-repo/rednote-assistent/issues

## 更新日志

### v1.0.0 (2024-02-11)
- 初始版本发布
- 支持文案生成和选题推荐
- 支持 10 个模型供应商
- 实现安全加密存储
- 实现 Docker 部署
- 添加单元测试
- 优化性能
