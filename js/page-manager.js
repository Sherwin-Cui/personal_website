// 统一的页面管理系统
// 合并了 scroll.js 和 simple-page-snap.js 的所有功能
// 管理：Hero区域文字填充、页面切换、页面吸附、键盘导航

window.PageManager = (function() {
    'use strict';
    
    // ========== 配置 ==========
    // 合并 AppConfig 和本地配置
    const config = {
        animations: Object.assign({
            scrollCooldown: 1200,    // 页面切换防抖时间
            scrollThreshold: 50,     // 最小滚动触发距离
            touchThreshold: 50       // 触摸滑动阈值
        }, window.AppConfig?.animations || {
            scrollMultiplier: 2,
            line1ScrollThreshold: 300,
            line2ScrollThreshold: 600,
            revealThreshold: 800
        })
    };
    
    // ========== 状态变量 ==========
    // Hero区域相关
    let virtualScrollY = 0;
    let animationPhase = 'initial';
    let isScrollLocked = true;
    
    // 页面切换相关
    let mainContent = null;
    let contentInner = null;
    let sections = [];
    let currentSection = 0;
    let isEnabled = false;
    let isScrolling = false;
    let lastScrollTime = 0;
    
    // 触摸相关
    let touchStartY = 0;
    let touchStartTime = 0;
    let touchDelta = 0;
    
    // DOM元素
    let fill1, fill2, backButton;
    
    // ========== 初始化 ==========
    function init() {
        console.log('PageManager: 初始化统一页面管理系统');
        
        // 获取DOM元素
        fill1 = document.getElementById('fill1');
        fill2 = document.getElementById('fill2');
        backButton = document.getElementById('backButton'); // 可能不存在
        mainContent = document.getElementById('mainContent');
        
        if (!mainContent) {
            console.error('PageManager: 未找到mainContent');
            return;
        }
        
        sections = Array.from(document.querySelectorAll('.content-section'));
        console.log(`PageManager: 找到 ${sections.length} 个内容页面`);
        
        // 初始化Hero区域文字填充
        if (fill1 && fill2) {
            updateTextFill(0, fill1);
            updateTextFill(0, fill2);
        }
        
        // 立即绑定滚轮事件，统一处理所有滚轮逻辑
        document.addEventListener('wheel', handleWheel, { passive: false });
        console.log('PageManager: 滚轮事件处理已启用');
        
        // 绑定触摸事件
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // 绑定键盘导航
        document.addEventListener('keydown', handleKeydown);
        
        // 返回按钮事件
        if (backButton) {
            backButton.addEventListener('click', () => {
                returnToHero();
            });
        }
        
        // 监听内容显示状态
        checkAndEnable();
        setInterval(checkAndEnable, 5000);
        
        // 监听内容显示事件
        document.addEventListener('contentRevealed', () => {
            console.log('PageManager: 收到contentRevealed事件');
            setTimeout(() => {
                if (mainContent && mainContent.classList.contains('revealed')) {
                    enablePageSnap();
                }
            }, 1000);
        });
        
        // 初始化完成
        console.log('PageManager: 初始化完成');
    }
    
    // ========== Hero区域文字填充 ==========
    function updateTextFill(percentage, element) {
        if (!element) return;
        const maskImage = `linear-gradient(90deg, black 0%, black ${percentage}%, transparent ${percentage}%, transparent 100%)`;
        element.style.webkitMaskImage = maskImage;
        element.style.maskImage = maskImage;
    }
    
    // ========== 核心滚轮处理 ==========
    function handleWheel(e) {
        console.log('PageManager: handleWheel triggered', {
            revealed: mainContent?.classList.contains('revealed'),
            isEnabled: isEnabled,
            contentInner: !!contentInner,
            deltaY: e.deltaY
        });
        
        e.preventDefault();
        
        // 场景1：在Hero区域
        if (!mainContent.classList.contains('revealed')) {
            console.log('PageManager: 处理Hero区域滚轮');
            handleHeroWheel(e);
            return;
        }
        
        // 场景2：在内容页面
        if (isEnabled && contentInner) {
            console.log('PageManager: 处理内容页面滚轮');
            handleContentWheel(e);
        } else {
            console.log('PageManager: 页面吸附未启用或contentInner不存在');
        }
    }
    
    // 处理Hero区域的滚轮
    function handleHeroWheel(e) {
        if (!isScrollLocked) return;
        
        const delta = e.deltaY * config.animations.scrollMultiplier;
        virtualScrollY += delta;
        virtualScrollY = Math.max(0, virtualScrollY);
        
        // 基于virtualScrollY计算填充进度
        if (virtualScrollY <= config.animations.line1ScrollThreshold) {
            // 第一行填充阶段：0-300
            const progress1 = (virtualScrollY / config.animations.line1ScrollThreshold) * 100;
            updateTextFill(progress1, fill1);
            updateTextFill(0, fill2);
            animationPhase = 'line1';
        } else if (virtualScrollY <= config.animations.line2ScrollThreshold) {
            // 第二行填充阶段：300-600
            const progress2 = ((virtualScrollY - config.animations.line1ScrollThreshold) / 
                              (config.animations.line2ScrollThreshold - config.animations.line1ScrollThreshold)) * 100;
            updateTextFill(100, fill1);
            updateTextFill(progress2, fill2);
            animationPhase = 'line2';
        } else if (virtualScrollY <= config.animations.revealThreshold) {
            // 两行都填充完成，等待进入内容
            updateTextFill(100, fill1);
            updateTextFill(100, fill2);
            animationPhase = 'complete';
        } else {
            // 显示内容
            if (animationPhase !== 'revealed') {
                revealContent();
            }
        }
    }
    
    // 处理内容页面的滚轮
    function handleContentWheel(e) {
        // 防抖
        const now = Date.now();
        if (now - lastScrollTime < config.animations.scrollCooldown) return;
        
        // 判断滚动方向和强度
        if (Math.abs(e.deltaY) < config.animations.scrollThreshold) return;
        
        if (e.deltaY > 0 && currentSection < sections.length - 1) {
            scrollToSection(currentSection + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
            scrollToSection(currentSection - 1);
        } else if (e.deltaY < 0 && currentSection === 0) {
            // 在第一个页面向上滚动，返回Hero区域
            returnToHero();
        }
        
        lastScrollTime = now;
    }
    
    // ========== 页面切换 ==========
    function revealContent() {
        if (animationPhase === 'revealed') return;
        
        animationPhase = 'revealed';
        mainContent.classList.add('revealed');
        
        // 立即显示所有内容，无动画效果
        const sections = mainContent.querySelectorAll('.content-section');
        sections.forEach((section) => {
            section.classList.add('visible');
        });
        
        // 显示返回按钮
        if (backButton) {
            backButton.classList.add('visible');
        }
        
        // 通知页面吸附系统
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('contentRevealed'));
            console.log('PageManager: 发送contentRevealed事件');
        }, 800);
        
        // 解锁滚动
        setTimeout(() => {
            isScrollLocked = false;
        }, 1000);
        
        console.log('PageManager: 内容已显示');
    }
    
    function hideContent() {
        if (animationPhase !== 'revealed') return;
        
        // 移除revealed类，内容向下滑出
        mainContent.classList.remove('revealed');
        
        // 重置动画状态
        setTimeout(() => {
            animationPhase = 'initial';
            virtualScrollY = 0;
            isScrollLocked = true;
            
            // 重置文字填充
            updateTextFill(0, fill1);
            updateTextFill(0, fill2);
            
            // 隐藏内容区块
            const sections = mainContent.querySelectorAll('.content-section');
            sections.forEach(section => {
                section.classList.remove('visible');
            });
            
            // 隐藏返回按钮
            if (backButton) {
                backButton.classList.remove('visible');
            }
            
            console.log('PageManager: 已返回Hero区域');
        }, 800);
    }
    
    function returnToHero() {
        if (isScrolling) return;
        
        isScrolling = true;
        
        // 禁用页面吸附
        disablePageSnap();
        
        // 返回Hero区域
        hideContent();
        
        // 重置状态
        setTimeout(() => {
            currentSection = 0;
            isScrolling = false;
        }, 1000);
        
        console.log('PageManager: 返回Hero区域');
    }
    
    // ========== 页面吸附系统 ==========
    function checkAndEnable() {
        if (!mainContent) return;
        
        if (mainContent.classList.contains('revealed') && !isEnabled) {
            console.log('PageManager: 内容已显示，启用页面吸附');
            enablePageSnap();
        } else if (!mainContent.classList.contains('revealed') && isEnabled) {
            console.log('PageManager: 内容已隐藏，禁用页面吸附');
            disablePageSnap();
        }
    }
    
    function enablePageSnap() {
        if (isEnabled || !mainContent || sections.length === 0) return;
        
        console.log('PageManager: 启用页面吸附');
        isEnabled = true;
        
        // 获取内容容器
        contentInner = mainContent.querySelector('.content-inner');
        if (!contentInner) {
            console.error('PageManager: 未找到 .content-inner 元素');
            return;
        }
        
        // 添加CSS类
        mainContent.classList.add('snap-enabled');
        
        // 清除滚动位置
        if (mainContent.scrollTop !== 0) {
            mainContent.scrollTop = 0;
        }
        
        // 初始化位置
        currentSection = 0;
        requestAnimationFrame(() => {
            contentInner.style.transform = `translateY(0px)`;
            console.log('PageManager: 页面位置已重置');
        });
        
        console.log('PageManager: 页面吸附已启用');
    }
    
    function disablePageSnap() {
        if (!isEnabled) return;
        
        console.log('PageManager: 禁用页面吸附');
        isEnabled = false;
        
        // 移除CSS类
        if (mainContent) {
            mainContent.classList.remove('snap-enabled');
        }
        
        // 重置内容位置
        if (contentInner) {
            contentInner.style.transform = '';
        }
        
        currentSection = 0;
        contentInner = null;
        console.log('PageManager: 页面吸附已禁用');
    }
    
    function scrollToSection(index) {
        if (isScrolling || index < 0 || index >= sections.length) return;
        
        isScrolling = true;
        currentSection = index;
        
        // 使用transform实现流畅动画
        const translateY = -currentSection * window.innerHeight;
        contentInner.style.transform = `translateY(${translateY}px)`;
        
        console.log(`PageManager: 切换到页面 ${currentSection + 1}`);
        
        // 动画结束后解锁
        setTimeout(() => {
            isScrolling = false;
        }, config.animations.scrollCooldown);
    }
    
    // ========== 触摸事件处理 ==========
    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }
    
    function handleTouchMove(e) {
        if (!mainContent.classList.contains('revealed')) {
            // Hero区域的触摸处理
            if (!isScrollLocked) return;
            
            e.preventDefault();
            const currentY = e.touches[0].clientY;
            touchDelta = (touchStartY - currentY) * 2;
            
            // 模拟滚轮事件
            handleWheel({ 
                deltaY: touchDelta,
                preventDefault: () => {}
            });
        }
    }
    
    function handleTouchEnd(e) {
        if (mainContent.classList.contains('revealed') && isEnabled && contentInner) {
            // 内容页面的触摸处理
            const deltaY = touchStartY - e.changedTouches[0].clientY;
            const deltaTime = Date.now() - touchStartTime;
            const velocity = Math.abs(deltaY) / deltaTime;
            
            if (Math.abs(deltaY) > config.animations.touchThreshold || velocity > 0.5) {
                const now = Date.now();
                if (now - lastScrollTime < config.animations.scrollCooldown) return;
                
                if (deltaY > 0 && currentSection < sections.length - 1) {
                    scrollToSection(currentSection + 1);
                } else if (deltaY < 0 && currentSection > 0) {
                    scrollToSection(currentSection - 1);
                } else if (deltaY < 0 && currentSection === 0) {
                    returnToHero();
                }
                
                lastScrollTime = now;
            }
        }
    }
    
    // ========== 键盘导航 ==========
    function handleKeydown(e) {
        if (!isEnabled) return;
        
        // 数字键1-4直接跳转
        if (e.key >= '1' && e.key <= '4') {
            const targetIndex = parseInt(e.key) - 1;
            if (targetIndex < sections.length) {
                scrollToSection(targetIndex);
            }
        }
        
        // 方向键导航
        if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
            scrollToSection(currentSection + 1);
        } else if (e.key === 'ArrowUp' && currentSection > 0) {
            scrollToSection(currentSection - 1);
        } else if (e.key === 'ArrowUp' && currentSection === 0) {
            returnToHero();
        }
        
        // ESC键返回Hero
        if (e.key === 'Escape' && mainContent.classList.contains('revealed')) {
            returnToHero();
        }
    }
    
    // ========== 公开API ==========
    return {
        init,
        revealContent,
        hideContent,
        returnToHero,
        scrollToSection,
        getCurrentSection: () => currentSection,
        isPageSnapEnabled: () => isEnabled
    };
})();

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 确保配置已加载
    if (window.AppConfig) {
        console.log('PageManager: 配置已加载');
    }
    
    // 延迟初始化，确保所有资源加载完成
    setTimeout(() => {
        console.log('PageManager: 开始初始化');
        window.PageManager.init();
    }, 100);
});