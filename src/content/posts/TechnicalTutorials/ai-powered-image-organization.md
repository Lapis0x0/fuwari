---
title: 使用 Qwen VL 系列模型实现图片分类和OCR任务
published: 2025-01-10
description: "阿里云的通义千问（Qwen）大模型在2024年末大幅降价，尤其是Qwen-VL系列模型，为开发者提供了低成本的多模态视觉-语言处理能力。通过零样本学习，开发者无需训练即可实现图片分类和OCR任务，极大提升了工作效率。本文详细介绍了如何利用Qwen-VL进行图片分类和笔记归档整理，展示了其强大的性能和易用性。"
image: ""
tags: []
category: 深度学习
draft: false
---
阿里云的通义千问（Qwen）大模型在闭源和开源领域齐头并进，性能表现一直都非常不错。在2024年年末，Qwen-VL（Vision-Language）系列模型迎来了一次大幅降价，这对于像我这样希望利用大模型处理个人项目的开发者来说无疑是一大利好。今年年初我在进行图片分类时，主要还依赖于ResNet这类经典的卷积神经网络，然而随着多模态视觉-语言模型（VLM）的迅猛发展，加上Qwen-VL的成本优势凸显，给自己相册的几百上千张图片分类的价格成本已经可以降低至可以接受的、极具吸引力的水平。

于是，我开始着手探索如何利用这些强大的视觉语言模型（VLM）来改进自己的工作流。原本还得自己打标分类痛苦的训练微调ResNet模型，一点一点的炼丹看损失曲线是否收敛，现在可以直接借助VLM的**零样本学习能力 (Zero-Shot Learning)**，写点prompt就能让模型会意自动分类图片，甚至还能根据我的需求产出细腻的分类结果。比如，我在整理旅行照片时，可以直接告诉Qwen-VL模型：哪些照片是“日落”、“美食”、“人像”、“风景”，还可以进一步制定更加细化的类别，比如“黄昏下的海滩”或者“城市天际线中的日出”，模型都能给出相当靠谱的分类结果，完全不需要额外训练，这在几年前是不可想象的。

> 作为一名开发者，这种**易用性与强大性能兼具** 的体验堪称福音。以往在开发诸如 ResNet 或 EfficientNet 等模型时，我不得不投入大量精力进行繁琐的参数调优工作，甚至经常需要通宵进行数据标注，开发效率极其低下。然而，依托于VLM这种**性能卓越的预训练模型和便捷的推理机制** ，我**仅需构建精巧的提示词（Prompt）** ，便可通过调用阿里云开放的 API 接口，迅速实现所需的分类或分析功能。这极大地解放了生产力，使我得以将更多精力专注于核心业务逻辑的构建，而非耗费在基础模型的训练与调优上。
> 

# 第一节 使用 Qwen VL 执行图片分类任务
其实这部分原理非常简单，**因为VLM模型可以同时理解图像和文本，能很方便的进行跨模态的理解和推理**，所以我们只需要每次向模型发送图片和特定的提示词（prompt），模型就会自动分类判断输出该图片的类别，为了简化结果处理，我们只需编写一个简单的结果匹配解析模块即可。在系统架构层面，本项目采用与 OpenAI 兼容的 API 接口与 Qwen-VL 模型进行交互，并通过环境变量来管理 API 密钥及其他相关配置，确保了系统的灵活性、安全性与可维护性。

为提高分类速度，本项目支持多图片并发处理，并集成了图片预处理与压缩功能，有效平衡了处理效率与图像质量，确保系统高效稳定的运行，以下为项目在 GitHub 上的仓库地址：

::github{repo="Lapis0x0/VLMClassifier"}

## 具体处理管线
本项目的具体处理流程如下：首先对输入的图片进行精细化预处理。该步骤包括将图像尺寸统一调整至最大 1024x1024 像素，转换为 RGB 色彩空间，并使用质量系数为 85 的 JPEG 压缩算法以优化数据传输效率。

