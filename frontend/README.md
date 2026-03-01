# 小红书助手

专业的AI驱动小红书内容创作工具，助您轻松打造爆款内容。

## 功能特性

- **文案生成** - 支持4种类型（生活分享/Vlog、穿搭/美妆、知识科普/教程、产品种草/测评）和4种风格（简洁明了风、专业干货风、情感共鸣风、活泼可爱风）
- **选题推荐** - 智能推荐热门选题，分析趋势和竞品
- **爆款分析** - 评估文案爆款潜力，提供优化建议
- **趋势分析** - 分析平台趋势和用户需求
- **API配置** - 支持配置小红书API和大模型API
- **主题切换** - 支持浅色和深色主题
- **历史记录** - 保存生成历史，方便复用

## 技术栈

- **前端框架**: Vue 3 + TypeScript + Vite
- **UI框架**: Element Plus
- **状态管理**: Pinia
- **HTTP客户端**: Axios
- **图表库**: ECharts
- **路由**: Vue Router
- **其他工具**: vue-clipboard3, dayjs, crypto-js

## 快速开始

### 安装依赖

```bash
cd frontend
npm install
```

### 配置环境变量

创建 `.env` 文件并配置API基础URL：

```
VITE_API_BASE_URL=http://localhost:3000/api
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看应用。

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
frontend/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 组件
│   │   ├── common/     # 通用组件
│   │   ├── copywriter/ # 文案生成组件
│   │   ├── topic-selector/ # 选题推荐组件
│   │   └── settings/   # 设置组件
│   ├── composables/    # 组合式函数
│   ├── stores/         # 状态管理
│   ├── types/          # 类型定义
│   ├── utils/          # 工具函数
│   ├── views/          # 页面
│   ├── App.vue         # 根组件
│   └── main.ts         # 入口文件
├── public/             # 公共资源
├── .env               # 环境变量
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript配置
├── vite.config.ts      # Vite配置
└── index.html          # HTML模板
```

## 使用说明

### 1. 配置API

首次使用需要在设置页面配置API：

- **小红书API**: 配置App Key、App Secret和Base URL
- **大模型API**: 配置API Key、API URL和模型名称

### 2. 生成文案

1. 选择文案类型（生活分享/Vlog、穿搭/美妆、知识科普/教程、产品种草/测评）
2. 选择文案风格（简洁明了风、专业干货风、情感共鸣风、活泼可爱风）
3. 输入文案主题
4. 点击"生成文案"按钮
5. 查看生成结果，包括标题选项、正文内容、Emoji建议、标签推荐和爆款分析

### 3. 推荐选题

1. 选择内容领域（美妆时尚、美食生活、旅行户外、知识科普）
2. 选择目标受众（年龄、性别、地域）
3. 选择创作方向（实用干货、情感分享、产品推荐）
4. 点击"生成选题"按钮
5. 查看推荐结果，包括选题列表和趋势分析

### 4. 管理历史

- 在设置页面可以清除历史记录
- 历史记录保存在本地存储中

## 开发说明

### 添加新功能

1. 在 `src/types/` 中添加类型定义
2. 在 `src/utils/api.ts` 中添加API方法
3. 在 `src/composables/` 中创建组合式函数
4. 在 `src/views/` 中创建页面组件
5. 在 `src/router/index.ts` 中添加路由

### 主题定制

在 `src/assets/styles/main.css` 中修改CSS变量：

```css
:root {
  --el-color-primary: #ff2442;
  /* 其他颜色变量 */
}
```

## 注意事项

- API Key和Secret会加密存储在本地
- 历史记录保存在localStorage中，清除浏览器数据会丢失
- 首次使用需要配置API才能使用完整功能

## 许可证

MIT

## 联系方式

如有问题或建议，请联系开发者。
