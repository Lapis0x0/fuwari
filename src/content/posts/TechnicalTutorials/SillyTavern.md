---
title: VPS快速部署酒馆（SillyTavern）教程
published: 2025-07-12
description: "挺好一chatbot项目，优点是可拓展性极强，缺点是臃肿"
image: ""
tags: []
category: 技术教程
draft: false
---

酒馆（SillyTavern）这个开源项目的兴起，**直接源于在线大模型的角色扮演能力日益增强**——以 Claude 2 推出为第一个小高潮，各种自定义GPTs井喷助推自定义chatbot为市场主流。同时伴随着本地大模型（如 Llama、Mistral、Qwen 等）的快速演化与微调小模型成为显学，显著降低了非云端部署的门槛，使用户对 AI 互动的掌控权进一步下沉。

SillyTavern作为「开源赛博AI对话窑子」，实质上是一套灵活、极度可定制化的前端对话框架（尽管很多时候显得臃肿），**专为调教、封印、角色扮演、人格化交互而生**，如今已经集成了多模型接入（OpenAI / Claude / Mistral / 本地推理）、插件系统（RAG 文档检索、图生图、TTS、Web Search）、记忆机制、群聊、指令脚本等丰富功能。

在这个框架中，你可以定义&使用别人的角色卡，修改世界书/系统提示，手动控制回复长度/语气/偏好，创建多角色剧场、群聊世界观，最终构建一个**围绕人格模型而非单轮问答的持续互动场景**。

>简单来说，SillyTavern 是一个配置复杂、拓展性极强的前端系统，**本质上仍是一套围绕大语言模型构建的 chatbot 对话框架**，但它把“折腾大模型”这件事发挥到了极致。它依托于模块化、精细化的上下文 prompt 工程体系，受益于庞大活跃的社区角色卡与插件生态，逐步形成了自己独特而鲜明的生态位

# 快速部署（Docker Compose）

因为我自己用的就是 Docker Compose，所以这部分也只介绍 Docker Compose 的部署方法。如果你用的是 Windows/Mac 本地 GUI 版本或者是 SillyTavern-Launcher，那可以直接跳过这节（不看这篇博客）

这里假设你已经有一台能用的 VPS（建议海外vps，装好 docker 和 docker compose）

1.新建目录

`mkdir sillytavern`

`cd sillytavern`

2.在文件夹内新建一个docker-compose.yml文件，里面的内容为：

```
version: "3.9"

services:
  sillytavern:
    image: ghcr.io/sillytavern/sillytavern:latest
    container_name: sillytavern
    environment:
      - SILLYTAVERN_WHITELISTMODE=false    # ❗关闭IP白名单，避免换IP被封
      - SILLYTAVERN_BASICAUTHMODE=true     # 🔐 启用基础认证
      - SILLYTAVERN_BASICAUTHUSER_USERNAME=admin # 你的用户名
      - SILLYTAVERN_BASICAUTHUSER_PASSWORD=supersecure123 # 你的密码
      - TZ=Asia/Shanghai
    ports:
      - "8000:8000"                         # 本地访问端口
    volumes:
      - ./config:/home/node/app/config
      - ./data:/home/node/app/data
      - ./plugins:/home/node/app/plugins
      - ./extensions:/home/node/app/public/scripts/extensions/third-party
    restart: unless-stopped
```

然后在该目录下运行：

```
docker compose up -d
```

打开浏览器，访问 http://<你的服务器IP>:8000，输入你设定的用户名和密码，就可以进入酒馆的大门了。

## 基本配置

这块有点懒得写了，感觉懂怎么配置模型API的人不用看，不懂的我又得截好多图写好多字做好多标记……

总之，打开页面顶栏的第二个「插头」图标页，也就是 API 设置界面。

API 类型选「聊天补全」，然后在「聊天补全来源」里，根据你用的模型平台来选。

我这边用的是自建的 Newapi 中转服务，所以选择了「自定义（兼容 OpenAI）」；如果你用的是 OpenRouter、Ollama、Mistral 之类的，可以直接选对应项。

自定义的话，只要把你服务的 Base URL 填进去，比如：

```
https://your.proxy.server/v1
```

再在下面填好 API Key，点一下「连接」，如果没问题的话，模型列表就会自动加载出来。

角色卡导入在顶栏从右往左数第一个

>其他的就自己摸索去吧，我相信你既然可以成功通过Docker compose来部署酒馆，就一定有这个智商来正常使用酒馆的！


# 相关链接

1.[酒馆官方开源地址](https://github.com/SillyTavern/SillyTavern)

2.最大的酒馆交流社区——类脑：

类脑ΟΔΥΣΣΕΙΑ永久传送邀请(开启)：https://discord.gg/6kdVgVgcRx
旅程ΟΡΙΖΟΝΤΑΣ 永久唯一邀请链接：https://discord.gg/elysianhorizon