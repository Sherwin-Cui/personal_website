// 网格系统 - 完整合并版本
// 包含GridSystem类和GridKeyboardController类

// ========== 网格系统主类 ==========
class GridSystem {
    constructor() {
        // 固定配置 - 基于MacBook 14英寸 (1470×919)
        this.config = {
            standardWidth: 1470,
            standardHeight: 919,
            marginTop: 40,
            marginRight: 20,
            marginBottom: 20,
            marginLeft: 20,
            columns: 4,
            rows: 3,
            gap: 30
        };
        
        // DOM元素
        this.overlay = null;
        this.grid = null;
        this.panel = null;
        this.panelHeader = null;
        this.mousePos = null;
        this.snapPointsContainer = null;
        this.mouseIndicator = null;
        
        // 状态
        this.isVisible = false;
        this.isPanelVisible = false;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.snapPoints = [];
        this.snapRadius = 10;
        this.isInitialized = false;
    }
    
    init() {
        if (this.isInitialized) return;

        console.log('[GridSystem] Starting initialization...');
        
        this.createElements();
        this.createGrid();
        this.createSnapPoints();
        this.bindEvents();
        
        // 延迟更新尺寸信息，确保DOM完全加载
        setTimeout(() => {
            this.updateSizeInfo();
            console.log('[GridSystem] Size info updated');
        }, 100);
        
        this.isInitialized = true;
        console.log('[GridSystem] Grid system initialized successfully');
    }
    
