# 如何查看文档文件

## 📍 文档文件位置

所有文档文件都在项目根目录：`/workspace/projects/`

### 📚 你有这些文档：

1. **UPLOAD_GUIDE.md** (9.4KB) - 项目文件上传指南
2. **VERCEL_DEPLOY_GUIDE.md** (13KB) - Vercel部署详细教程
3. **WECHAT_MINI_GUIDE.md** (5.7KB) - 微信小程序部署指南
4. **README.md** (8.2KB) - 项目说明文档

---

## 🔍 查看文档的多种方式

### 方式1：在当前聊天中查看（推荐）

**直接告诉我你想看哪个文档，我可以展示给你！**

例如：
- "展示上传指南的内容"
- "我想看Vercel部署教程"
- "帮我打开微信小程序指南"

我会用工具读取文件并展示在聊天中。

---

### 方式2：使用命令行查看（当前沙箱环境）

如果你想自己在终端查看：

#### 查看文件列表：
```bash
cd /workspace/projects
ls -lh *.md
```

#### 查看整个文件：
```bash
cat UPLOAD_GUIDE.md
cat VERCEL_DEPLOY_GUIDE.md
cat WECHAT_MINI_GUIDE.md
```

#### 查看前50行：
```bash
head -50 UPLOAD_GUIDE.md
```

#### 查看后50行：
```bash
tail -50 VERCEL_DEPLOY_GUIDE.md
```

#### 使用更方便的查看器（如果支持）：
```bash
less UPLOAD_GUIDE.md
```
按 `q` 退出查看器。

---

### 方式3：上传到GitHub后查看（推荐长期使用）

当你把代码上传到GitHub后：

1. 访问你的GitHub仓库
2. 点击文件名即可查看
3. GitHub有漂亮的Markdown渲染

**优点**：
- 排版美观
- 支持代码高亮
- 方便分享链接
- 可以在线编辑

**示例**：
```
https://github.com/你的用户名/finance-calculator/blob/main/UPLOAD_GUIDE.md
```

---

### 方式4：使用代码编辑器

如果你在本地开发：

- VS Code：直接点击文件打开
- WebStorm：双击文件打开
- 其他编辑器：File → Open

---

## 📖 各文档快速概览

### 1. UPLOAD_GUIDE.md - 文件上传指南

**内容**：
- 项目文件结构说明
- 哪些文件需要上传
- 哪些文件不需要上传
- Git命令上传步骤
- 上传验证方法

**适合**：准备上传代码到GitHub时查看

---

### 2. VERCEL_DEPLOY_GUIDE.md - Vercel部署教程

**内容**：
- 注册GitHub账号
- 创建仓库并上传代码
- 注册Vercel账号
- 在Vercel创建项目
- 等待自动部署
- 获取访问地址
- 更新代码方法

**适合**：部署网页到Vercel时查看

---

### 3. WECHAT_MINI_GUIDE.md - 微信小程序指南

**内容**：
- 注册微信小程序
- 安装开发工具
- 部署网页到云端
- 创建小程序代码
- 配置业务域名
- 测试与发布
- 常见问题解答

**适合**：开发微信小程序时查看

---

## 💡 建议的阅读顺序

如果你是从零开始：

```
第1步：UPLOAD_GUIDE.md
  ↓ 了解需要上传哪些文件
  ↓
第2步：VERCEL_DEPLOY_GUIDE.md
  ↓ 部署网页到Vercel
  ↓
第3步：WECHAT_MINI_GUIDE.md
  ↓ 创建微信小程序
```

---

## 🎯 快速开始

### 想看哪个文档，直接告诉我：

**示例**：
1. "展示上传指南"
2. "帮我打开Vercel教程"
3. "查看微信小程序指南"
4. "显示所有文档的目录"

我会立刻为你展示内容！

---

## 📝 提示

- **当前环境**：这些文件保存在沙箱的 `/workspace/projects/` 目录
- **永久保存**：上传到GitHub后，文档会永久保存
- **在线查看**：GitHub上查看体验最好（排版美观）
- **本地查看**：下载到本地后可用任何编辑器打开

---

## ✅ 现在你想看哪个文档？

直接告诉我，我马上为你展示！
