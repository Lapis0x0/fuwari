---
title: 零一万物之死
published: 2025-01-25
description: "本文复盘零一万物从明星独角兽到出售团队的溃败历程，揭示其战略摇摆、资本豪赌与组织内耗三重困境，并通过对比DeepSeek的开源生态与年轻化创新，剖析大模型创业从技术狂欢回归商业本质的必然逻辑。"
image: ""
tags: []
category: 深度学习
draft: false
---
我在[2024年10月19日的博客](https://www.lapis.cafe/posts/ai-and-deep-learning/%E4%B8%BA%E4%BB%80%E4%B9%88%E6%88%91%E8%BF%87%E5%8E%BB%E7%8E%B0%E5%9C%A8%E4%B9%83%E8%87%B3%E6%9C%AA%E6%9D%A5%E9%83%BD%E7%9C%8B%E7%A9%BA%E9%9B%B6%E4%B8%80%E4%B8%87%E7%89%A9/)中曾经很明确地预判过：

:::note
我作为金融壬持续看空零一万物这家公司，无论是它的商业逻辑还是运营能力，在我看来都难以支撑其「独角兽」的市场地位。
:::
这一观点在当时（李开复刚买了大量通稿吹零一万物和新模型并强调不会放弃预训练）可能显得有些激进，但2025年1月初的新闻最终还是印证了我预判的含金量：

![image.png](https://blog-1302893975.cos.ap-beijing.myqcloud.com/pic/202501251529574.png)

嘴硬没有任何意义，**零一万物从未找到清晰的产品定位，也始终无法证明自己在商业链条上的不可替代性**。

24年10月份写下那篇博客时，我的预判还只是「对零一万物未来的发展持谨慎态度，并倾向于看空其长期表现」，现在来看人家的资金链比我想象的还要紧张，谁又能想到这个曾经巨头加盟声势浩大的公司成为第一个在大模型时代出局的独角兽了呢？

当2025年的年初清冷地敲响钟声，这场闹剧式的收场显得荒诞但并不意外——零一万物的商业野心最终以预训练研发团队打包出售给阿里的形式画上了终止符，而公司CEO李开复博士的“白菜价模式”“SOTA领先模型”等豪言壮语，也最终随着他在媒体面前的解释显得苍白无力。

在资本与技术竞赛的狂飙中，我认为零一万物失败的原因并不复杂——它并不是被技术打败了，能训练出Yi-Lighting这种规模和性能的模型代表零一万物并不是一无是处，它是被自身缺乏清晰战略的营运模式给拖垮的。从一个打着「零一智能，万物赋能」标签的明星独角兽到黯然出局，零一的没落就像一面镜子，硬照出了大模型创业浪潮的光与影。

今天，我们不妨从几个视角再来回顾下零一万物从崛起到溃败的过程，在大模型赛道从狂欢到冷静再到理性的起伏中进行再反思。

# 一、零一发展历程梳理
## 起高楼——豪华的创业团队

2023年3月下旬，创新工场董事长兼CEO李开复正式宣布以Project AI 2.0之名入局大模型，从3月开始在三个月内拉起了数十名核心成员的团队，成员集中在大模型技术、人工智能算法、自然语言处理、系统架构、算力架构、数据安全、产品研发等领域。技术副总裁及AI Alignment负责人是 Google Bard/Assistant 早期核心成员，主导或参与了从 Bert、LaMDA 到大模型在多轮对话、个人助理、AI Agent 等多个方向的研究和工程落地；首席架构师曾在Google Brain与Jeff Dean、Samy Bengio等合作，为TensorFlow的核心创始成员之一。

而算法和模型团队成员中，有论文曾被GPT-4引用的算法大拿，有获得过微软内部研究大奖的优秀研究员，曾获得过阿里CEO特别奖的超级工程师。总计在ICLR、NeurIPS、CVPR、ICCV等知名学术会议上发表过大模型相关学术论文100余篇。

作为主力战将之一，零一万物技术副总裁及 Pretrain 负责人黄文灏、技术副总裁及AI Infra负责人戴宗宏今天也正式亮相，并对最新产品进行介绍。此前，黄文灏曾先后任职于微软亚洲研究院和智源研究院；戴宗宏则是前华为云 AI CTO 及技术创新部长、前阿里达摩院 AI Infra 总监。

其中**已加入的联创团队**成员包含前阿里巴巴副总裁、前百度副总裁、前滴滴/百度首席算法负责人、前谷歌中国高管、前微软/SAP/Cisco/副总裁，算法和产品团队背景均来自国内外大厂。三个月内零一团队已经实现百亿参数规模的模型内测，正往300到700亿参数规模扩大。

## 宴宾客——发展历程梳理

**2023年11月6日**：零一万物正式发布首款开源中英双语大模型「Yi」。同期，零一万物完成新一轮融资，由阿里云领头，估值超10亿刀。

**2024年3月14日**：零一万物发布Yi大模型API开放平台，为开发者提供多种模型服务。

**2024年5月7日**：零一万物推出一站式AI工作平台“万知”，支持会议纪要、周报、写作助手等功能。

**2024年5月13日**：零一万物发布千亿参数闭源大模型Yi-Large。

**2024年6月**：零一万物的Yi-Large等系列大模型正式登陆阿里云百炼平台。

**2024年8月**：零一万物完成下一轮融资，金额达数亿刀，此轮融资参与方包括某国际战投、东南亚财团等多家机构。

**2024年10月16日**：零一万物发布新旗舰模型Yi-Lightning，并公布ToB战略下的AI 2.0数字人产品。

## 楼塌了

**2024年10月**：零一万物被传放弃预训练，李开复辟谣称将继续专注于预训练模型。

**2025年1月2日**：零一万物与阿里云达成战略合作，成立“产业大模型联合实验室”，聚焦技术、业务、人才等板块的深度共建。

**2025年1月6日**：市场传言零一万物将预训练团队出售给阿里云，李开复辟谣称该消息不实。

> 结果还是卖了
> 

# 二、为什么楼会塌？

## （一）战略迷失：在开源与闭源之间反复横跳的“精神分裂”

零一万物自诞生之初就展现出明显的战略摇摆。在2023年11月高调发布其开源模型Yi时，李开复曾宣称“开源是AI民主化的必由之路”，但短短几个月后推出的闭源Yi-Large却转而强调"核心技术必须掌握在自己手中"。2024年5月重申不打价格战，「**价格战烧不出 AI 超级应用，好模型有贵的道理**」，四个月后新发布的Yi-Lightning价格又迅速降到1元/M的量级。这种180度的转向背后，暴露出团队对商业模式认知的混乱。

更致命的是，当阿里云在2024年6月将其模型接入通义百炼平台时，零一万物实际上已经沦为云厂商的算法供应商。此时李博士再转头布局"万知"企业服务平台，试图直接触达终端客户，本质上形成了与合作伙伴的竞争关系。这种既要当运动员（做产品）又想当裁判员（做基建）的定位，最终导致其既失去了阿里云的深度支持，又未能建立起独立的产品生态。

数据最能说明问题：截至2024年Q3，Yi系列API调用量始终徘徊在GPT-4调用量的3%左右，而其引以为傲的"万知"平台企业用户数未突破5000家，客单价更是不足竞品DeepSeek的1/3。这种两头不靠岸的尴尬处境，像极了当年在社交与工具之间摇摆的子弹短信。

## （二）产品空心化：技术至上主义的致命陷阱

翻阅零一万物官网的产品矩阵，我们会发现一个有趣的现象：从Yi-Large到Yi-Lightning，所有版本迭代都在强调"参数规模提升50%""MMLU评分超越GPT-4"，却始终回避回答最核心的问题——这些技术突破如何转化为商业价值？

这种"为SOTA而SOTA"的研发导向，在2024年10月发布的数字人产品上达到顶峰。

当团队还在炫耀数字人的微表情延迟降低了0.3秒时，市场早已被硅基智能、风平智能等玩家的"千元级数字人解决方案"占领。据某券商调研，零一万物单个数智人客户的获客成本高达8.7万元，而行业均值仅1.2万元。

更值得玩味的是其产品落地场景的选择：既有面向开发者的模型API，又有针对企业的"万知"办公套件，还布局了数智人赛道。这种撒胡椒面式的扩张，恰恰暴露了其缺乏核心场景深耕能力的短板。

在大模型领域，尤其像零一万物这种独角兽，做十款60分产品不如做一款90分产品。产品矩阵过多过广会极大的分散团队的注意力和共识，内斗会极大的拖缓整体公司决策的步伐。

## （三）资本豪赌：算力军备竞赛下的现金流危机

零一万物的融资轨迹揭示了一个危险的信号：从2023年到2024年，其估值从70亿飙升至200亿人民币，但经营性现金流始终为负。作为前大模型独角兽，零一万物为了保证自家大模型不掉队，绝大多数融资一定会投入到预训练算力的采购中。

这种"融资-买卡-刷榜-再融资"的击鼓传花游戏，在2024年遭遇致命打击。

随着美国新一轮芯片禁令出台，直接导致其千卡集群建设计划搁浅。而此时距离其宣称"启动下一代万亿参数Yi-XLarge MoE模型训练"的豪言，才过去不到三个月。

零一万物引以为傲的"白菜价"战略中，为抢占市场份额，其API定价仅为GPT-4的1/5，但根据内部测算，每处理100万tokens的实际成本却远大于收费价格。这种饮鸩止渴的定价策略，本质上是用投资人的钱补贴客户，最终在资本寒冬来临时轰然崩塌。

> 如今，李开复不得不承认，“当前只有大厂能够‘烧’超大模型。”虽然否认了打包出售，但他在接受媒体采访时表示，愿意继续训练超大参数模型的成员，加入了零一万物和阿里云成立的“产业大模型联合实验室”。
> 

## （四）**组织熵增：豪华团队的布朗运动**

当我们审视这个集结了谷歌大脑、阿里达摩院、华为2012实验室精英的"全明星团队"，会发现一个诡异的悖论：成员个体越优秀，组织内耗反而越严重。多位离职员工在匿名社区爆料，光是"应该先做对话式AI还是先做行业大模型"的路线之争，就导致三个月内更换了四次技术架构。

接下来就是我们非常熟悉的山头内斗了，零一万物内部也存在"海归派"与"本土派"的隐形割裂。从流出的会议纪要可见，拥有海外背景的高管坚持"技术驱动论"，主张持续投入预训练；而来自国内大厂的成员则力推"场景先行"，要求砍掉部分研发预算转向垂直领域。这种理念分歧直接导致Yi-Lightning成为了"四不像"产品——既想保持通用性又要强调金融场景适配，最终在两项评测中都未能进入前三。

# 三、Deepseek与零一万物——大模型创业启示录

:::note
当然，我还要给零一万物找补一下：深度求索背靠幻方，自家爸爸有钱不用担心投资人压力，零一万物自成立之初就一直有沉重的变现盈利商业化运作压力，资本的考量不可谓不重要。
:::

零一万物的溃败与DeepSeek-R1的崛起，共同勾勒出大模型赛道从资本狂欢到理性回归的清晰脉络。零一万物的故事或许是中国大模型创业最好的启蒙教材——它用近30亿美元的代价告诉我们：在AI 2.0的世界里，没有战略定力的技术狂欢，终将沦为资本游戏中的烟花表演。

### 1. **技术护城河幻觉的破灭：开源生态重构竞争格局**

DeepSeek-R1的爆发印证了一个残酷现实：单纯依赖参数规模和榜单刷分的时代已终结。其通过**全栈开源策略（MIT协议）**，不仅开放了660B参数的模型权重，还允许用户基于R1进行二次开发与模型蒸馏，甚至将6个蒸馏后的小模型（1.5B-70B）开源。这直接导致了一个现象：原本需要天价算力支撑的顶级推理能力，如今中小开发者仅用开源社区资源即可复现，甚至通过微调在特定场景超越闭源模型。

更关键的是，DeepSeek-R1-Zero的实验证明，**纯强化学习方法无需依赖监督微调（SFT）**，仅通过极简奖励规则（准确性+格式约束）即可激发模型涌现推理能力。这种技术民主化彻底击碎了"闭源即壁垒"的幻想——当算法框架、训练方法论甚至思维链生成机制都被透明化，技术护城河已从"独家秘籍"转变为"开放协作的起点"。

### 2. **生态绑定与效率革命的双重碾压**

当零一万物因战略摇摆陷入"既要当云厂商的算法供应商，又想直接争夺终端客户"的困境时，DeepSeek-R1用**生态协同+成本屠刀**的组合拳重构了竞争规则。一方面，其输入tokens每百万1元的超低定价（仅为OpenAI o1的3%）倒逼企业用户迁移，配合"思维链API接口"实现技术价值与产业需求的无缝咬合；另一方面，通过群组相对策略优化（GRPO）将标注数据需求骤降至传统方法的0.5%，结合动态知识蒸馏技术使3B小模型性能超越竞品15%，最终在同等性能下实现训练成本仅为Llama3的1/11。这种战略与技术的双重碾压，本质上是**用工程创新支撑商业野心**——当零一万物还在烧钱买卡时，DeepSeek已通过算法架构革新，将每单位算力的商业回报提升了27倍。

### 3.**破除精英迷信：年轻血液重构创新范式**

零一万物的陨落与DeepSeek的崛起，揭示了大模型创业中一个被长期忽视的真理：**过度迷信海外大牛和明星团队，往往导致战略失焦与组织内耗**。当行业还在追捧“谷歌大脑+FAIR+OpenAI”的履历组合时，DeepSeek用一支平均年龄不足28岁的本土团队，完成了对传统精英叙事的颠覆。

**（1）认知红利**

DeepSeek的成员构成极具反叛性——85%的核心技术岗位由应届毕业生或毕业两年内的新人担任，甚至包括在读博士生。这种看似冒险的用人策略，实则暗含对大模型技术特性的深刻洞察：

- **技术代际跃迁的红利期**：当行业处于范式变革期（如从Transformer到MLA架构），经验反而可能成为思维定势的枷锁。年轻研究者未被既有框架束缚，更敢于挑战“Attention机制不可修改”等行业教条。
- **极致效率导向**：年轻团队对算力优化有近乎偏执的追求。清华毕业生赵成钢主导的Fire-Flyer超算架构，通过动态资源调度算法将GPU利用率提升至92%，远超行业平均60%的水平。这种工程能力，恰是零一万物等依赖云厂商的团队难以企及的。

**（2）本土创新的组织优势**

与零一万物高调引进海外人才不同，DeepSeek坚持“本土培养+内部造血”模式：

- **文化认同消除沟通损耗**：团队成员多来自清北、北邮等国内高校，共享相似的教育背景与研究范式。这种同源性大幅减少了“海归派”与“本土派”常见的理念冲突（如预训练优先还是场景优先的路线之争）。
- **扁平化协作激发创造力**：DeepSeek采用OpenAI式的“自然分工”机制——任何小组只要对某个方向感兴趣，即可自由调用算力资源启动项目。这种模式使GRPO强化学习算法从构想到论文发表仅耗时47天，而传统企业同等规模创新平均需6个月。

中国大模型创业正在书写新的规则：不再需要复刻硅谷的人才崇拜，也不必困于“海归光环”的焦虑。正如梁文锋所言：“我们不需要世界前50的AI专家，因为我们可以自己培养出第51到100名——而他们终将重新定义排名。”这种自信，或许才是中国AI穿越周期真正的护城河。

### 4. **开源协作与技术透明度成竞争加速器**

DeepSeek-R1的MIT协议开放策略，不仅赢得开发者社区支持，更倒逼技术透明度成为行业准入门槛。其论文中坦承R1-Zero存在"语言混杂""可读性差"等缺陷，并通过冷启动数据迭代改进，这种开放纠错机制反而增强了技术公信力。相比之下，零一万物封闭的技术路线与夸大宣传，最终导致信任崩塌。

未来，大模型竞争将演变为**开放生态的协同效率之争**——谁能更快吸收社区创新、更低成本整合产业链，谁就能在洗牌中存活。正如Nature评论所言："DeepSeek的成功证明，资源效率比算力规模更重要"。

### 结语：理性时代的生存法则

当资本泡沫退去，大模型创业已从"造神运动"回归商业本质。零一万物和DeepSeek-R1的启示在于：**技术必须服务于可量化的商业价值，而价值必须通过生态协作实现指数级放大**。零一万物的墓碑上刻着"战略迷失"，而DeepSeek的里程碑则写着"开源即护城河，效率即生命力"。这场范式转移中，唯有拥抱开放、深耕场景、极致提效的玩家，方能穿越周期，见证AGI的真正曙光。

# 参考

[1] 李开复麾下大模型公司零一万物上线，数十位核心成员就位，量子位

[2] 刚刚，李开复最快独角兽诞生：零一万物估值超70亿，投资界PEdaily 

[3] 「零一万物」完成数亿美元融资，某国际战投、东南亚财团加盟，36氪独家

[4] 零一万物决定给大厂让路，界面新闻

[5] 全网都在扒的DeepSeek团队，是清北应届生撑起一片天，量子位

[6] 揭秘DeepSeek:一个更极致的中国技术理想主义故事，暗涌Waves

[7] 回望大模型这一年：混搭、扩散、ROI，腾讯研究院

[8] DeepSeek's Unconventional Talent Strategy: Why They Hire Fresh Graduates Over Industry Veterans