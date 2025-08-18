// AI Coding详情页面交互逻辑
window.AiDetail = (function() {
    'use strict';
    
    let detailPage, backButton, aiVisualArea;
    let isDetailPageVisible = false;
    
    // 初始化
    function init() {
        console.log('[AiDetail] 初始化AI Coding详情页面交互');
        
        // 获取DOM元素
        detailPage = document.getElementById('aiDetailPage');
        backButton = document.getElementById('aiBackButton');
        aiVisualArea = document.querySelector('.page[data-page="2"] .visual-area');
        
        if (!detailPage || !backButton || !aiVisualArea) {
            console.error('[AiDetail] 关键DOM元素缺失');
            console.log('详情页:', detailPage);
            console.log('返回按钮:', backButton);
            console.log('视觉区域:', aiVisualArea);
            return;
        }
        
        // 绑定事件
        bindEvents();
        
        console.log('[AiDetail] AI Coding详情页面交互初始化完成');
    }
    
    // 绑定事件
    function bindEvents() {
        // 整个视觉区域点击事件
        aiVisualArea.addEventListener('click', showDetailPage);
        console.log('[AiDetail] 已绑定点击事件到视觉区域');
        
        // 返回按钮点击事件
        backButton.addEventListener('click', hideDetailPage);
    }
    
    // 显示详情页面
    function showDetailPage() {
        if (isDetailPageVisible) return;
        
        console.log('[AiDetail] 显示AI Coding详情页面');
        
        isDetailPageVisible = true;
        detailPage.classList.add('active');
        
        // 禁用页面切换系统
        if (window.PageSystem) {
            document.body.style.overflow = 'hidden';
        }
    }
    
    // 隐藏详情页面
    function hideDetailPage() {
        if (!isDetailPageVisible) return;
        
        console.log('[AiDetail] 隐藏AI Coding详情页面');
        
        isDetailPageVisible = false;
        detailPage.classList.remove('active');
        
        // 恢复页面切换系统
        if (window.PageSystem) {
            document.body.style.overflow = '';
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
        console.log('[AiDetail] 启动AI Coding详情页面交互');
        window.AiDetail.init();
    }, 300);
});