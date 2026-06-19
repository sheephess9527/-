// 站点级别的配置 —— 之后想改名字 / 简介 / 社交链接，改这里即可。

export const siteConfig = {
  title: '锚点',
  subtitle: 'Anchor',
  // Slogan / 简介
  description: '用系统对抗混乱，用逻辑重塑日常。',
  author: '锚点',
  // 导航栏链接
  nav: [
    { label: '首页', route: '#/' },
    { label: '关于', route: '#/about' },
  ],
  // 页脚社交链接（留空的会自动隐藏）
  social: {
    github: '',
    email: 'mailto:hztbc001@gmail.com',
    twitter: '',
  },
  // 评论区（Giscus，基于 GitHub Discussions）。
  // 填好 repoId / categoryId 后，文章底部自动出现评论区；留空则不显示。
  // 获取方式见 README 或 https://giscus.app —— 输入仓库后会生成这两个 ID。
  comments: {
    repo: 'sheephess9527/maodianblog',          // owner/name
    repoId: 'R_kgDOQUFQXQ',                      // 形如 R_kgD...
    category: 'Announcements',                   // Discussions 分类名
    categoryId: 'DIC_kwDOQUFQXc4C_cga',          // 形如 DIC_kwD...
  },
  // “关于”页面的内容（Markdown）
  about: `
## 关于「锚点」

在信息过载、节奏失控的日子里，我们需要一个**锚点** —— 一个让思绪停靠、让行动有据的支点。

这个博客记录我把**系统思维**和**逻辑方法**应用到工作与生活的尝试：如何搭建可复用的流程、
如何做更好的决策、如何让复杂的事情变得可执行。

### 你会在这里读到

- **方法与系统**：清单、流程、模板，能直接拿去用的那种
- **决策与思考**：把模糊的判断拆成清晰的步骤
- **工具与效率**：让日常少一点摩擦、多一点产出

> 用系统对抗混乱，用逻辑重塑日常。

### 联系

- 发邮件到 [hztbc001@gmail.com](mailto:hztbc001@gmail.com)
`,
};
