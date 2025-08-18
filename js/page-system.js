// 页面切换系统 - 简化版本
window.PageSystem = (function() {
    'use strict';
    
    // ========== 状态管理 ==========
    let currentPage = -1; // -1: Hero, 0-3: 页面1-4
    let isTransitioning = false;
    let lastScrollTime = 0;
    let isInPageMode = false;
    let isFillingText = false; // 是否正在进行文字填充
    let scrollAccumulator = 0; // 滚动累积器
    let scrollTimeout = null; // 滚动超时定时器
    let lastPageSwitchTime = 0; // 上次页面切换时间
    
    // DOM元素
    let pageContainer, pageInner, pages;
    
    // 配置
    const CONFIG = {
        cooldownTime: 300, // 页面切换冷却时间
        scrollThreshold: 50, // 滚动累积阈值
        transitionDuration: 1000,
        totalPages: 4,
        fillScrollThreshold: 1 // 文字填充时的滚动阈值（几乎不设阈值）
    };
    
    // ========== 初始化 ==========
    function init() {
        console.log('[PageSystem] 初始化页面切换系统');
        
        // 获取DOM元素
        pageContainer = document.getElementById('pageContainer');
        pageInner = document.getElementById('pageInner');
        pages = document.querySelectorAll('.page');
        
        if (!pageContainer || !pageInner || pages.length === 0) {
            console.error('[PageSystem] 关键DOM元素缺失');
            return;
        }
        
        console.log(`[PageSystem] 找到 ${pages.length} 个页面`);
        
        // 初始状态
        setupInitialState();
        
        // 绑定事件
        bindEvents();
        
        console.log('[PageSystem] 页面切换系统初始化完成');
    }
    
    function setupInitialState() {
        // 页面容器初始隐藏在下方
        pageContainer.classList.remove('active');
        pageInner.style.transform = 'translateY(0)';
        
        currentPage = -1;
        isInPageMode = false;
        
        console.log('[PageSystem] 初始状态设置完成');
    }
    
    // ========== 事件绑定 ==========
    function bindEvents() {
        document.addEventListener('wheel', handleWheel, { passive: false });
        document.addEventListener('keydown', handleKeydown);
    }
    
    // ========== 核心滚轮处理 ==========
    function handleWheel(e) {
        // 检查是否在苹果详情页面
        if (window.AppleDetail && window.AppleDetail.isVisible()) {
            return; // 苹果详情页面激活时不处理滚轮事件
        }
        
        // 检查是否在AI详情页面
        if (window.AiDetail && window.AiDetail.isVisible()) {
            return; // AI详情页面激活时不处理滚轮事件
        }
        
        // 检查是否在设计详情页面
        if (window.DesignDetail && window.DesignDetail.isVisible()) {
            return; // 设计详情页面激活时不处理滚轮事件
        }
        
        e.preventDefault();
        
        const now = Date.now();
        const isScrollingDown = e.deltaY > 0;
        
        console.log(`[PageSystem] 滚轮事件: isInPageMode=${isInPageMode}, isFillingText=${isFillingText}, deltaY=${e.deltaY}`);
        
        if (!isInPageMode) {
            // 在Hero区域：处理文字填充
            handleHeroScroll(e.deltaY, now);
        } else {
            // 在页面系统中：处理页面切换
            handlePageScroll(e.deltaY, now, isScrollingDown);
        }
        
        lastScrollTime = now;
    }
    
    // 处理Hero区域滚动（文字填充）
    function handleHeroScroll(deltaY, now) {
        // 文字填充模式下几乎取消所有限制
        if (Math.abs(deltaY) < CONFIG.fillScrollThreshold) return;
        if (now - lastScrollTime < 16) return; // 约60fps的更新频率
        
        // 使用文字填充控制器
        if (window.TextFillController) {
            // 正常模式：允许双向滚动
            const isComplete = window.TextFillController.handleScroll(deltaY);
            console.log(`[PageSystem] Hero滚动: deltaY=${deltaY}, 进度=${window.TextFillController.getFillProgress()}%, 完成=${isComplete}`);
            
            // 填充完成且继续向下滚动时，进入页面模式
            if (isComplete && deltaY > 0) {
                console.log('[PageSystem] 文字填充完成，准备进入页面模式');
                // 缩短冷却时间，让切换更快
                if (!isTransitioning && now - lastPageSwitchTime > 100) {
                    enterPageMode();
                }
            }
        }
    }
    
    // 处理页面系统滚动
    function handlePageScroll(deltaY, now, isScrollingDown) {
        if (isTransitioning) {
            console.log('[PageSystem] 正在转场中，忽略滚动');
            return;
        }
        
        // 累积滚动量
        scrollAccumulator += deltaY;
        console.log(`[PageSystem] 滚动累积: ${scrollAccumulator}, 当前页面: ${currentPage}`);
        
        // 设置超时重置：如果500ms内没有继续滚动，则重置累积器
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            scrollAccumulator = 0;
            console.log('[PageSystem] 滚动累积器超时重置');
        }, 500);
        
        // 检查是否达到阈值
        if (Math.abs(scrollAccumulator) < CONFIG.scrollThreshold) {
            return; // 继续累积
        }
        
        // 检查页面切换冷却时间（与滚动时间分开）
        if (now - lastPageSwitchTime < CONFIG.cooldownTime) {
            console.log(`[PageSystem] 页面切换冷却期内，剩余${CONFIG.cooldownTime - (now - lastPageSwitchTime)}ms`);
            return;
        }
        
        // 确定滚动方向
        const accumulatedDirection = scrollAccumulator > 0;
        
        if (accumulatedDirection) {
            // 向下：下一页
            console.log(`[PageSystem] 累积向下滚动，当前页面${currentPage}，总页数${CONFIG.totalPages}`);
            if (currentPage < CONFIG.totalPages - 1) {
                goToPage(currentPage + 1);
                scrollAccumulator = 0; // 重置累积器
                lastPageSwitchTime = now; // 更新页面切换时间
            } else {
                console.log('[PageSystem] 已经是最后一页，无法继续向下');
                scrollAccumulator = 0; // 重置累积器
            }
        } else {
            // 向上：上一页或返回Hero
            console.log(`[PageSystem] 累积向上滚动，当前页面${currentPage}`);
            if (currentPage > 0) {
                goToPage(currentPage - 1);
                scrollAccumulator = 0; // 重置累积器
                lastPageSwitchTime = now; // 更新页面切换时间
            } else {
                console.log('[PageSystem] 从第一页返回Hero');
                exitPageMode();
                scrollAccumulator = 0; // 重置累积器
                lastPageSwitchTime = now; // 更新页面切换时间
            }
        }
    }
    
    // ========== 页面切换函数 ==========
    function enterPageMode() {
        if (isInPageMode) return;
        
        console.log('[PageSystem] 进入页面模式（上拉动画）');
        
        isTransitioning = true;
        isInPageMode = true;
        currentPage = 0;
        
        // 设置文字为完全填充状态
        if (window.TextFillController) {
            window.TextFillController.setComplete();
        }
        
        // 显示页面容器（上拉动画）
        pageContainer.classList.add('active');
        
        // 切换到第一页
        pageInner.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            isTransitioning = false;
        }, CONFIG.transitionDuration);
    }
    
    function exitPageMode() {
        if (!isInPageMode) return;
        
        console.log('[PageSystem] 退出页面模式，返回Hero（下滑动画）');
        
        isTransitioning = true;
        isInPageMode = false; // 重要：标记已经不在页面模式中
        currentPage = -1;
        
        // 重要：返回时保持文字为完全填充状态，不进入褪去模式
        if (window.TextFillController) {
            window.TextFillController.setComplete(); // 确保文字为满的状态
        }
        isFillingText = false; // 返回正常模式，允许双向滚动
        
        // 隐藏页面容器（下滑动画）
        pageContainer.classList.remove('active');
        
        // 重置到第一页位置
        setTimeout(() => {
            pageInner.style.transform = 'translateY(0)';
        }, CONFIG.transitionDuration);
        
        setTimeout(() => {
            isTransitioning = false;
            console.log('[PageSystem] 退出动画完成，文字为满状态，允许双向滚动');
        }, CONFIG.transitionDuration);
    }
    
    function goToPage(pageIndex) {
        if (!isInPageMode || isTransitioning) return;
        if (pageIndex < 0 || pageIndex >= CONFIG.totalPages) return;
        
        console.log(`[PageSystem] 切换到页面 ${pageIndex + 1}`);
        
        isTransitioning = true;
        currentPage = pageIndex;
        
        
        // 平滑切换：每页向上偏移919px
        const translateY = -pageIndex * 919;
        pageInner.style.transform = `translateY(${translateY}px)`;
        
        setTimeout(() => {
            isTransitioning = false;
        }, CONFIG.transitionDuration);
    }
    
    // ========== 键盘导航 ==========
    function handleKeydown(e) {
        // 检查是否在苹果详情页面
        if (window.AppleDetail && window.AppleDetail.isVisible()) {
            return; // 详情页面激活时不处理键盘事件
        }
        
        // ESC：返回Hero
        if (e.key === 'Escape') {
            if (isInPageMode) {
                exitPageMode();
            }
            return;
        }
        
        // 数字键1-4：直接跳转
        if (e.key >= '1' && e.key <= '4') {
            const targetPage = parseInt(e.key) - 1;
            if (targetPage < CONFIG.totalPages) {
                if (!isInPageMode) {
                    enterPageMode();
                    setTimeout(() => goToPage(targetPage), 300);
                } else {
                    goToPage(targetPage);
                }
            }
            return;
        }
        
        // 方向键
        if (e.key === 'ArrowDown') {
            if (!isInPageMode) {
                enterPageMode();
            } else if (currentPage < CONFIG.totalPages - 1) {
                goToPage(currentPage + 1);
            }
        } else if (e.key === 'ArrowUp') {
            if (isInPageMode) {
                if (currentPage > 0) {
                    goToPage(currentPage - 1);
                } else {
                    exitPageMode();
                }
            }
        }
    }
    
    // ========== 公开API ==========
    return {
        init,
        enterPageMode,
        exitPageMode,
        goToPage,
        getCurrentPage: () => currentPage,
        isInPageMode: () => isInPageMode,
        isTransitioning: () => isTransitioning
    };
})();

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('[PageSystem] 启动页面切换系统');
        window.PageSystem.init();
    }, 200);
});