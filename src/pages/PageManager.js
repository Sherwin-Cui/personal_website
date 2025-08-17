// 极简版页面管理器 - 抛弃所有花里胡哨，只要能切换！
window.PageManager = (function() {
    'use strict';
    
    console.log('🚀 PageManager: 极简版启动！');
    
    // ========== 核心变量 ==========
    let scrollPos = 0;  // 虚拟滚动位置
    let currentPage = -1;  // -1=Hero, 0-3=内容页
    let isAnimating = false;  // 动画锁
    let lastWheelTime = 0;  // 防抖
    
    // DOM元素
    let mainContent, contentInner, sections;
    let fill1, fill2;
    
    // ========== 初始化 ==========
    function init() {
        console.log('🎯 开始初始化...');
        
        // 获取元素
        mainContent = document.getElementById('mainContent');
        fill1 = document.getElementById('fill1');
        fill2 = document.getElementById('fill2');
        
        if (!mainContent) {
            console.error('❌ 找不到 mainContent!');
            return;
        }
        
        contentInner = mainContent.querySelector('.content-inner');
        sections = document.querySelectorAll('.content-section');
        
        console.log(`✅ 找到 ${sections.length} 个页面`);
        
        // 初始状态
        resetHero();
        
        // 绑定滚轮 - 这是最重要的！
        window.addEventListener('wheel', onWheel, { passive: false });
        console.log('🎮 滚轮事件已绑定到 window');
        
        // 绑定键盘
        document.addEventListener('keydown', onKeydown);
        
        // 返回按钮
        const backBtn = document.getElementById('backButton');
        if (backBtn) {
            backBtn.addEventListener('click', () => goToPage(-1));
        }
        
        console.log('✅ 初始化完成！当前页面:', currentPage);
    }
    
    // ========== 核心：滚轮处理 ==========
    function onWheel(e) {
        e.preventDefault();  // 阻止默认滚动
        
        // 防抖 - 动画期间不处理
        const now = Date.now();
        if (now - lastWheelTime < 800) {
            return;
        }
        
        const delta = e.deltaY;
        
        console.log(`🎲 滚轮: delta=${delta}, 当前页=${currentPage}, scrollPos=${scrollPos}`);
        
        // 在Hero页面
        if (currentPage === -1) {
            // 累加滚动值
            scrollPos += delta * 2;
            scrollPos = Math.max(0, scrollPos);
            
            // 更新文字填充
            updateHeroText();
            
            // 检查是否该进入内容
            if (scrollPos > 800) {
                console.log('📄 进入内容页面!');
                goToPage(0);
                lastWheelTime = now;
            }
        } 
        // 在内容页面
        else {
            if (Math.abs(delta) < 30) return;  // 忽略小幅度滚动
            
            if (delta > 0) {
                // 向下滚
                if (currentPage < sections.length - 1) {
                    goToPage(currentPage + 1);
                    lastWheelTime = now;
                }
            } else {
                // 向上滚
                if (currentPage > 0) {
                    goToPage(currentPage - 1);
                    lastWheelTime = now;
                } else {
                    // 返回Hero
                    goToPage(-1);
                    lastWheelTime = now;
                }
            }
        }
    }
    
    // ========== 页面切换 ==========
    function goToPage(pageIndex) {
        if (isAnimating) return;
        if (pageIndex < -1 || pageIndex >= sections.length) return;
        
        console.log(`🔄 切换: ${currentPage} -> ${pageIndex}`);
        
        isAnimating = true;
        currentPage = pageIndex;
        
        // Hero页面
        if (pageIndex === -1) {
            mainContent.classList.remove('revealed');
            mainContent.classList.remove('snap-enabled');
            
            // 重置Hero
            setTimeout(() => {
                resetHero();
                isAnimating = false;
            }, 800);
        } 
        // 内容页面
        else {
            // 首次进入内容
            if (!mainContent.classList.contains('revealed')) {
                mainContent.classList.add('revealed');
                mainContent.classList.add('snap-enabled');
                
                // 显示所有section
                sections.forEach(s => s.classList.add('visible'));
                
                // 显示返回按钮
                const backBtn = document.getElementById('backButton');
                if (backBtn) backBtn.classList.add('visible');
            }
            
            // 移动到指定页面
            if (contentInner) {
                const offset = -pageIndex * window.innerHeight;
                contentInner.style.transform = `translateY(${offset}px)`;
            }
            
            setTimeout(() => {
                isAnimating = false;
            }, 1000);
        }
    }
    
    // ========== Hero文字动画 ==========
    function updateHeroText() {
        if (!fill1 || !fill2) return;
        
        let progress1 = 0;
        let progress2 = 0;
        
        if (scrollPos <= 300) {
            progress1 = (scrollPos / 300) * 100;
        } else if (scrollPos <= 600) {
            progress1 = 100;
            progress2 = ((scrollPos - 300) / 300) * 100;
        } else {
            progress1 = 100;
            progress2 = 100;
        }
        
        setTextFill(fill1, progress1);
        setTextFill(fill2, progress2);
    }
    
    function setTextFill(element, percent) {
        const p = Math.max(0, Math.min(100, percent));
        const gradient = `linear-gradient(90deg, black ${p}%, transparent ${p}%)`;
        element.style.webkitMaskImage = gradient;
        element.style.maskImage = gradient;
    }
    
    function resetHero() {
        scrollPos = 0;
        setTextFill(fill1, 0);
        setTextFill(fill2, 0);
        
        // 隐藏内容
        sections.forEach(s => s.classList.remove('visible'));
        
        // 隐藏返回按钮
        const backBtn = document.getElementById('backButton');
        if (backBtn) backBtn.classList.remove('visible');
    }
    
    // ========== 键盘控制 ==========
    function onKeydown(e) {
        // 数字键直接跳转
        if (e.key >= '1' && e.key <= '4') {
            const page = parseInt(e.key) - 1;
            if (page < sections.length) {
                if (currentPage === -1) {
                    // 先显示内容区
                    goToPage(0);
                    setTimeout(() => goToPage(page), 100);
                } else {
                    goToPage(page);
                }
            }
        }
        
        // 方向键
        if (e.key === 'ArrowDown' && currentPage < sections.length - 1) {
            goToPage(currentPage + 1);
        }
        if (e.key === 'ArrowUp') {
            if (currentPage > 0) {
                goToPage(currentPage - 1);
            } else if (currentPage === 0) {
                goToPage(-1);
            }
        }
        
        // ESC返回
        if (e.key === 'Escape') {
            goToPage(-1);
        }
    }
    
    // ========== 公开API ==========
    return {
        init,
        goToPage,
        getCurrentPage: () => currentPage,
        debug: () => {
            console.log('📊 调试信息:', {
                currentPage,
                scrollPos,
                isAnimating,
                hasMainContent: !!mainContent,
                hasContentInner: !!contentInner,
                sectionsCount: sections?.length || 0
            });
        }
    };
})();

// ========== 启动 ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('📦 DOM加载完成');
    
    // 立即初始化，不要等
    window.PageManager.init();
    
    // 全局快捷访问
    window.pm = window.PageManager;
    
    console.log('✨ PageManager已就绪！使用 pm.debug() 查看状态');
    console.log('💡 提示: 滚动切换页面，按1-4跳转，ESC返回');
});