预处理完成后，系统将图片转换为 Base64 编码格式，并构建一个包含图片信息和预定义分类提示词的请求。随后，通过 API 调用 Qwen-VL-Plus 模型执行推理操作。针对模型返回的结果，项目采用深度解析策略来精确判定图像的最终类别。目前，系统预设了包括二次元、生活照片、宠物、工作和表情包在内的多个分类类别，并支持通过环境变量进行自定义类别扩展，从而满足不同用户的个性化需求。

在性能优化方面，本项目采用了线程池技术实现了多图片并发处理，并集成了完善的异常处理机制以应对各种潜在问题。此外，所有主要参数均可通过环境变量进行灵活配置，而图片优化策略则在保证处理效率的同时兼顾了图像质量。

本项目的主要优势在于：其一，依托先进的 VLM 模型，确保了对图片内容的准确理解；其二，实现了高效的并发处理机制，大幅提升了处理速度；其三，具备良好的可配置性和扩展性，方便用户根据自身需求进行定制；其四，集成了完善的图片预处理功能，在保证图像质量的同时提升了处理效率。得益于这些特性，本项目可广泛应用于批量图片分类整理、图片库管理以及自动化图片分类系统等多种场景。
## 总结
我就喜欢VLM这种简单粗暴泛用性强的解决方案，不需要过多设计效果就会非常棒。

# 第二节 使用Qwen-vl-ocr模型实现笔记归档整理
## 思路介绍
除了内容分类，Qwen vl还有一个特化分支——Qwen-vl-ocr，该模型**专门针对图像中的文字提取任务进行了优化**，它能够高效地识别并提取各种类型图像中的文字信息，包括：

- **文档:** 扫描的文档、PDF文档等
- **表格:** 各种形式的表格数据
- **试题:** 试卷、练习题等
- **手写体文字:** 手写笔记、信件等

目前，Qwen-vl-ocr模型支持多种语言，包括：**中文、英文、法文、日文、韩文、德文、俄文、意大利文、越南文和阿拉伯文** 。

:::note 
此模型的输入输出单价为5元/百万 tokens，性价比拉满
:::

因此，我们可以利用Qwen-vl-ocr模型强大的文字识别能力来实现笔记的自动化归档整理。

**具体实现步骤如下：**

1. **图像预处理**：我自己的笔记通常是多个页面拼接在一起的，因此需要对输入的图像进行必要的预处理，例如：分页、调整图像大小、灰度化、去噪等，以提高OCR模型的识别准确率。虽然Qwen VL OCR模型对图像质量有一定的鲁棒性，但良好的预处理可以进一步提升识别效果。
2. **文字提取**：将预处理后的图像输入到Qwen VL OCR模型，模型会自动识别并提取出图像中的文字信息，并以文本的形式输出。
3. **文本后处理**：模型OCR后输出的文本是非结构的，顺序不符合要求的原始文本，需要我们再调用一次其他模型进行修改润色，使其更符合我们的阅读习惯和归档需求。
4. **归档整理**： 根据提取的文本内容，结合我们的实际需求，将笔记内容归类到不同的文件夹或数据库中。例如，我们可以根据关键词、主题、日期等信息进行分类整理。

**项目地址：**

::github{repo="Lapis0x0/NoteOCR"}

## 1.笔记检测与分页——**基于边缘和轮廓的页面识别**
考虑到模型单次能“记住”的信息有限，如果直接把十几页笔记直接丢给它，识别效果恐怕会大打折扣。所以，我们需要先给笔记做个“瘦身”——检测并分好页。 这样，模型每次只需处理一页的内容，识别起来自然更轻松，结果也更准确。

我的主要检测方法目前基于经典计算机视觉技术，通过**预处理** 、**边缘检测与直线提取** 以及**页面区域识别**三个阶段来定位每一页笔记的边界。

**（1）预处理**

- **灰度转换:** 首先，我们将彩色图像转换为灰度图像。这简化了后续的处理步骤，因为我们只需要处理一个通道的信息。
    
    ```python
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    ```
    
