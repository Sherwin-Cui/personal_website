# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static personal portfolio website with interactive animations and multi-language support. No build process or server required - simply open `index.html` in a browser.

## 一些开发规则

### 规则0：MacBook尺寸优先开发

【重要原则】
- 所有布局调整和精确定位都基于MacBook屏幕尺寸进行
- **设计尺寸参考：14英寸 MacBook (3024×1964)**
- 所有像素级定位都以此为准，适配其他设备的工作后续单独处理
- 网格系统、标尺系统都基于MacBook尺寸进行标定

【坐标系统】
- **坐标基准：每个功能页面完全与屏幕对齐时的坐标**
- 第一个功能区块滑动到与屏幕完全对齐后，以该页面左上角为(0,0)
- **标准窗口尺寸：1470 × 919像素**（绝对布局基准）
- 使用内置网格系统实时查看坐标位置

【网格系统详细规格】
- **画布尺寸**：1470 × 919px
- **边距 (Margins)**：上40px，右20px，下20px，左20px
- **可用区域**：1430 × 859px（去掉边距后）
- **网格布局**：4列 × 3行 = 12个格子
- **列间距/行间距 (Gutters)**：30px
- **单个格子尺寸**：335px × 266.33px

【格子编号和坐标】
```
格子编号布局：
Row 1: [ 1] [ 2] [ 3] [ 4]
Row 2: [ 5] [ 6] [ 7] [ 8]  
Row 3: [ 9] [10] [11] [12]

各格子左上角坐标：
格子1: (20, 40)      格子2: (375, 40)     格子3: (730, 40)     格子4: (1085, 40)
格子5: (20, 336.33)  格子6: (375, 336.33) 格子7: (730, 336.33) 格子8: (1085, 336.33)
格子9: (20, 632.66)  格子10:(375, 632.66) 格子11:(730, 632.66) 格子12:(1085, 632.66)

各格子右下角坐标：
格子1: (355, 306.33)    格子2: (710, 306.33)    格子3: (1065, 306.33)   格子4: (1420, 306.33)
格子5: (355, 602.66)    格子6: (710, 602.66)    格子7: (1065, 602.66)   格子8: (1420, 602.66)
格子9: (355, 898.99)    格子10:(710, 898.99)    格子11:(1065, 898.99)   格子12:(1420, 898.99)
```

【关键参考线坐标】
- **左边距线**：x = 20
- **第1列右边界**：x = 355
- **第2列左边界**：x = 375
- **第2列右边界**：x = 710
- **第3列左边界**：x = 730
- **第3列右边界**：x = 1065
- **第4列左边界**：x = 1085
- **右边距线**：x = 1450

- **上边距线**：y = 40
- **第1行下边界**：y = 306.33
- **第2行上边界**：y = 336.33
- **第2行下边界**：y = 602.66
- **第3行上边界**：y = 632.66
- **下边距线**：y = 899

【网格系统快捷键】：
  - **G键** 或 **Ctrl/Cmd + G**：显示/隐藏网格系统
  - **I键** 或 **Ctrl/Cmd + I**：显示/隐藏信息面板
  - **Ctrl/Cmd + M**：切换鼠标追踪显示模式
  - **S键**：显示/隐藏吸附点
  - **H键** 或 **?键**：显示快捷键帮助
  - **ESC键**：隐藏网格系统

【开发注意事项】
- 布局指令中的坐标都基于MacBook 14英寸屏幕
- 响应式适配暂时不考虑，专注MacBook下的精确布局
- 所有UI测试都在MacBook环境下进行验证

## 一些开发规则

### 规则1：功能优先，样式延后

【应该做】
- 默认使用极简UI：白色背景、灰色边框、黑色文字
- 只使用基础HTML元素和最简单的CSS
- 布局使用简单的flexbox或grid，不添加任何装饰性样式
- 按钮就是简单的矩形框+文字

【不应该做】
- 未经要求不添加：阴影、渐变、动画、过渡效果、圆角、hover效果
- 不使用任何颜色（除黑白灰外）
- 不添加图标、装饰性元素

### 规则2：明确的z-index管理系统

【应该做】
- 建立标准层级系统：
  * 背景层：z-index: 0-10
  * 内容层：z-index: 100-200  
  * 交互层：z-index: 300-400
  * 弹窗层：z-index: 1000+
- 每次添加元素时明确说明其所属层级
- 使用相对定位而非绝对定位（除非必要）

【验证方法】
在每次涉及层级调整时，列出当前所有元素的z-index清单规则3：简化的Git提交策略

### 规则3: 当用户要求提交远程仓库时

【token】
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

【标准流程】
1. "将本地所有文件强制推送到远程仓库，完全覆盖远程版本"
2. "不需要对比差异，直接用本地版本替换"
3. "使用 git push --force-with-lease 命令"

【禁止行为】
- 不要从远程拉取代码来修改本地
- 不要进行文件对比
- 不要尝试合并冲突

【安全提示词】
"本地代码是最新版本，直接覆盖远程，不需要保留远程的任何更改"

### 规则4：最小化调试输出

【应该做】
- 只在关键节点输出单行日志
- 使用条件断点而非大量console.log
- 调试信息格式：[时间戳][位置][值]
- 每个函数最多1-2个调试点

【不应该做】
- 不创建独立的调试页面
- 不输出整个对象（只输出关键属性）
- 不在循环中添加日志

【示例】
替代："console.log('data:', data)"
使用："console.log(`[${Date.now()}] getData: ${data.id}`);"


### 规则5：严格的代码清理机制

【每次修改前】
1. "先列出所有相关的旧代码位置"
2. "明确标记哪些需要删除，哪些需要保留"
3. "新代码添加前，先删除冲突的旧代码"

