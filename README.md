# 六级高频词汇默写器

一个使用 HTML、CSS、JavaScript 制作的轻量词汇练习网页。

## 功能

- 英文单词选择中文释义
- 中文释义选择英文单词
- 内置 700+ 个六级高频词
- 支持全部、基础、进阶、困难难度筛选
- 答题后立即判断对错
- 回答正确后自动进入下一题
- 答错时显示正确答案
- 自动统计总题数、正确数、错误数
- 自动记录错题

## 运行方法

直接双击打开 `index.html` 即可使用。

也可以在项目文件夹中启动一个本地静态服务，例如：

```bash
python -m http.server 8000
```

然后在浏览器打开：

```text
http://localhost:8000
```

## 部署到 GitHub Pages

1. 登录 GitHub，新建一个仓库，例如 `cet6-word-trainer`。
2. 把本项目里的 `index.html`、`styles.css`、`app.js`、`words.js`、`README.md` 上传到仓库根目录。
3. 进入仓库页面的 `Settings`。
4. 点击左侧 `Pages`。
5. 在 `Build and deployment` 中选择：
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
6. 保存后等待一会儿，GitHub 会生成一个访问地址。

生成的网址通常类似：

```text
https://你的用户名.github.io/cet6-word-trainer/
```