- **CLAHE 对比度增强:** 为了应对光照不均或对比度较低的情况，我使用了**对比度受限自适应直方图均衡化 (CLAHE)** 技术。CLAHE 通过在图像的局部区域上进行直方图均衡化，有效地增强了图像的对比度，同时避免了过度放大噪声。
    - CLAHE 的数学原理可以简述为：将图像分成多个小块（tiles），对每个小块计算直方图并进行均衡化，然后使用双线性插值将结果平滑地组合起来。
    - 其核心公式为（以一个 tile 为例）：
    $$
    g = \frac{(L-1) \sum_{i=0}^{f} hist(i)}{N}
    $$
    其中：
        - $g$ 表示均衡化后的像素值。
        - $f$ 表示原始像素值。
        - $L$ 表示灰度级数（例如 256）。
        - $hist(i)$ 表示灰度级为 $i$ 的像素数量。
        - $N$ 表示 tile 内的总像素数。
    
    ```python
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)
    ```
    
- **高斯模糊降噪:** 为了消除图像中的高频噪声，我们使用高斯模糊进行平滑处理。高斯模糊的内核大小可以根据图像的噪声水平进行调整。
    - 二维高斯函数的公式为：
    $$
    G(x, y) = \frac{1}{2\pi\sigma^2}e^{-\frac{x^2+y^2}{2\sigma^2}}
    $$
    其中：
        - $(x, y)$ 表示像素坐标。
        - $\sigma$ 表示标准差，控制模糊的程度。
    
    ```python
    blurred = cv2.GaussianBlur(enhanced, (5, 5), 0)
    ```
    

**（2）边缘检测与直线提取：勾勒出页面的轮廓**

经过预处理后，我们就可以开始寻找页面的边缘了。

- **Canny 边缘检测:** 我使用了经典的 **Canny 边缘检测算法**。Canny 算法通过计算图像梯度、非极大值抑制和双阈值处理等步骤，能够有效地检测出图像中的边缘。
    
    ```python
    edges = cv2.Canny(blurred, 50, 150)
    ```
    
- **霍夫变换直线检测:** 为了进一步提取出页面边缘的直线特征，我使用了**霍夫变换**。霍夫变换可以将图像空间中的直线映射到参数空间中的点，从而检测出图像中的直线。
    - 直线在极坐标系下可以表示为：
    $$
    \rho = x\cos\theta + y\sin\theta
    $$
    其中：
        - $\rho$ 表示直线到原点的距离。
        - $\theta$ 表示直线法线与 $x$ 轴的夹角。
        - $(x, y)$ 表示直线上的点。
        - 霍夫变换通过在 $(\rho, \theta)$ 参数空间中进行投票，找出峰值点对应的直线。
    
    ```python
    lines = cv2.HoughLines(edges, 1, np.pi / 180, 200)
    ```
    
- **创建线条掩码并进行形态学处理:** 检测到的直线需要进一步处理，以形成完整的页面边界。我通过创建线条掩码，并进行**膨胀**和**腐蚀**操作，将断裂的边缘连接起来，并去除一些小的噪声。

**（3）页面区域识别：框选出每一页笔记**

有了清晰的边缘信息，我们就可以识别出每一页笔记的区域了。

- **查找轮廓:** 使用 `cv2.findContours` 函数查找图像中的轮廓。
    
    ```python
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    ```
    
- **筛选矩形区域:** 根据面积和长宽比等特征，筛选出可能是页面区域的矩形轮廓。
- **透视变换矫正:** 对于倾斜或有透视变形的页面，我们需要进行**透视变换**进行矫正。通过找到矩形区域的四个顶点，并将其映射到标准矩形的四个顶点，可以实现页面的矫正。
    - 透视变换的矩阵 $M$ 可以通过解以下方程组得到：
    $$
    \begin{bmatrix} x_i' \\ y_i' \\ 1 \end{bmatrix} = M \begin{bmatrix} x_i \\ y_i \\ 1 \end{bmatrix}
    $$
    其中：
        - $(x_i, y_i)$ 表示原始图像中的点。
        - $(x_i', y_i')$ 表示变换后图像中的对应点。
        - $i = 1, 2, 3, 4$ 表示四个顶点。
