# Y / X 个人作品集

基于 Next.js / React 的个人作品集，包含 About、Film、Photo、Design、Contact。

## 本地运行

```bash
pnpm install --frozen-lockfile
pnpm dev
```

## 发布

GitHub Pages 通过 GitHub Actions 自动构建和发布 main 分支。
网站地址：https://yiluxu95-cell.github.io/portfolio/

```bash
GITHUB_PAGES=true pnpm build
```

静态构建输出为 out/。原始页面视觉和交互保留，图片为 Unsplash 临时素材。