    createElements() {
        // 创建主覆盖层
        this.overlay = document.createElement('div');
        this.overlay.className = 'grid-overlay';
        this.overlay.id = 'gridOverlay';
        
        // 创建坐标原点指示器
        const originIndicator = document.createElement('div');
        originIndicator.className = 'grid-origin-indicator';
        const originLabel = document.createElement('span');
        originLabel.className = 'grid-origin-label';
        originLabel.textContent = '(0, 0)';
        originIndicator.appendChild(originLabel);
        
        // 创建页边距
        const margins = document.createElement('div');
        margins.className = 'grid-margins';
        
        const marginTop = document.createElement('div');
        marginTop.className = 'grid-margin-line grid-margin-top';
        const marginRight = document.createElement('div');
        marginRight.className = 'grid-margin-line grid-margin-right';
        const marginBottom = document.createElement('div');
        marginBottom.className = 'grid-margin-line grid-margin-bottom';
        const marginLeft = document.createElement('div');
        marginLeft.className = 'grid-margin-line grid-margin-left';
        
        margins.appendChild(marginTop);
        margins.appendChild(marginRight);
        margins.appendChild(marginBottom);
        margins.appendChild(marginLeft);
        
        // 创建网格
        this.grid = document.createElement('div');
        this.grid.className = 'grid-layout';
        this.grid.id = 'gridLayout';
        
        // 创建吸附点容器
        this.snapPointsContainer = document.createElement('div');
        this.snapPointsContainer.id = 'gridSnapPoints';
        
        // 组装覆盖层
        this.overlay.appendChild(originIndicator);
        this.overlay.appendChild(margins);
        this.overlay.appendChild(this.grid);
        this.overlay.appendChild(this.snapPointsContainer);
        
        // 创建信息面板
        this.createInfoPanel();
        
        // 创建鼠标坐标指示器
        this.mouseIndicator = document.createElement('div');
        this.mouseIndicator.className = 'grid-mouse-indicator';
        this.mouseIndicator.id = 'gridMouseIndicator';
        
        // 添加到页面
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.panel);
        document.body.appendChild(this.mouseIndicator);
    }
    
    createInfoPanel() {
        this.panel = document.createElement('div');
        this.panel.className = 'grid-info-panel';
        this.panel.id = 'gridInfoPanel';
        
        // 头部
        this.panelHeader = document.createElement('div');
        this.panelHeader.className = 'grid-panel-header';
        this.panelHeader.id = 'gridPanelHeader';
        
        const title = document.createElement('span');
        title.className = 'grid-panel-title';
        title.textContent = '网格系统 - MacBook布局';
        
        const closeBtn = document.createElement('div');
        closeBtn.className = 'grid-panel-close';
        closeBtn.onclick = () => this.togglePanel();
        
        this.panelHeader.appendChild(title);
        this.panelHeader.appendChild(closeBtn);
        
        // 内容区域
        const content = document.createElement('div');
        content.className = 'grid-panel-content';
        
        content.innerHTML = `
            <!-- 实时信息 -->
            <div class="grid-info-item">
                <span class="grid-info-label">鼠标坐标:</span>
                <span class="grid-info-value highlight" id="gridMousePos">0, 0</span>
            </div>
            <div class="grid-info-item">
                <span class="grid-info-label">坐标原点:</span>
                <span class="grid-info-value">左上角 (0, 0)</span>
            </div>
            
            <div class="grid-divider"></div>
            
            <!-- 画布信息 -->
            <div class="grid-info-item">
                <span class="grid-info-label">当前窗口:</span>
                <span class="grid-info-value" id="gridWindowSize">-</span>
            </div>
            <div class="grid-info-item">
                <span class="grid-info-label">标准尺寸:</span>
                <span class="grid-info-value">1470 × 919</span>
            </div>
            <div class="grid-info-item">
                <span class="grid-info-label">设备像素比:</span>
                <span class="grid-info-value" id="gridPixelRatio">-</span>
            </div>
            
            <div class="grid-divider"></div>
            
            <!-- 网格配置 -->
            <div class="grid-info-item">
                <span class="grid-info-label">网格:</span>
                <span class="grid-info-value">4列 × 3行</span>
            </div>
            <div class="grid-info-item">
                <span class="grid-info-label">间距:</span>
                <span class="grid-info-value">30px</span>
            </div>
            <div class="grid-info-item">
                <span class="grid-info-label">边距:</span>
                <span class="grid-info-value">T40 R20 B20 L20</span>
            </div>
            
            <!-- 控制按钮 -->
            <button class="grid-toggle-btn" onclick="window.GridSystem.toggleSnapPoints()">显示/隐藏吸附点</button>
        `;
        
        this.panel.appendChild(this.panelHeader);
        this.panel.appendChild(content);
        
        // 立即获取引用，因为innerHTML已经创建了元素
        requestAnimationFrame(() => {
            this.mousePos = document.getElementById('gridMousePos');
            console.log('[GridSystem] Mouse position element:', this.mousePos);
        });
    }
    
    createGrid() {
        // 创建网格单元格
        const totalCells = this.config.columns * this.config.rows;
        this.grid.innerHTML = '';
        
        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.setAttribute('data-index', i + 1);
            this.grid.appendChild(cell);
        }
    }
    
    createSnapPoints() {
        const { marginTop, marginRight, marginBottom, marginLeft, columns, rows, gap } = this.config;
        
        // 使用标准尺寸进行计算
        const viewportWidth = this.config.standardWidth;
        const viewportHeight = this.config.standardHeight;
        
        // 计算网格尺寸
        const containerWidth = viewportWidth - marginLeft - marginRight;
        const containerHeight = viewportHeight - marginTop - marginBottom;
        
        const cellWidth = (containerWidth - gap * (columns - 1)) / columns;
        const cellHeight = (containerHeight - gap * (rows - 1)) / rows;
        
        // 清空吸附点
        this.snapPoints = [];
        this.snapPointsContainer.innerHTML = '';
        
        // 1. 创建标准网格吸附点（1470×919页面）
        for (let row = 0; row <= rows; row++) {
            for (let col = 0; col <= columns; col++) {
                const x = marginLeft + col * (cellWidth + gap);
                const y = marginTop + row * (cellHeight + gap);
                
                // 调整边缘点
                const finalX = col === columns ? viewportWidth - marginRight : x;
                const finalY = row === rows ? viewportHeight - marginBottom : y;
                
                this.snapPoints.push({ x: finalX, y: finalY });
                
                // 创建可视化点（调试用）
                const point = document.createElement('div');
                point.className = 'grid-snap-point';
                point.style.left = finalX + 'px';
                point.style.top = finalY + 'px';
                this.snapPointsContainer.appendChild(point);
            }
        }
        
        // 2. 检测是否有扩展页面，添加扩展吸附点
        const appleDetailPage = document.querySelector('.apple-detail-page');
        if (appleDetailPage) {
            // 添加苹果详情页的特殊吸附点
            this.createExtendedSnapPoints();
        }
        
        console.log(`[GridSystem] Created ${this.snapPoints.length} snap points (including extended)`);
    }
    
    createExtendedSnapPoints() {
        // 苹果详情页面的关键吸附点
        const appleDetailPoints = [
            // 容器左上角和右上角
            { x: 750, y: 336 },   // 第一个容器左上角
            { x: 1469, y: 336 },  // 第一个容器右上角
            
            // 添加每个容器的关键点
            { x: 750, y: 1155 },   // 第二个容器
            { x: 750, y: 1974 },   // 第三个容器
            { x: 750, y: 2793 },   // 第四个容器
            { x: 750, y: 3612 },   // 第五个容器
            { x: 750, y: 4431 },   // 第六个容器
            { x: 750, y: 5250 },   // 第七个容器
            { x: 750, y: 6069 },   // 第八个容器
            { x: 750, y: 6888 },   // 第九个容器
            { x: 750, y: 7707 },   // 第十个容器
            { x: 750, y: 8526 },   // 第十一个容器
            { x: 750, y: 9345 },   // 第十二个容器
            { x: 750, y: 10164 },  // 第十三个容器
            { x: 750, y: 10983 },  // 第十四个容器
            { x: 750, y: 11802 },  // 第十五个容器
            { x: 1469, y: 11802 }, // 最后容器右上角
            { x: 1469, y: 12521 }, // 页面底部右边界
        ];
        
        // 添加到吸附点数组
        for (const point of appleDetailPoints) {
            this.snapPoints.push(point);
            
            // 创建可视化点（调试用）
            const visualPoint = document.createElement('div');
            visualPoint.className = 'grid-snap-point grid-snap-point-extended';
            visualPoint.style.left = point.x + 'px';
            visualPoint.style.top = point.y + 'px';
            visualPoint.style.backgroundColor = '#ff6b6b'; // 红色表示扩展点
            this.snapPointsContainer.appendChild(visualPoint);
        }
        
        console.log(`[GridSystem] Added ${appleDetailPoints.length} extended snap points for apple detail page`);
    }
    
    getSnappedPosition(x, y) {
        let minDistance = this.snapRadius;
        let snappedX = x;
        let snappedY = y;
        
        for (const point of this.snapPoints) {
            const distance = Math.sqrt(
                Math.pow(x - point.x, 2) + 
                Math.pow(y - point.y, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                snappedX = point.x;
                snappedY = point.y;
            }
        }
        
        return { x: snappedX, y: snappedY, snapped: minDistance < this.snapRadius };
    }
    
    updateSizeInfo() {
        // 窗口尺寸
        const windowSizeEl = document.getElementById('gridWindowSize');
        if (windowSizeEl) {
            windowSizeEl.textContent = `${window.innerWidth} × ${window.innerHeight}`;
        }
        
        // 设备像素比
        const pixelRatioEl = document.getElementById('gridPixelRatio');
        if (pixelRatioEl) {
            pixelRatioEl.textContent = window.devicePixelRatio.toFixed(2);
        }
    }
    
    bindEvents() {
        // 鼠标移动 - 带吸附和坐标显示
        this.mouseMoveHandler = (e) => {
            if (!this.isVisible) return;
            
            // 计算包含滚动的绝对坐标
            let absoluteX = e.clientX;
            let absoluteY = e.clientY;
            
            // 检查是否在详情页面中
            const appleDetailPage = document.querySelector('.apple-detail-page.active');
            const aiDetailPage = document.querySelector('.ai-detail-page.active');
            const designDetailPage = document.querySelector('.design-detail-page.active');
            
            if (appleDetailPage) {
                // 使用苹果详情页面的滚动位置
                absoluteX += appleDetailPage.scrollLeft;
                absoluteY += appleDetailPage.scrollTop;
            } else if (aiDetailPage) {
                // 使用AI详情页面的滚动位置
                absoluteX += aiDetailPage.scrollLeft;
                absoluteY += aiDetailPage.scrollTop;
            } else if (designDetailPage) {
                // 使用设计详情页面的滚动位置
                absoluteX += designDetailPage.scrollLeft;
                absoluteY += designDetailPage.scrollTop;
            } else {
                // 使用全局窗口滚动位置
                absoluteX += window.scrollX;
                absoluteY += window.scrollY;
            }
            
            // 应用吸附
            const snapped = this.getSnappedPosition(absoluteX, absoluteY);
            
            // 更新面板坐标显示
            const mousePosEl = document.getElementById('gridMousePos');
            if (mousePosEl) {
                mousePosEl.textContent = `Mouse: ${Math.round(snapped.x)}, ${Math.round(snapped.y)} (abs)`;
                if (snapped.snapped) {
                    mousePosEl.style.color = '#0066ff'; // 蓝色表示已吸附
                } else {
                    mousePosEl.style.color = '#ff0000'; // 红色表示正常坐标
                }
            }
            
            // 更新鼠标指示器（显示位置仍用视口坐标）
            if (this.mouseIndicator) {
                this.mouseIndicator.textContent = `${Math.round(snapped.x)}, ${Math.round(snapped.y)}`;
                this.mouseIndicator.style.left = (e.clientX + 10) + 'px';
                this.mouseIndicator.style.top = (e.clientY - 20) + 'px';
            }
        };
        
        document.addEventListener('mousemove', this.mouseMoveHandler);
        
        // 面板拖拽
        this.panelHeader.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.dragOffset.x = e.clientX - this.panel.offsetLeft;
            this.dragOffset.y = e.clientY - this.panel.offsetTop;
            this.panelHeader.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const x = e.clientX - this.dragOffset.x;
                const y = e.clientY - this.dragOffset.y;
                
                // 限制在视口内
                const maxX = window.innerWidth - this.panel.offsetWidth;
                const maxY = window.innerHeight - this.panel.offsetHeight;
                
                this.panel.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
                this.panel.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
                this.panel.style.right = 'auto';
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.panelHeader.style.cursor = 'move';
            }
        });
        
        // 窗口调整
        window.addEventListener('resize', () => {
            this.updateSizeInfo();
        });
    }
    
    // 显示网格系统
    show() {
        if (!this.isInitialized) {
            this.init();
        }
        
        this.isVisible = true;
        this.overlay.classList.add('visible');
        this.mouseIndicator.classList.add('visible');
        
        // 默认也显示信息面板
        this.isPanelVisible = true;
        this.panel.classList.add('visible');
        
        console.log('[GridSystem] Grid system shown');
    }
    
    // 隐藏网格系统
    hide() {
        this.isVisible = false;
        this.overlay.classList.remove('visible');
        this.panel.classList.remove('visible');
        this.mouseIndicator.classList.remove('visible');
        
        console.log('[GridSystem] Grid system hidden');
    }
    
    // 切换网格显示
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    // 切换信息面板
    togglePanel() {
        this.isPanelVisible = !this.isPanelVisible;
        
        if (this.isVisible && this.isPanelVisible) {
            this.panel.classList.add('visible');
        } else {
            this.panel.classList.remove('visible');
        }
    }
    
    // 切换吸附点显示
    toggleSnapPoints() {
        this.overlay.classList.toggle('show-snap-points');
    }
    
    // 获取网格信息
    getGridInfo() {
        return {
            config: this.config,
            snapPoints: this.snapPoints,
            isVisible: this.isVisible,
            isPanelVisible: this.isPanelVisible
        };
    }
}

