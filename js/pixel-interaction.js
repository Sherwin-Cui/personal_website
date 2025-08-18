// 摄影页面像素交互动画
window.PixelInteraction = (function() {
    'use strict';
    
    let pixelGrid, isEnabled = false;
    let activePixels = new Set(); // 当前闪烁的像素
    let animationFrameId = null;
    
    // 初始化
    function init() {
        console.log('[PixelInteraction] 初始化像素交互动画');
        
        // 获取像素网格容器
        pixelGrid = document.getElementById('pixelArtGrid');
        
        if (!pixelGrid) {
            console.error('[PixelInteraction] 未找到像素网格容器');
            return;
        }
        
        // 绑定事件
        bindEvents();
        
        console.log('[PixelInteraction] 像素交互动画初始化完成');
    }
    
    // 绑定事件
    function bindEvents() {
        // 鼠标进入像素区域
        pixelGrid.addEventListener('mouseenter', handleMouseEnter);
        // 鼠标离开像素区域
        pixelGrid.addEventListener('mouseleave', handleMouseLeave);
        // 鼠标在像素区域内移动
        pixelGrid.addEventListener('mousemove', handleMouseMove);
    }
    
    // 鼠标进入
    function handleMouseEnter() {
        console.log('[PixelInteraction] 鼠标进入像素区域');
        isEnabled = true;
    }
    
    // 鼠标离开
    function handleMouseLeave() {
        console.log('[PixelInteraction] 鼠标离开像素区域');
        isEnabled = false;
        stopFlickerEffect();
    }
    
    // 鼠标移动
    function handleMouseMove(e) {
        if (!isEnabled) return;
        
        // 获取鼠标相对于像素网格的位置
        const rect = pixelGrid.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 计算鼠标所在的像素格子位置
        const pixelSize = rect.width / 48; // 48x48网格
        const gridX = Math.floor(x / pixelSize);
        const gridY = Math.floor(y / pixelSize);
        
        // 确保在网格范围内
        if (gridX >= 0 && gridX < 48 && gridY >= 0 && gridY < 48) {
            updateFlickerEffect(gridX, gridY);
        }
    }
    
    // 更新闪烁效果
    function updateFlickerEffect(centerX, centerY) {
        // 清除之前的闪烁像素
        stopFlickerEffect();
        
        // 获取中心像素和周围8个像素
        const flickerPixels = [];
        
        // 中心像素
        flickerPixels.push({ x: centerX, y: centerY });
        
        // 周围8个像素 (3x3矩阵，排除中心)
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue; // 跳过中心像素
                
                const x = centerX + dx;
                const y = centerY + dy;
                
                // 确保在网格范围内
                if (x >= 0 && x < 48 && y >= 0 && y < 48) {
                    flickerPixels.push({ x, y });
                }
            }
        }
        
        // 为这些像素添加闪烁效果
        flickerPixels.forEach(pixel => {
            const pixelElement = getPixelElement(pixel.x, pixel.y);
            if (pixelElement) {
                activePixels.add(pixelElement);
                startPixelFlicker(pixelElement);
            }
        });
    }
    
    // 获取指定位置的像素元素
    function getPixelElement(x, y) {
        // 像素网格是按行列排列的，计算索引
        const index = y * 48 + x;
        const pixels = pixelGrid.children;
        
        if (index >= 0 && index < pixels.length) {
            return pixels[index];
        }
        
        return null;
    }
    
    // 开始像素闪烁动画
    function startPixelFlicker(pixelElement) {
        // 保存原始背景色
        if (!pixelElement.dataset.originalBg) {
            const computedStyle = window.getComputedStyle(pixelElement);
            pixelElement.dataset.originalBg = computedStyle.backgroundColor;
        }
        
        // 添加闪烁类
        pixelElement.classList.add('pixel-flickering');
        
        // 开始闪烁动画循环
        flickerLoop(pixelElement);
    }
    
    // 闪烁循环动画
    function flickerLoop(pixelElement) {
        if (!activePixels.has(pixelElement)) return;
        
        // 随机闪烁间隔 (100-300ms)
        const flickerInterval = 100 + Math.random() * 200;
        
        // 闪烁效果：快速切换背景色
        const isFlickering = Math.random() < 0.7; // 70%概率闪烁
        
        if (isFlickering) {
            // 闪烁到白色或高亮色
            pixelElement.style.backgroundColor = Math.random() < 0.5 ? '#ffffff' : '#ffff00';
            
            // 短暂延迟后恢复
            setTimeout(() => {
                if (activePixels.has(pixelElement)) {
                    pixelElement.style.backgroundColor = pixelElement.dataset.originalBg || '';
                }
            }, 50 + Math.random() * 50);
        }
        
        // 继续循环
        setTimeout(() => {
            if (activePixels.has(pixelElement)) {
                flickerLoop(pixelElement);
            }
        }, flickerInterval);
    }
    
    // 停止闪烁效果
    function stopFlickerEffect() {
        // 清理所有活动像素
        activePixels.forEach(pixelElement => {
            pixelElement.classList.remove('pixel-flickering');
            pixelElement.style.backgroundColor = pixelElement.dataset.originalBg || '';
        });
        
        // 清空活动像素集合
        activePixels.clear();
        
        // 取消动画帧
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }
    
    // 公开API
    return {
        init
    };
})();

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('[PixelInteraction] 启动像素交互动画');
        window.PixelInteraction.init();
    }, 500);
});