// 苹果详情页面交互逻辑
window.AppleDetail = (function() {
    'use strict';
    
    let detailPage, backButton, appleImage;
    let isDetailPageVisible = false;
    
    // 初始化
    function init() {
        console.log('[AppleDetail] 初始化苹果详情页面交互');
        
        // 获取DOM元素
        detailPage = document.getElementById('appleDetailPage');
        backButton = document.getElementById('backButton');
        appleImage = document.querySelector('.page[data-page="1"] .apple-image');
        
        if (!detailPage || !backButton || !appleImage) {
            console.error('[AppleDetail] 关键DOM元素缺失');
            return;
        }
        
        // 绑定事件
        bindEvents();
        
        console.log('[AppleDetail] 苹果详情页面交互初始化完成');
    }
    
    // 绑定事件
    function bindEvents() {
        // 图片点击事件
        appleImage.addEventListener('click', showDetailPage);
        
        // 返回按钮点击事件
        backButton.addEventListener('click', hideDetailPage);
    }
    
    // 显示详情页面
    function showDetailPage() {
        if (isDetailPageVisible) return;
        
        console.log('[AppleDetail] 显示详情页面');
        
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
        
        console.log('[AppleDetail] 隐藏详情页面');
        
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
        console.log('[AppleDetail] 启动苹果详情页面交互');
        window.AppleDetail.init();
    }, 300);
});