// ========== 键盘控制器类 ==========
class GridKeyboardController {
    constructor() {
        this.isInitialized = false;
        this.keyMap = {
            // 主要功能
            'g': 'toggleGrid',           // G键：显示/隐藏网格
            'G': 'toggleGrid',
            'ctrl+g': 'toggleGrid',      // Ctrl+G：显示/隐藏网格
            'cmd+g': 'toggleGrid',       // Cmd+G：显示/隐藏网格（Mac）
            
            // 面板控制
            'i': 'togglePanel',          // I键：显示/隐藏信息面板
            'I': 'togglePanel',
            'ctrl+i': 'togglePanel',     // Ctrl+I：显示/隐藏信息面板
            'cmd+i': 'togglePanel',      // Cmd+I：显示/隐藏信息面板（Mac）
            
            // 吸附点
            's': 'toggleSnapPoints',     // S键：显示/隐藏吸附点
            'S': 'toggleSnapPoints',
            
            // 帮助和文本框
            'h': 'toggleTextBoxes',      // H键：显示/隐藏文本框
            'H': 'toggleTextBoxes',
            '?': 'showHelp',             // ?键：显示帮助信息
            
            // 退出
            'Escape': 'hideGrid'         // ESC键：隐藏网格系统
        };
        
        this.helpVisible = false;
    }
    
