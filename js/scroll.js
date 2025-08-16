// 滚动管理模块
window.ScrollManager = (function() {
    let virtualScrollY = 0;
    let animationPhase = 'line1';
    let isScrollLocked = true;
    let header;
    let mainContent;
    let fill1;
    let fill2;
    let backButton;
    
    function updateTextFill(progress, element) {
        if (!element) return;
        const percentage = Math.min(100, Math.max(0, progress));
        const maskImage = `linear-gradient(90deg, black 0%, black ${percentage}%, transparent ${percentage}%, transparent 100%)`;
        element.style.webkitMaskImage = maskImage;
        element.style.maskImage = maskImage;
    }
    
    function handleWheel(e) {
        // 如果内容已显示且在顶部向上滚动，返回Hero
        if (animationPhase === 'revealed' && 
            mainContent.scrollTop === 0 && 
            e.deltaY < 0 && 
            mainContent.getAttribute('data-can-return') === 'true') {
            e.preventDefault();
            hideContent();
            return;
        }
        
        if (!isScrollLocked) {
            // 正常滚动模式
            return;
        }
        
        e.preventDefault();
        
        // 累积虚拟滚动
        const delta = e.deltaY * AppConfig.animations.scrollMultiplier;
        virtualScrollY += delta;
        virtualScrollY = Math.max(0, virtualScrollY);
        
        // 基于virtualScrollY直接计算填充进度
        if (virtualScrollY <= AppConfig.animations.line1ScrollThreshold) {
            // 第一行填充阶段：0-300
            const progress1 = (virtualScrollY / AppConfig.animations.line1ScrollThreshold) * 100;
            updateTextFill(progress1, fill1);
            updateTextFill(0, fill2);
            animationPhase = 'line1';
        } else if (virtualScrollY <= AppConfig.animations.line2ScrollThreshold) {
            // 第二行填充阶段：300-600
            updateTextFill(100, fill1); // 第一行保持满
            const progress2 = ((virtualScrollY - AppConfig.animations.line1ScrollThreshold) / 
                              (AppConfig.animations.line2ScrollThreshold - AppConfig.animations.line1ScrollThreshold)) * 100;
            updateTextFill(progress2, fill2);
            animationPhase = 'line2';
        } else {
            // 动画完成阶段：600+
            updateTextFill(100, fill1);
            updateTextFill(100, fill2);
            animationPhase = 'complete';
            
            // 等待额外滚动后显示内容：600-800
            if (virtualScrollY > AppConfig.animations.revealThreshold) {
                revealContent();
            }
        }
        
        // 更新导航栏
        if (virtualScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    function revealContent() {
        if (animationPhase === 'revealed') return;
        
        animationPhase = 'revealed';
        mainContent.classList.add('revealed');
        
        // 显示内容区块动画
        setTimeout(() => {
            const sections = mainContent.querySelectorAll('.content-section');
            sections.forEach((section, index) => {
                setTimeout(() => {
                    section.classList.add('visible');
                }, index * 200);
            });
            // 显示返回按钮
            backButton.classList.add('visible');
        }, 400);
        
        // 解锁滚动
        setTimeout(() => {
            isScrollLocked = false;
            document.body.style.overflow = 'auto'; // 允许正常滚动
            mainContent.style.overflowY = 'auto'; // 允许内容区域滚动
            
            // 监听内容区域滚动，检测是否滚动到顶部
            mainContent.addEventListener('scroll', handleContentScroll);
        }, 800);
    }
    
    function hideContent() {
        if (animationPhase !== 'revealed') return;
        
        // 移除revealed类，内容向下滑出
        mainContent.classList.remove('revealed');
        
        // 隐藏内容区块
        const sections = mainContent.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('visible');
        });
        
        // 重置状态
        setTimeout(() => {
            isScrollLocked = true;
            mainContent.style.overflowY = 'hidden';
            mainContent.scrollTop = 0;
            animationPhase = 'complete';
            virtualScrollY = AppConfig.animations.line2ScrollThreshold;
        }, 800);
    }
    
    function handleContentScroll() {
        if (!mainContent.classList.contains('revealed')) return;
        
        // 如果滚动到最顶部且继续向上滚动，返回Hero
        if (mainContent.scrollTop === 0) {
            // 标记可以返回
            mainContent.setAttribute('data-can-return', 'true');
        } else {
            mainContent.removeAttribute('data-can-return');
        }
    }
    
    // 触摸支持
    let touchStartY = 0;
    let touchDelta = 0;
    
    function handleTouchStart(e) {
        if (!isScrollLocked) return;
        touchStartY = e.touches[0].clientY;
    }
    
    function handleTouchMove(e) {
        if (!isScrollLocked) return;
        
        e.preventDefault();
        const currentY = e.touches[0].clientY;
        touchDelta = (touchStartY - currentY) * 2;
        
        // 模拟滚轮事件
        handleWheel({ 
            deltaY: touchDelta, 
            preventDefault: () => {} 
        });
        
        touchStartY = currentY;
    }
    
    function init() {
        header = document.getElementById('header');
        mainContent = document.getElementById('mainContent');
        fill1 = document.getElementById('fill1');
        fill2 = document.getElementById('fill2');
        backButton = document.getElementById('backButton');
        
        if (!header || !mainContent || !fill1 || !fill2) return;
        
        // 设置初始状态
        updateTextFill(0, fill1);
        updateTextFill(0, fill2);
        
        // 初始化内容透明度（防止闪动）
        setTimeout(() => {
            mainContent.classList.add('ready');
        }, 100);
        
        // 返回按钮点击事件
        if (backButton) {
            backButton.addEventListener('click', () => {
                if (animationPhase === 'revealed') {
                    hideContent();
                }
            });
        }
        
        // 监听滚轮事件
        window.addEventListener('wheel', handleWheel, { passive: false });
        
        // 监听触摸事件
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    
    return {
        init,
        revealContent,
        hideContent
    };
})();