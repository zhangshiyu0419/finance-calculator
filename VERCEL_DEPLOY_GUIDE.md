# Vercel 部署超详细教程 - 零基础小白版

## 📌 前言

Vercel是一个免费的网站托管平台，非常适合部署Next.js项目。本教程将手把手教你如何将理财计算器部署到Vercel。

---

## 🎯 整体流程概览

```
1. 注册GitHub账号 (10分钟)
   ↓
2. 创建GitHub仓库并上传代码 (10分钟)
   ↓
3. 注册Vercel账号 (3分钟)
   ↓
4. 在Vercel创建项目并连接GitHub仓库 (5分钟)
   ↓
5. 等待自动部署完成 (2分钟)
   ↓
6. 获得访问地址 ✅
```

**总耗时：约30分钟**

---

## 第一步：注册GitHub账号（如果没有）

### 1.1 什么是GitHub？
GitHub是一个代码托管平台，可以理解为"代码的云盘"。
- Vercel需要从GitHub读取代码
- 更新代码后，GitHub会自动通知Vercel重新部署

### 1.2 注册步骤

1. 打开网站：https://github.com/
2. 点击右上角的 **"Sign up"** 按钮
3. 填写注册信息：
   - **Email**：输入你的邮箱（推荐QQ邮箱或Gmail）
   - **Password**：设置密码（建议包含字母和数字，如 `Finance123!`）
   - **Username**：用户名（字母和数字组合，如 `finance-calc-2025`）
4. 点击 **"Continue"**
5. 验证邮箱：
   - 登录你填写的邮箱
   - 找到GitHub发的验证邮件
   - 点击邮件中的验证链接
6. 完成人机验证（简单拼图验证）
7. 选择个性化选项，可以都选"Skip"跳过

**✅ 注册完成！**

---

## 第二步：创建GitHub仓库并上传代码

### 2.1 创建GitHub仓库

1. 登录GitHub后，点击右上角的 **"+"** 号
2. 选择 **"New repository"**
3. 填写仓库信息：
   - **Repository name**（仓库名）：`finance-calculator`
   - **Description**（描述）：理财规划计算工具
   - **Public/Private**：选择 **Public**（公开，免费）
4. 点击 **"Create repository"** 按钮

### 2.2 准备本地代码

**如果你在本地沙箱环境中开发了代码：**

#### 方式A：使用Git命令行（推荐）

在终端执行以下命令：

```bash
# 1. 初始化Git仓库（如果还没有）
cd /workspace/projects
git init

# 2. 添加所有文件到暂存区
git add .

# 3. 创建第一次提交
git commit -m "初始提交：理财计算器"

# 4. 添加远程仓库地址（替换成你的GitHub用户名）
git remote add origin https://github.com/你的GitHub用户名/finance-calculator.git

# 5. 推送代码到GitHub
git branch -M main
git push -u origin main
```

**示例**（假设你的GitHub用户名是 `zhangsan`）：
```bash
git remote add origin https://github.com/zhangsan/finance-calculator.git
git push -u origin main
```

**遇到问题？**
- 如果提示需要登录，输入：
  - 用户名：你的GitHub用户名
  - 密码：需要使用 **Personal Access Token**（稍后说明）

#### 方式B：在GitHub网页直接上传（最简单）

1. 在GitHub仓库页面，点击 **"uploading an existing file"** 链接
2. 把整个项目的文件夹拖拽到页面上
3. 点击 **"Commit changes"** 按钮

**⚠️ 注意**：这种方式需要先在本地打包项目：
```bash
pnpm build
```
然后上传 `package.json`、`package-lock.json` 和整个项目文件夹

### 2.3 生成GitHub Personal Access Token（如果需要）

如果使用Git命令行时提示需要密码：

1. 在GitHub点击右上角头像 → **Settings**（设置）
2. 左侧菜单最下方找到 **Developer settings**（开发者设置）
3. 点击 **Personal access tokens** → **Tokens (classic)**
4. 点击 **"Generate new token"** → **"Generate new token (classic)"**
5. 填写信息：
   - **Note**：任意填写，如"Vercel部署"
   - **Expiration**：选择"30 days"或更长时间
   - **Scopes**：勾选 **repo**（仓库权限）
6. 点击 **"Generate token"**
7. **重要**：复制生成的token（只显示一次，保存好！）

**使用token**：
- Git要求输入密码时，粘贴这个token
- 输入密码时不会显示内容，直接粘贴即可

### 2.4 验证代码已上传

1. 刷新GitHub仓库页面
2. 应该能看到所有代码文件：
   - `src/` 文件夹
   - `package.json`
   - `.coze` 配置文件
   - 其他项目文件

**✅ 代码上传成功！**

