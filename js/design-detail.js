// 平面设计详情页面交互逻辑
window.DesignDetail = (function() {
    'use strict';
    
    let detailPage, backButton, designVisualArea, designTypewriter;
    let isDetailPageVisible = false;
    let typewriterTimeout;
    
    // 打字机状态变量 - 移到全局作用域
    let currentText = '';
    let isDeleting = false;
    let charIndex = 0;
    
    // 初始化
    function init() {
        console.log('[DesignDetail] 初始化平面设计详情页面交互');
        
        // 获取DOM元素
        detailPage = document.getElementById('designDetailPage');
        backButton = document.getElementById('designBackButton');
        designVisualArea = document.querySelector('.page[data-page="3"] .visual-area');
        designTypewriter = document.getElementById('designTypewriter');
        
        if (!detailPage || !backButton || !designVisualArea) {
            console.error('[DesignDetail] 关键DOM元素缺失');
            console.log('详情页:', detailPage);
            console.log('返回按钮:', backButton);
            console.log('视觉区域:', designVisualArea);
            return;
        }
        
        // 绑定事件
        bindEvents();
        
        console.log('[DesignDetail] 平面设计详情页面交互初始化完成');
    }
    
    // 绑定事件
    function bindEvents() {
        // 整个视觉区域点击事件
        designVisualArea.addEventListener('click', showDetailPage);
        console.log('[DesignDetail] 已绑定点击事件到视觉区域');
        
        // 返回按钮点击事件
        backButton.addEventListener('click', hideDetailPage);
    }
    
    // 显示详情页面
    function showDetailPage() {
        if (isDetailPageVisible) return;
        
        console.log('[DesignDetail] 显示平面设计详情页面');
        
        isDetailPageVisible = true;
        detailPage.classList.add('active');
        
        // 禁用页面切换系统
        if (window.PageSystem) {
            document.body.style.overflow = 'hidden';
        }
        
        // 停止视频轮播（避免背景继续播放）
        if (window.DesignCarousel) {
            window.DesignCarousel.stopCarousel();
        }
        
        // 启动打字机动画
        startTypewriter();
    }
    
    // 隐藏详情页面
    function hideDetailPage() {
        if (!isDetailPageVisible) return;
        
        console.log('[DesignDetail] 隐藏平面设计详情页面');
        
        isDetailPageVisible = false;
        detailPage.classList.remove('active');
        
        // 恢复页面切换系统
        if (window.PageSystem) {
            document.body.style.overflow = '';
        }
        
        // 重启视频轮播
        if (window.DesignCarousel) {
            window.DesignCarousel.restartCarousel();
        }
        
        // 停止打字机动画
        stopTypewriter();
    }
    
    // 打字机动画函数
    function startTypewriter() {
        if (!designTypewriter) return;
        
        // 清除之前的定时器
        if (typewriterTimeout) {
            clearTimeout(typewriterTimeout);
        }
        
        // 重置打字机状态
        currentText = '';
        isDeleting = false;
        charIndex = 0;
        
        const texts = {
            en: 'scroll to explore',
            zh: '滑动以探索'
        };
        
        function typeWriter() {
            const currentLanguage = window.LanguageManager ? window.LanguageManager.getCurrentLanguage() : 'en';
            const fullText = currentLanguage === 'zh' ? texts.zh : texts.en;
            
            if (!isDeleting) {
                // 正在输入
                currentText = fullText.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === fullText.length) {
                    // 输入完成，等待一段时间后开始删除
                    typewriterTimeout = setTimeout(() => {
                        isDeleting = true;
                        typeWriter();
                    }, 2000); // 完成后暂停2秒
                    designTypewriter.textContent = currentText;
                    return;
                }
            } else {
                // 正在删除
                currentText = fullText.substring(0, charIndex - 1);
                charIndex--;
                
                if (charIndex === 0) {
                    // 删除完成，等待一段时间后重新开始输入
                    isDeleting = false;
                    typewriterTimeout = setTimeout(() => {
                        typeWriter();
                    }, 500); // 删除后暂停0.5秒
                    designTypewriter.textContent = currentText;
                    return;
                }
            }
            
            designTypewriter.textContent = currentText;
            
            // 设置下一次执行的延迟
            const delay = isDeleting ? 50 : 100; // 删除快一些，输入慢一些
            typewriterTimeout = setTimeout(typeWriter, delay);
        }
        
        // 开始打字机动画
        typeWriter();
    }
    
    // 停止打字机动画
    function stopTypewriter() {
        if (typewriterTimeout) {
            clearTimeout(typewriterTimeout);
            typewriterTimeout = null;
        }
        
        // 重置所有状态
        currentText = '';
        isDeleting = false;
        charIndex = 0;
        
        if (designTypewriter) {
            designTypewriter.textContent = '';
        }
    }
    
    // 公开API
    return {
        init,
        showDetailPage,
        hideDetailPage,
        isVisible: () => isDetailPageVisible
    };
})();

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('[DesignDetail] 启动平面设计详情页面交互');
        window.DesignDetail.init();
    }, 300);
});