【CSS特别注意】
- 添加新样式前，搜索是否有同名选择器
- 使用更具体的类名避免冲突
- 采用BEM命名规范

【验证步骤】
"修改完成后，列出所有被删除和新增的代码块"

### 规则6：模块化开发策略

【文件组织】
- 每个功能模块独立文件，不超过300行
- 共享变量集中在config.js
- 使用明确的命名空间

【增量开发原则】
1. "保持现有功能不变"
2. "新功能在独立模块中开发"
3. "完成后再进行集成"

### 规则7: 对齐操作原则

【元素移动时保持】
- 宽度、高度（除非明确要求调整）
- 内部布局（文字居中、内边距等）
- 字体大小、颜色等样式
- 元素的形状和比例

【仅改变】
- 位置（left, top, margin, transform: translate）
- 不影响元素本身尺寸的定位属性

【标准对齐指令解析】
"将X与Y左对齐" = 只调整X的左边界位置，保持X的宽度
"将X移动到Y" = 只改变X的位置，不改变X的尺寸
"将X对齐到网格线" = 移动X整体，不拉伸或压缩X

### 规则8: 全屏分页滚动布局系统

【核心架构原则】
- **页面间：相对布局** - 各页面之间使用相对定位进行排列
- **页面内：绝对布局** - 页面内所有元素使用绝对定位布局
- **元素相对静止** - 页面切换时，页面内元素与页面保持相对位置不变

【页面结构定义】
1. **Hero Zone**: 保持独立，含文字填充动画
2. **功能页面**: 01-04共4个独立全屏页面，每个高度=100vh
3. **切换方式**: 吸附滚动，不允许停留在页面中间位置

【布局实现规则】
- 页面容器高度：400vh（4个页面×100vh）
- 页面定位：
  ```css
  .content-section:nth-child(1) { top: 0; }
  .content-section:nth-child(2) { top: 100vh; }
  .content-section:nth-child(3) { top: 200vh; }
  .content-section:nth-child(4) { top: 300vh; }
  ```
- 页面内元素：
  ```css
  .feature-grid {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
  }
  ```

【滚动行为规则】
- **吸附滚动**：启用 `scroll-snap-type: y mandatory`
- **平滑过渡**：800ms 动画时间
- **防止中间停留**：`scroll-snap-align: start` + `scroll-snap-stop: always`

【交互方式】
- 鼠标滚轮：上下切换页面
- 键盘导航：1-4数字键直接跳转，↑↓方向键顺序切换
- 页面指示器：右侧圆点，点击跳转
- 返回按钮：回到Hero Zone

【文件组织】
- 样式：`css/page-snap-fixed.css`
- 逻辑：`js/page-snap-fixed.js`
- 与原有动画系统协同工作，不破坏Hero Zone的填充动画

【重要约束】
- 页面切换时元素位置必须保持稳定，不允许位置突变
- 每个页面必须完全填满屏幕（100vh）
- 页面间不能有连续滚动，必须吸附到完整页面


## Architecture

### Core Files

1. **index.html** - Main portfolio site
   - Single-file architecture with embedded CSS and JavaScript
   - ~1900 lines containing all styles, HTML structure, and scripts
   - No external dependencies or frameworks

2. **pixel-art-optimized.html** - Static pixel art display
   - Standalone page with grid-based CSS pixel art
   - Uses pre-calculated color indices for optimized rendering

### Key Features & Implementation

#### Video Background System
- **Location**: `Video2/` directory contains 6 MP4 videos (1.mp4 - 6.mp4)
- **Behavior**: Auto-cycles through videos with fade transitions
- **Critical Sizing Fix**: Videos have 3:2 aspect ratio. Container uses:
  ```css
  width: min(50vw, calc((100vh - 56px) * 2 / 3));
  height: calc(100vh - 56px);
  ```
  This prevents cropping when browser width increases.

#### Text Fill Animation on Scroll
- Gray stroke text fills to black as user scrolls
- Implementation: CSS mask with gradient adjusted via JavaScript based on scroll position
- Located in `.text-fill` class with mask-image linear gradient

#### Multi-Language Support
- Toggle between English and Chinese via navigation button
- Implementation: `data-en` and `data-zh` attributes on elements
- Font switching: Courier Prime (English) ↔ Noto Serif SC (Chinese)
- Body class toggle: `body.chinese` applies Chinese font family

#### Navigation System
- Fixed header with dropdown menus
- Hover state: `#3398fe` (bright blue)
- Z-index hierarchy:
  - Navigation: 1000
  - Dropdown overlay: 999
  - Video container: 10
  - Main content: 2

### JavaScript Behaviors

- **Smooth scrolling**: Custom scroll handling between sections
- **Video lifecycle**: Preloading, playback control, and transition management
- **Language switching**: Updates all text content and fonts dynamically
- **Dropdown menus**: Mouse hover interactions with overlay system

## Common Development Tasks

### Viewing the Site
```bash
open index.html
```

### Key Modification Points

- **Colors**: Search for `#3398fe` (primary blue), `var(--color-*)` CSS variables
- **Videos**: Replace files in `Video2/` directory (maintain 1-6.mp4 naming)
- **Fonts**: Local font files in `fonts/` directory
- **Language content**: Update `data-en` and `data-zh` attributes
- **Animation timing**: Modify animation durations in CSS `@keyframes` rules

## Technical Constraints

- Pure static HTML/CSS/JS - no build tools, bundlers, or transpilation
- All styles and scripts embedded in HTML files
- Videos must be MP4 format for browser compatibility
- Font files loaded locally (no CDN dependencies)
- No external libraries or frameworks