---

## 第三步：注册Vercel账号

### 3.1 注册步骤

1. 打开Vercel官网：https://vercel.com/
2. 点击右上角的 **"Sign Up"** 按钮
3. 选择登录方式：
   - **推荐**：选择 **"Continue with GitHub"**（用GitHub登录，最方便）
   - 其他方式：Email、Google等也可以

### 3.2 完成注册

如果选择GitHub登录：
1. 授权GitHub给Vercel访问权限
2. 选择计划：**"Hobby"（免费）**
3. 确认用户名（自动从GitHub获取）
4. 点击 **"Continue"**

**✅ Vercel账号注册完成！**

---

## 第四步：在Vercel创建项目

### 4.1 进入Dashboard

注册成功后，会自动跳转到Vercel Dashboard（仪表盘）

### 4.2 创建新项目

1. 点击页面上的 **"Add New..."** 按钮
2. 选择 **"Project"**（项目）

### 4.3 连接GitHub仓库

1. 在 **"Import Git Repository"** 页面：
   - 找到你的 `finance-calculator` 仓库
   - 如果没看到，点击 **"Configure Git App"** 添加权限
2. 点击仓库右侧的 **"Import"**（导入）按钮

### 4.4 配置项目设置（保持默认即可）

进入项目配置页面，会自动识别这是一个Next.js项目：

**Framework Preset**（框架预设）：自动识别为 **Next.js**

**Root Directory**（根目录）：保持为 `./`（根目录）

**Build Command**（构建命令）：自动识别为 `npm run build`
- 如果提示找不到，可以手动输入：`pnpm run build`

**Output Directory**（输出目录）：自动识别为 `.next`

**Install Command**（安装命令）：保持为 `npm install`
- 或者改为：`pnpm install`

### 4.5 环境变量（通常不需要）

理财计算器是纯前端应用，不需要配置环境变量。
如果提示需要，可以暂时留空。

### 4.6 开始部署

1. 检查所有配置无误
2. 点击右下角的 **"Deploy"**（部署）按钮

---

## 第五步：等待自动部署完成

### 5.1 部署过程

部署过程会自动进行以下步骤：

1. **Cloning repository**（克隆仓库）- 从GitHub拉取代码
2. **Installing dependencies**（安装依赖）- 执行 `npm install`
3. **Building project**（构建项目）- 执行 `npm run build`
4. **Deploying**（部署）- 上传到Vercel服务器

**预计时间**：2-5分钟（取决于网速和项目大小）

### 5.2 查看部署日志

页面会实时显示构建日志：
- 绿色文字：正常
- 黄色文字：警告（可以忽略）
- 红色文字：错误（需要处理）

### 5.3 部署成功标识

当看到以下内容，说明部署成功：
- **Status**：**Ready**（就绪）
- 页面顶部显示 **Congratulations!**（恭喜）
- 出现 **"Visit"**（访问）和 **"Go to Dashboard"**（去仪表盘）按钮

---

## 第六步：获得访问地址

### 6.1 获取域名

部署成功后，会自动生成一个访问地址，格式如下：
```
https://你的项目名.vercel.app
```

**示例**：如果你的项目名是 `finance-calculator`
- 访问地址：`https://finance-calculator.vercel.app`

**⚠️ 注意**：
- 项目名是全局唯一的
- 如果项目名被占用，Vercel会自动添加随机后缀
- 如：`finance-calculator-x7a2b.vercel.app`

### 6.2 测试访问

1. 点击 **"Visit"** 按钮
2. 浏览器会打开新标签页
3. 应该能看到你的理财计算器网页

**✅ 部署成功！** 🎉

---

## 第七步：更新代码后重新部署

### 7.1 如何更新代码？

当你在本地修改了代码后：

**方式A：通过Git推送更新**

```bash
# 1. 添加修改的文件
git add .

# 2. 提交修改
git commit -m "描述你的修改内容"

# 3. 推送到GitHub
git push
```

**方式B：在GitHub网页直接修改**

1. 进入GitHub仓库
2. 找到要修改的文件
3. 点击文件右上角的铅笔图标 ✏️
4. 修改代码
5. 在页面底部填写提交信息
6. 点击 **"Commit changes"**

### 7.2 自动重新部署

Vercel会自动检测到GitHub代码更新，触发自动部署：

1. 在Vercel Dashboard查看项目
2. 会看到新的 **"Deploying"** 状态
3. 2-5分钟后，自动部署完成
4. 刷新网页，即可看到最新版本

---

## 💡 高级配置（可选）

### 8.1 自定义域名

如果想要自己的域名：

1. 购买域名（如阿里云、腾讯云购买）
2. 在Vercel项目设置中添加域名
3. 按提示配置DNS解析

