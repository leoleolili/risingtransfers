# RisingTransfers 2.0: Transfer Topic OS - 核心规划文档

**版本**: 2.0 Draft
**日期**: 2026-01-02
**状态**: 待审查 (Pending Review)

---

## 1. 核心产品哲学 (Product Philosophy)

> **"Chat 不是入口，Topic Page 才是入口。用户不是在聊天，而是在进入一个【转会现场】。"**

系统的原子单位是 **Transfer Topic (转会主题)**。一切交互（对话、下注、预测、信号）都必须锚定到一个具体的 `topic_id`。

---

## 2. 产品架构设计 (Product Architecture)

### 2.1 双入口机制 (Dual Entry System)
系统设计了两种进入“转会现场”的路径，满足不同用户意图：

#### (A) 宏观入口：Discover Feed (全球视野)
*   **用户意图**: "最近有什么大新闻？我的主队有什么动静？"
*   **形态**: 首页信息流。
*   **逻辑**: 基于用户偏好 (User Preference) + 推荐算法，展示 Top N 热门/相关的转会主题卡片。
*   **行为**: 点击卡片 -> 进入 (B)。

#### (B) 微观入口：Transfer Scene (转会现场)
*   **用户意图**: "我想深入了解 Mbappe 去皇马这件事。"
*   **形态**: 沉浸式的主题详情页。
*   **核心布局 (5大模组)**:
    1.  **AI Judgment**: 一句话结论 + 动态概率仪表盘。
    2.  **Timeline**: 关键信号流 (Signal Stream)，展示 rumour -> here we go 的演变。
    3.  **Topic Chat**: 也就是“交互层”。用户在此提问、追问，上下文严格锁定当前 Topic。
    4.  **Betting Zone**: 观点下注区 ("你觉得会成吗？")。
    5.  **Community**: 社区热门观点引用。

### 2.2 范围锚定 (Scope Anchoring)
*   **主队优先**: 用户必须选择 1 个主队。Discover Feed 优先展示主队相关。
*   **可控聊天**: Chat 不允许天马行空的闲聊。如果用户偏题，AI 应引导回相关 Topic 或推荐新 Topic。

---

## 3. 技术架构方案 (Technical Architecture)

### 3.1 核心数据模型 (Core Schema)
不依赖黑科技，依赖强结构化数据。

*   **`TransferTopic`**: 系统的核心锚点。
    *   必填项: `player`, `from_club`, `to_club_candidates`, `window_deadline`.
    *   状态: `Rumour` | `Advanced` | `HereWeGo` | `Official`.
*   **`Signal`**: AI 分析的燃料。
    *   来源 (Tier 1/2/3), 内容, 时间戳, URL.
*   **`UserPreference`**: 过滤噪音的边界。
    *   主队 ID, 关注球队 IDs.

### 3.2 AI 与多模态 (AI & Multimodality)
*   **模型**: **Gemini Pro** (具备长上下文和搜索 Grounding 能力)。
*   **Generative UI**: 聊天回复不仅是 Markdown，而是渲染 React 组件 (e.g., `<PredictionCard />`, `<TimelineChart />`)。
*   **Chat Orchestrator**: 自建后端调度层。
    *   职责: 识别意图 -> 锁定 Context (Topic + Signals) -> 调用 LLM -> 格式化输出。

### 3.3 策略：Skills vs. Subagents
*   **Skills (前台)**: 主 Agent (转会专家) 挂载的工具箱。
    *   `Retrieval`: 查证据。
    *   `Action`: 下注。
    *   `Navigation`: 推荐其他话题。
*   **Subagents (后台)**: 负责异步任务，不直接与用户对话。
    *   **The Scout**: 24h 监控 Twitter，发现并将非结构化推文转化为结构化的 `TransferTopic`。
    *   **The Judge**: 窗口关闭时负责结算和复盘。

---

## 4. 执行路线图 (Execution Roadmap)

### 🟢 Milestone 1: Topic Chat MVP (The "Site")
*目标：搭建“转会现场”的物理结构，不接真实 AI，跑通核心流程。*
1.  **Schema**: 定义 TypeScript 接口。
2.  **UI**: 实现 Discover Feed 和 5模块布局的 Topic Page。
3.  **Mock Engine**: 使用本地 Mock 数据驱动页面和基础对话。

### 🟡 Milestone 2: Intelligence & Automation (The "Brain")
*目标：接入真实大脑。*
1.  **Gemini Integrate**: 接入 Vercel AI SDK，替换 Mock 聊天。
2.  **GenUI**: 聊天框支持渲染组件。
3.  **Signal Ingestion Stub**: 设计数据采集的接口规范。

### 🔴 Milestone 3: Real World (The "Eyes")
*目标：接入真实世界数据。*
1.  **Data Source**: 接入 `twitterapi.io` 或 Sportmonks。
2.  **Betting System**: 完善积分与结算体系。

---

## 5. 待审核 (Review Request)
请确认本规划文档是否准确完整地表达了您的意图。
确认后，工程团队将立即启动 **Milestone 1** 的开发工作。
