# dsh-auto-chat-titles

[English](README.md) | 简体中文

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 提供语义化、可配置的聊天标题。

此插件保留 DSH 的持久化 session-title 服务，仅替换其内置的提供程序策略。它增加了：

- 使用语义化 LLM 标题，而不是依赖首词回退方案；
- 在 **Settings → Plugins** 中提供专用的标题模型选择器；
- 在对话标题栏中提供 **Regenerate title**；
- 根据近期用户消息上下文重新生成标题；
- 可实时配置的标题长度、上下文、字节、token 和超时设置；
- 保留 DSH 现有的取消、规范化、持久化、来源记录、固定和投影行为。

## 要求

- DeepSeek Harness 0.1.1-rc.2 或更新的兼容 0.1.x 预发行版本
- Node.js 22+
- 包含标准 session-title、settings、commands 和 client runtime bundles 的 Web profile

## 安装

直接从 GitHub 安装：

```sh
dsh plugin --profile web add github:leonardoxr/dsh-auto-chat-titles
```

开发时从本地 checkout 安装：

```sh
npm install
npm run check
dsh plugin --profile web add "C:/absolute/path/to/dsh-auto-chat-titles"
```

Host 输出会通过当前运行的 watcher 热重载。浏览器客户端更改需要重新构建客户端产物，并刷新现有的 DSH Web 页面。

## 组合方式

捆绑的 `cordis.patch.yml` 仅禁用基础 `session-title-llm` row，并插入此插件。它有意保留核心 `session-title` 服务处于启用状态。DSH 同一时间仅支持一个异步标题提供程序，因此同时启用两个 provider rows 会导致错误。

自动生成使用第一条符合条件的用户消息。点击 **Regenerate title** 会显式调用同一个持久化服务，并使用不超过已配置数量的近期用户消息。手动重命名仍会固定标题；显式重新生成则会有意取消固定并替换标题。

## 设置

打开 **Settings → Plugins → Automatic chat titles**。

- **Title model** — 继承确切的 conversation route，或选择 host catalog 提供的任意模型。
- **Title length** — 非 CJK 语言的目标词数。
- **Regeneration context** — 手动重新生成时包含的近期用户消息数量。
- **Advanced generation limits** — CJK 长度、framed input bytes、output tokens 和超时时间。

挂载标准 file settings provider 后，设置会存储在 `$DSH_HOME/settings.yaml` 的 `auto-chat-titles` 下。

## 命令

UI 操作会调用 `/regenerate-title`。也可以直接在 composer 中输入该命令。按钮确认 command admission；conversation activity 会报告最终的生成结果。Command lifecycle events 会保留在 session audit log 中，生成的标题会作为 DSH 的标准 `session/title` event 持久化。

## 开发

```sh
npm install
npm run typecheck
npm test
npm run build
node scripts/preflight.mjs
npm pack --dry-run
```

host half 会编译到 `lib/`。browser half 会编译为 `client/client.js` 中的 DSH lazy-CJS module。

## 许可证

MIT
