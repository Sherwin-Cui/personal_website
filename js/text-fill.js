// 文字填充动画控制器
window.TextFillController = (function() {
    'use strict';
    
    // ========== 状态管理 ==========
    let fillProgress = 0; // 总填充进度：0-100
    let isInitialized = false;
    
    // DOM元素
    let fill1, fill2;
    
    // 配置
    const CONFIG = {
        scrollSensitivity: 0.05, // 大幅降低敏感度，让动画更慢
        firstLineRange: [0, 50], // 第一行填充范围
        secondLineRange: [50, 100], // 第二行填充范围
        debugMode: true // 开启调试模式查看问题
    };
    
    // ========== 初始化 ==========
    function init() {
        console.log('[TextFill] 初始化文字填充控制器');
        
        // 获取DOM元素
        fill1 = document.getElementById('fill1');
        fill2 = document.getElementById('fill2');
        
        if (!fill1 || !fill2) {
            console.error('[TextFill] 找不到文字填充元素');
            return;
        }
        
        // 设置初始状态
        setFillProgress(0);
        isInitialized = true;
        
        console.log('[TextFill] 文字填充控制器初始化完成');
    }
    
    // ========== 核心控制函数 ==========
    
    /**
     * 设置填充进度
     * @param {number} progress - 进度值 0-100
     */
    function setFillProgress(progress) {
        if (!isInitialized) return;
        
        // 限制进度范围
        progress = Math.max(0, Math.min(100, progress));
        fillProgress = progress;
        
        // 计算每行的填充百分比，保由1位小数减少计算量
        const line1Progress = Math.round(calculateLineProgress(progress, CONFIG.firstLineRange) * 10) / 10;
        const line2Progress = Math.round(calculateLineProgress(progress, CONFIG.secondLineRange) * 10) / 10;
        
        // 更新CSS mask
        updateTextMask(fill1, line1Progress);
        updateTextMask(fill2, line2Progress);
        
        // 只在整数百分比时输出日志，减少性能影响
        if (Math.floor(progress) !== Math.floor(fillProgress)) {
            console.log(`[TextFill] 更新进度: ${Math.floor(progress)}% (第一行: ${Math.floor(line1Progress)}%, 第二行: ${Math.floor(line2Progress)}%)`);
        }
    }
    
    /**
     * 计算单行的填充进度
     * @param {number} totalProgress - 总进度 0-100
     * @param {Array} range - 该行的进度范围 [start, end]
     * @returns {number} 该行的填充百分比 0-100
     */
    function calculateLineProgress(totalProgress, range) {
        const [start, end] = range;
        
        if (totalProgress <= start) {
            return 0;
        } else if (totalProgress >= end) {
            return 100;
        } else {
            // 线性插值
            return ((totalProgress - start) / (end - start)) * 100;
        }
    }
    
    /**
     * 更新文字遮罩
     * @param {HTMLElement} element - 文字元素
     * @param {number} progress - 填充进度 0-100
     */
    function updateTextMask(element, progress) {
        if (!element) return;
        
        // 缓存上次的值，避免重复设置
        if (element._lastProgress === progress) return;
        element._lastProgress = progress;
        
        // 创建渐变：从0%到progress%为黑色（显示），从progress%到100%为透明（隐藏）
        const maskImage = `linear-gradient(90deg, black 0%, black ${progress}%, transparent ${progress}%, transparent 100%)`;
        
        element.style.webkitMaskImage = maskImage;
        element.style.maskImage = maskImage;
    }
    
    /**
     * 处理滚轮事件，更新填充进度
     * @param {number} deltaY - 滚轮滚动增量
     * @returns {boolean} 是否已完成填充（可以切换页面）
     */
    function handleScroll(deltaY) {
        if (!isInitialized) return false;
        
        // 计算进度变化
        const progressDelta = deltaY * CONFIG.scrollSensitivity;
        const newProgress = fillProgress + progressDelta;
        
        // 更新进度
        setFillProgress(newProgress);
        
        // 返回是否完成填充
        return fillProgress >= 100;
    }
    
    /**
     * 重置填充进度
     */
    function reset() {
        console.log('[TextFill] 重置填充进度');
        setFillProgress(0);
    }
    
    /**
     * 设置为完全填充状态
     */
    function setComplete() {
        console.log('[TextFill] 设置为完全填充状态');
        setFillProgress(100);
    }
    
    // ========== 公开API ==========
    return {
        init,
        handleScroll,
        setFillProgress,
        reset,
        setComplete,
        getFillProgress: () => fillProgress,
        isComplete: () => fillProgress >= 100,
        isEmpty: () => fillProgress <= 0
    };
})();

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('[TextFill] 启动文字填充控制器');
        window.TextFillController.init();
    }, 100);
});