### 8.2 环境变量

如果需要环境变量：

1. 进入Vercel项目 → **Settings** → **Environment Variables**
2. 点击 **"Add New"**
3. 填写 **Key**（变量名）和 **Value**（变量值）
4. 选择环境（Production/Preview/Development）
5. 点击 **"Save"**

### 8.3 多人协作

如果多人开发：

1. 在GitHub仓库中添加协作者
2. 协作者有权限推送代码
3. Vercel会自动部署任何人的更新

---

## ❗ 常见问题解决

### Q1：部署时报错 "Build command failed"

**原因**：依赖安装失败或构建命令错误

**解决方案**：
1. 检查 `package.json` 中是否有正确的构建脚本
2. 确保 `pnpm install` 能在本地正常运行
3. 查看 Vercel 构建日志中的错误信息

### Q2：部署成功但访问 404

**原因**：可能是Next.js路由问题

**解决方案**：
1. 检查 `src/app/page.tsx` 是否存在
2. 确保项目使用了App Router（不是Pages Router）
3. 尝试访问根路径 `/`

### Q3：部署后样式丢失

**原因**：Tailwind CSS未正确配置

**解决方案**：
1. 检查 `tailwind.config.js` 是否存在
2. 确保样式文件正确导入
3. 查看构建日志是否有警告

### Q4：GitHub推送后Vercel没有自动部署

**原因**：Webhook未正确配置

**解决方案**：
1. 进入Vercel项目 → **Settings** → **Git**
2. 查看 **Deploy Hooks** 配置
3. 可以手动触发部署：
   ```bash
   curl -X POST https://api.vercel.com/v1/integrations/deploy/你的ID
   ```

### Q5：免费额度用完了怎么办？

**Vercel免费计划额度**：
- 每月100GB带宽
- 每月6,000分钟构建时间
- 无限项目数量

**超出额度后**：
- 升级到Pro计划（$20/月起）
- 或使用其他免费托管平台（如Netlify）

### Q6：如何删除项目？

1. 进入Vercel项目
2. 点击 **Settings** → **General**
3. 滚动到页面最下方
4. 点击 **"Delete Project"**
5. 确认删除

---

## 🎓 进阶知识

### Vercel 是什么？

Vercel是一个现代化的前端部署平台，特点：
- ✅ 零配置部署
- ✅ 全球CDN加速
- ✅ 自动HTTPS
- ✅ 预览功能（每次commit都会生成预览链接）
- ✅ 边缘计算支持

### 其他免费托管平台

如果Vercel不适合你，可以尝试：

| 平台 | 特点 | 免费 | 国内访问 |
|------|------|------|----------|
| **Vercel** | Next.js官方推荐 | ✅ | 慢 ⭐⭐ |
| **Netlify** | 易用性好 | ✅ | 慢 ⭐⭐ |
| **腾讯云部署** | 国内速度快 | ❌ | 快 ⭐⭐⭐⭐⭐ |
| **阿里云部署** | 企业级 | ❌ | 快 ⭐⭐⭐⭐⭐ |

**国内用户建议**：如果主要用户在国内，建议使用腾讯云或阿里云部署。

---

## 📋 快速检查清单

部署前检查：
- [ ] GitHub账号已注册
- [ ] GitHub仓库已创建
- [ ] 代码已推送到GitHub
- [ ] Vercel账号已注册
- [ ] Vercel项目已连接GitHub仓库

部署中检查：
- [ ] 构建命令成功执行
- [ ] 没有红色错误信息
- [ ] 部署状态显示 **Ready**

部署后检查：
- [ ] 能正常访问网址
- [ ] 网页功能正常
- [ ] 样式显示正常

---

## 🚀 下一步

部署成功后：

1. **记录访问地址**
   - 保存好Vercel生成的网址
   - 如：`https://finance-calculator.vercel.app`

2. **配置微信小程序业务域名**
   - 登录微信公众平台
   - 添加这个域名到业务域名

3. **创建微信小程序**
   - 使用web-view加载这个网址
   - 详见 `WECHAT_MINI_GUIDE.md`

---

## ✅ 总结

通过本教程，你已经学会：
- ✅ 注册GitHub并上传代码
- ✅ 注册Vercel并连接GitHub
- ✅ 自动部署Next.js项目
- ✅ 获取HTTPS访问地址
- ✅ 自动更新部署

**恭喜你完成了网站部署！** 🎉

---

## 📞 获取帮助

- **Vercel官方文档**：https://vercel.com/docs
- **Vercel社区**：https://vercel.community
- **GitHub帮助中心**：https://docs.github.com

如果在部署过程中遇到问题，建议先查看这些官方文档。
