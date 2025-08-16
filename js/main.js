// 主初始化模块
(function() {
    // 初始化所有模块
    function init() {
        // 初始化语言管理
        if (window.LanguageManager) {
            window.LanguageManager.init();
        }
        
        // 初始化下拉菜单
        if (window.DropdownManager) {
            window.DropdownManager.init();
        }
        
        // 暂时完全禁用原有ScrollManager，使用新的页面吸附系统
        // if (window.ScrollManager) {
        //     window.ScrollManager.init();
        // }
        
        // 初始化打字机动画
        if (window.TypewriterManager) {
            window.TypewriterManager.init();
        }
        
        // 初始化视频管理
        if (window.VideoManager) {
            window.VideoManager.init();
        }
        
        // 初始化像素艺术
        if (window.PixelArtManager) {
            window.PixelArtManager.init();
        }
        
        
    }
    
    // 启动应用
    document.addEventListener('DOMContentLoaded', init);
})();