- **根据位置排序:** 最后，根据检测到的页面区域的位置，从左到右进行排序，确保页面的顺序正确。

**（4）备选方案：基于文本密度分析的页面分割**

尽管主要检测方法在大多数情况下都能取得很好的效果，但为了进一步提高系统的鲁棒性，我还设计了一个备选方案 (`_fallback_page_detection`)。当主要方法未能检测到预期数量的页面时（如未能检测到页面或页面数量不是3个），就会启用备选方案。

这个备选方案基于文本密度分析，它假设笔记页面之间存在一定的空白区域，这些区域的文本密度较低。

1. **图像二值化:** 首先，将图像进行二值化处理，将文本和背景分离。
    - 常用的二值化方法有全局阈值法和自适应阈值法，自适应阈值法公式为：
    $$
    T(x, y) = \mu(x, y) - C
    $$
    其中：
        - $T(x, y)$ 表示像素 $(x, y)$ 的阈值。
        - $\mu(x, y)$ 表示像素 $(x, y)$ 邻域的平均灰度值。
        - $C$ 是一个常数。
2. **计算水平方向的文本密度分布:** 对二值化后的图像，逐行计算像素值为前景（例如黑色）的像素数量，从而得到水平方向的文本密度分布。
3. **移动平均平滑:** 为了消除噪声的影响，使用移动平均对密度曲线进行平滑处理。
4. **寻找局部最小值:** 在平滑后的密度曲线上，寻找局部最小值。这些局部最小值通常对应于页面之间的空白区域。
5. **等距分割 (备选):** 如果找不到合适的分割点，则采用等距分割作为最后的保障。

## 反思：这个检测分页方法是最优的吗？
当然不是。我最近发现像Qwen vl和Gemini这样的模型似乎直接支持进行目标检测，输出图片后可以直接输出检测框。未来的版本可以测试直接采用vlm来进行检测分页，进一步提高本项目的健壮性。

## 2.执行OCR任务和后处理修改润色
经过处理后的笔记分页直接提交给模型进行OCR即可，以下是Qwen-vl-ocr的代码示例：

```python
import os
from openai import OpenAI

client = OpenAI(
    # 若没有配置环境变量，请用百炼API Key将下行替换为：api_key="sk-xxx",
    api_key=os.getenv("DASHSCOPE_API_KEY"),
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
)
completion = client.chat.completions.create(
    model="qwen-vl-ocr",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": "https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20241108/ctdzex/biaozhun.jpg",
                    "min_pixels": 28 * 28 * 4,
                    "max_pixels": 28 * 28 * 1280
                },
                # 为保证识别效果，目前模型内部会统一使用"Read all the text in the image."进行识别，用户输入的文本不会生效。
                {"type": "text", "text": "Read all the text in the image."},
            ]
        }
    ])

print(completion.choices[0].message.content)
```

在每一个笔记分页被送去执行OCR后，OCR的结果会送到新的LLM那里执行后处理润色。

这是我自己的润色Prompt:

```python
messages = [
	{"role": "system", "content": "你是一个专业的笔记整理助手。你需要帮助整理和优化OCR识别出的课堂笔记内容，使其更加清晰、结构化，并保持原有的重点标记。请注意，你应该只输出整理后的笔记内容，不要包含任何其他信息。"},
	{"role": "user", "content": f"""请帮我整理以下课堂笔记内容，要求：
1. 保持原有的结构和格式
2. 保留所有重点标记
3. 修正明显的OCR错误（比如不合理的人名、称呼和名词等）
4. 优化段落和缩进
5. 确保数学公式和符号的正确性
```

模型我一般会用Deepseek v3或者gpt-4o-1120。

最后，程序会自动将各个分页ocr润色后的结果合并到一份markdown文件里输出。

:::note
下一篇博客可能会解读一下Qwen vl的技术报告，并且探索使用Qwen vl/Gemini进行笔记检测分页
:::