    toggleTextBoxes() {
        // 切换所有文本框和视觉容器边框的显示
        const isVisible = document.body.classList.toggle('show-text-boxes');
        this.showNotification(isVisible ? '文本框边框显示' : '文本框边框隐藏');
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.bindKeyboardEvents();
        this.createHelpPanel();
        
        this.isInitialized = true;
        console.log('[GridKeyboardController] Keyboard controller initialized');
    }
    
    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // 检查是否在输入框中
            if (this.isInInputField(e.target)) {
                return;
            }
            
            // 构建键组合
            const keyCombo = this.buildKeyCombo(e);
            
            // 查找对应的操作
            const action = this.keyMap[keyCombo];
            if (action) {
                e.preventDefault();
                this.executeAction(action);
            }
        });
        
        // 监听Ctrl/Cmd键组合（特殊处理）
        document.addEventListener('keydown', (e) => {
            if (this.isInInputField(e.target)) return;
            
            // Ctrl/Cmd + M：鼠标追踪模式切换
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
                e.preventDefault();
                this.toggleMouseTracking();
            }
        });
    }
    
    buildKeyCombo(e) {
        const keys = [];
        
        if (e.ctrlKey) keys.push('ctrl');
        if (e.metaKey) keys.push('cmd');
        if (e.altKey) keys.push('alt');
        if (e.shiftKey && e.key !== 'Shift') keys.push('shift');
        
        keys.push(e.key);
        
        return keys.join('+');
    }
    
    isInInputField(element) {
        const inputTypes = ['input', 'textarea', 'select'];
        return inputTypes.includes(element.tagName.toLowerCase()) ||
               element.contentEditable === 'true';
    }
    
    executeAction(action) {
        if (!window.GridSystem) {
            console.warn('[GridKeyboardController] GridSystem not available');
            return;
        }
        
        switch (action) {
            case 'toggleGrid':
                window.GridSystem.toggle();
                this.showNotification('网格系统切换');
                break;
                
            case 'togglePanel':
                window.GridSystem.togglePanel();
                this.showNotification('信息面板切换');
                break;
                
            case 'toggleSnapPoints':
                window.GridSystem.toggleSnapPoints();
                this.showNotification('吸附点切换');
                break;
                
            case 'toggleTextBoxes':
                this.toggleTextBoxes();
                break;
                
            case 'showHelp':
                this.toggleHelp();
                break;
                
            case 'hideGrid':
                window.GridSystem.hide();
                this.hideHelp();
                this.showNotification('网格系统已隐藏');
                break;
                
            default:
                console.warn(`[GridKeyboardController] Unknown action: ${action}`);
        }
    }
    
    toggleMouseTracking() {
        // 切换鼠标坐标追踪显示模式
        const indicator = document.getElementById('gridMouseIndicator');
        if (indicator) {
            const isAlwaysVisible = indicator.style.display === 'block';
            if (isAlwaysVisible) {
                indicator.style.display = '';
                this.showNotification('鼠标追踪：仅网格模式');
            } else {
                indicator.style.display = 'block';
                indicator.classList.add('visible');
                this.showNotification('鼠标追踪：始终显示');
            }
        }
    }
    
    createHelpPanel() {
        const helpPanel = document.createElement('div');
        helpPanel.id = 'gridHelpPanel';
        helpPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #ff0000;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10002;
            display: none;
            max-width: 400px;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
        `;
        
        helpPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #333;">网格系统快捷键</h3>
                <button onclick="window.GridKeyboardController.hideHelp()" style="
                    background: #ff5555;
                    border: none;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    color: white;
                    font-size: 12px;
                ">×</button>
            </div>
            
            <div style="font-size: 13px; line-height: 1.6;">
                <div style="margin-bottom: 12px;">
                    <strong style="color: #ff0000;">主要功能：</strong><br>
                    <code>G</code> 或 <code>Ctrl/Cmd+G</code> - 显示/隐藏网格<br>
                    <code>I</code> 或 <code>Ctrl/Cmd+I</code> - 显示/隐藏信息面板<br>
                    <code>S</code> - 显示/隐藏吸附点<br>
                    <code>ESC</code> - 隐藏网格系统
                </div>
                
                <div style="margin-bottom: 12px;">
                    <strong style="color: #ff0000;">鼠标追踪：</strong><br>
                    <code>Ctrl/Cmd+M</code> - 切换鼠标坐标显示模式
                </div>
                
                <div style="margin-bottom: 12px;">
                    <strong style="color: #ff0000;">文本框：</strong><br>
                    <code>H</code> - 显示/隐藏所有文本框和视觉容器边框
                </div>
                
                <div style="margin-bottom: 12px;">
                    <strong style="color: #ff0000;">帮助：</strong><br>
                    <code>?</code> - 显示/隐藏这个帮助面板
                </div>
                
                <div style="background: #f8f8f8; padding: 10px; border-radius: 4px; margin-top: 15px;">
                    <strong>网格系统说明：</strong><br>
                    • 基于MacBook 14英寸优化 (1470×919)<br>
                    • 4列×3行网格布局，30px间距<br>
                    • 自动吸附到网格交叉点<br>
                    • 实时显示精确坐标位置
                </div>
            </div>
        `;
        
        document.body.appendChild(helpPanel);
        this.helpPanel = helpPanel;
    }
    
    toggleHelp() {
        if (this.helpVisible) {
            this.hideHelp();
        } else {
            this.showHelp();
        }
    }
    
    showHelp() {
        if (this.helpPanel) {
            this.helpPanel.style.display = 'block';
            this.helpVisible = true;
        }
    }
    
    hideHelp() {
        if (this.helpPanel) {
            this.helpPanel.style.display = 'none';
            this.helpVisible = false;
        }
    }
    
    showNotification(message) {
        // 创建临时通知
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            z-index: 10003;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 动画显示
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
        });
        
        // 自动移除
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 1500);
    }
}

// ========== 全局实例和初始化 ==========
window.GridSystem = new GridSystem();
window.GridKeyboardController = new GridKeyboardController();

// 自动初始化键盘控制器
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.GridKeyboardController.init();
        console.log('[Grid] All grid components initialized');
    }, 100);
});