// AI Coding页面iframe处理
(function() {
    'use strict';
    
    function init() {
        const iframe = document.querySelector('.page[data-page="2"] .ai-iframe');
        const fallback = document.querySelector('.page[data-page="2"] .ai-fallback');
        
        if (!iframe || !fallback) return;
        
        // 设置iframe加载超时
        let loadTimeout = setTimeout(() => {
            console.log('[AI Coding] iframe加载超时，显示fallback');
            showFallback();
        }, 8000); // 8秒超时
        
        // iframe加载成功
        iframe.addEventListener('load', () => {
            console.log('[AI Coding] iframe加载成功');
            clearTimeout(loadTimeout);
            hideFallback();
        });
        
        // iframe加载失败
        iframe.addEventListener('error', () => {
            console.log('[AI Coding] iframe加载失败，显示fallback');
            clearTimeout(loadTimeout);
            showFallback();
        });
        
        function showFallback() {
            iframe.style.display = 'none';
            fallback.style.display = 'flex';
        }
        
        function hideFallback() {
            iframe.style.display = 'block';
            fallback.style.display = 'none';
        }
    }
    
    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(init, 1000); // 延迟1秒确保页面完全加载
    });
})();