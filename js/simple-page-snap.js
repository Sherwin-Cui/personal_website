// 简化的页面吸附滚动系统
window.SimplePageSnap = (function() {
    'use strict';
    
    let isEnabled = false;
    let sections = [];
    let currentSection = 0;
    let mainContent = null;
    
    function init() {
        console.log('SimplePageSnap: 初始化');
        
        // 获取元素
        mainContent = document.getElementById('mainContent');
        if (!mainContent) {
            console.log('SimplePageSnap: 未找到mainContent');
            return;
        }
        
        sections = Array.from(document.querySelectorAll('.content-section'));
        console.log(`SimplePageSnap: 找到 ${sections.length} 个页面`);
        
        // 监听内容显示
        checkAndEnable();
        
        // 定期检查
        setInterval(checkAndEnable, 2000);
    }
    
    function checkAndEnable() {
        if (!mainContent) return;
        
        // 调试：显示当前状态
        console.log('SimplePageSnap: 检查状态', {
            hasRevealed: mainContent.classList.contains('revealed'),
            isEnabled: isEnabled,
            classList: mainContent.classList.toString()
        });
        
        if (mainContent.classList.contains('revealed') && !isEnabled) {
            console.log('SimplePageSnap: 内容已显示，启用页面吸附');
            enable();
        } else if (!mainContent.classList.contains('revealed') && isEnabled) {
            console.log('SimplePageSnap: 内容已隐藏，禁用页面吸附');
            disable();
        }
    }
    
    // 临时强制启用函数（调试用）
    function forceEnable() {
        console.log('SimplePageSnap: 强制启用页面吸附');
        enable();
    }
    
    function enable() {
        if (isEnabled || !mainContent || sections.length === 0) return;
        
        console.log('SimplePageSnap: 启用中...');
        isEnabled = true;
        
        // 添加CSS类启用页面吸附
        mainContent.classList.add('snap-enabled');
        
        // 创建指示器
        createIndicator();
        
        // 绑定滚动事件
        mainContent.addEventListener('scroll', handleScroll);
        
        console.log('SimplePageSnap: 已启用');
    }
    
    function disable() {
        if (!isEnabled) return;
        
        console.log('SimplePageSnap: 禁用中...');
        isEnabled = false;
        
        // 移除CSS类
        if (mainContent) {
            mainContent.classList.remove('snap-enabled');
            mainContent.removeEventListener('scroll', handleScroll);
        }
        
        // 隐藏指示器
        const indicator = document.getElementById('simpleIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
        
        currentSection = 0;
        console.log('SimplePageSnap: 已禁用');
    }
    
    let isScrolling = false;
    let scrollTimeout;
    
    function handleScroll() {
        if (!isEnabled || !mainContent || isScrolling) return;
        
        const scrollTop = mainContent.scrollTop;
        const windowHeight = window.innerHeight;
        const newSection = Math.round(scrollTop / windowHeight);
        
        if (newSection !== currentSection && newSection >= 0 && newSection < sections.length) {
            isScrolling = true;
            currentSection = newSection;
            
            // 强制吸附到正确位置，防止过度滚动
            mainContent.scrollTo({
                top: currentSection * windowHeight,
                behavior: 'smooth'
            });
            
            updateIndicator();
            console.log(`SimplePageSnap: 切换到页面 ${currentSection + 1}`);
            
            // 防止连续触发
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 800); // 0.8秒后允许下次切换
        }
    }
    
    function createIndicator() {
        // 删除旧的指示器
        const oldIndicator = document.getElementById('simpleIndicator');
        if (oldIndicator) {
            oldIndicator.remove();
        }
        
        if (sections.length === 0) return;
        
        const indicator = document.createElement('div');
        indicator.id = 'simpleIndicator';
        indicator.style.cssText = `
            position: fixed;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        
        for (let i = 0; i < sections.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'simple-dot';
            dot.dataset.index = i;
            dot.style.cssText = `
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(0, 0, 0, 0.5);
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            // 点击跳转
            dot.addEventListener('click', () => goToSection(i));
            
            indicator.appendChild(dot);
        }
        
        document.body.appendChild(indicator);
        updateIndicator();
    }
    
    function updateIndicator() {
        const dots = document.querySelectorAll('.simple-dot');
        dots.forEach((dot, index) => {
            if (index === currentSection) {
                dot.style.background = 'rgba(0, 0, 0, 0.8)';
                dot.style.transform = 'scale(1.2)';
            } else {
                dot.style.background = 'rgba(0, 0, 0, 0.3)';
                dot.style.transform = 'scale(1)';
            }
        });
    }
    
    function goToSection(index) {
        if (!isEnabled || !mainContent || index < 0 || index >= sections.length) return;
        
        currentSection = index;
        mainContent.scrollTo({
            top: index * window.innerHeight,
            behavior: 'smooth'
        });
        updateIndicator();
    }
    
    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (!isEnabled) return;
        
        if (e.key >= '1' && e.key <= '4') {
            const targetIndex = parseInt(e.key) - 1;
            if (targetIndex < sections.length) {
                goToSection(targetIndex);
            }
        }
    });
    
    return {
        init,
        enable,
        disable,
        goToSection,
        forceEnable,
        isEnabled: () => isEnabled
    };
})();

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 减少延迟，让页面切换更快启动
    setTimeout(() => {
        console.log('SimplePageSnap: 开始初始化');
        window.SimplePageSnap.init();
    }, 1000);
});