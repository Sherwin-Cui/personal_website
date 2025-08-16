// 主应用程序入口文件
// 管理整个应用的生命周期和初始化

class App {
    constructor() {
        this.isInitialized = false;
        this.currentPage = null;
    }

    // 初始化应用
    async init() {
        if (this.isInitialized) return;

        try {
            // 等待DOM加载完成
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // 初始化各个模块
            this.initializeModules();
            
            this.isInitialized = true;
            console.log('[App] Application initialized successfully');
        } catch (error) {
            console.error('[App] Error initializing application:', error);
        }
    }

    // 初始化所有模块
    initializeModules() {
        // 组件初始化
        if (window.Header) {
            window.Header.init();
        }

        if (window.VideoBackground) {
            window.VideoBackground.init();
        }

        if (window.ScrollIndicator) {
            window.ScrollIndicator.init();
        }

        // 网格系统初始化（仅初始化，默认隐藏）
        if (window.GridSystem) {
            window.GridSystem.init();
        }

        if (window.GridKeyboardController) {
            window.GridKeyboardController.init();
        }

        // 页面管理器初始化
        if (window.PageManager) {
            window.PageManager.init();
        }

        // 路由器初始化
        if (window.Router) {
            window.Router.init();
        }

        // 原有系统初始化 (保持兼容)
        if (window.LanguageManager) {
            window.LanguageManager.init();
        }

        if (window.DropdownManager) {
            window.DropdownManager.init();
        }

        if (window.ScrollManager) {
            window.ScrollManager.init();
        }

        if (window.PageSnapManager) {
            window.PageSnapManager.init();
        }

        if (window.TypewriterManager) {
            window.TypewriterManager.init();
        }

        if (window.VideoManager) {
            window.VideoManager.init();
        }

        if (window.PixelArtManager) {
            window.PixelArtManager.init();
        }
    }

    // 获取当前活动页面
    getCurrentPage() {
        return this.currentPage;
    }

    // 设置当前活动页面
    setCurrentPage(page) {
        this.currentPage = page;
    }
}

// 创建全局应用实例
window.App = new App();

// 自动初始化应用
window.App.init();