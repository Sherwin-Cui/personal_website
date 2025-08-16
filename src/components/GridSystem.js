// 网格系统组件
// 提供精确的坐标系统和布局辅助工具

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
        
        // 测试坐标显示
        setTimeout(() => {
            console.log('[GridSystem] Testing coordinate display...');
            const mousePosEl = document.getElementById('gridMousePos');
            console.log('[GridSystem] Mouse position element found:', mousePosEl);
        }, 200);
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
        // 但需要等待DOM更新
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
        
        // 创建吸附点（网格交叉点）
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
        
        console.log(`[GridSystem] Created ${this.snapPoints.length} snap points`);
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
            
            // 应用吸附
            const snapped = this.getSnappedPosition(e.clientX, e.clientY);
            
            // 更新面板坐标显示
            const mousePosEl = document.getElementById('gridMousePos');
            if (mousePosEl) {
                mousePosEl.textContent = `${Math.round(snapped.x)}, ${Math.round(snapped.y)}`;
                if (snapped.snapped) {
                    mousePosEl.style.color = '#0066ff'; // 蓝色表示已吸附
                } else {
                    mousePosEl.style.color = '#ff0000'; // 红色表示正常坐标
                }
            }
            
            // 更新鼠标指示器
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
    
    // 计算元素应该放置的精确坐标
    calculatePosition(description) {
        const { marginTop, marginRight, marginBottom, marginLeft, columns, rows, gap } = this.config;
        const { standardWidth, standardHeight } = this.config;
        
        const containerWidth = standardWidth - marginLeft - marginRight;
        const containerHeight = standardHeight - marginTop - marginBottom;
        const cellWidth = (containerWidth - gap * (columns - 1)) / columns;
        const cellHeight = (containerHeight - gap * (rows - 1)) / rows;
        
        // 解析位置描述
        if (description.includes('左上角')) {
            return { x: marginLeft, y: marginTop };
        }
        if (description.includes('右上角')) {
            return { x: standardWidth - marginRight, y: marginTop };
        }
        if (description.includes('中心')) {
            return { x: standardWidth / 2, y: standardHeight / 2 };
        }
        
        // 网格位置 "第X列第Y行"
        const colMatch = description.match(/第(\d+)列/);
        const rowMatch = description.match(/第(\d+)行/);
        
        if (colMatch && rowMatch) {
            const col = parseInt(colMatch[1]) - 1; // 转为0基数
            const row = parseInt(rowMatch[1]) - 1;
            
            const x = marginLeft + col * (cellWidth + gap);
            const y = marginTop + row * (cellHeight + gap);
            
            return { x, y };
        }
        
        return null;
    }
}

// 创建全局实例
window.GridSystem = new GridSystem();