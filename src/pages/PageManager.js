// 页面管理器
// 统一管理所有页面的生命周期和切换逻辑

class PageManager {
    constructor() {
        this.pages = new Map();
        this.currentPageId = null;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;

        // 注册所有页面
        this.registerPages();
        
        // 初始化所有页面
        this.initializeAllPages();
        
        this.isInitialized = true;
        console.log('[PageManager] Page manager initialized');
    }

    registerPages() {
        // 注册各个页面实例
        if (window.HomePage) {
            this.pages.set('home', window.HomePage);
        }
        
        if (window.ApplePage) {
            this.pages.set('apple', window.ApplePage);
        }
        
        if (window.AICodingPage) {
            this.pages.set('ai-coding', window.AICodingPage);
        }
        
        if (window.DesignPage) {
            this.pages.set('design', window.DesignPage);
        }
        
        if (window.PhotographyPage) {
            this.pages.set('photography', window.PhotographyPage);
        }
    }

    initializeAllPages() {
        // 初始化所有注册的页面
        this.pages.forEach((page, id) => {
            if (page && typeof page.init === 'function') {
                page.init();
                console.log(`[PageManager] Initialized page: ${id}`);
            }
        });
    }

    // 切换到指定页面
    switchToPage(pageId) {
        const currentPage = this.getCurrentPage();
        const targetPage = this.pages.get(pageId);

        if (!targetPage) {
            console.warn(`[PageManager] Page not found: ${pageId}`);
            return;
        }

        // 如果是同一页面，不需要切换
        if (this.currentPageId === pageId) {
            return;
        }

        // 离开当前页面
        if (currentPage && typeof currentPage.onLeave === 'function') {
            currentPage.onLeave();
        }

        // 进入目标页面
        if (typeof targetPage.onEnter === 'function') {
            targetPage.onEnter();
        }

        this.currentPageId = pageId;
        console.log(`[PageManager] Switched to page: ${pageId}`);
    }

    // 获取当前页面
    getCurrentPage() {
        return this.currentPageId ? this.pages.get(this.currentPageId) : null;
    }

    // 获取当前页面ID
    getCurrentPageId() {
        return this.currentPageId;
    }

    // 获取页面实例
    getPage(pageId) {
        return this.pages.get(pageId);
    }

    // 获取所有页面
    getAllPages() {
        return Array.from(this.pages.entries());
    }

    // 根据滚动位置自动检测当前页面
    detectCurrentPageByScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        
        // Hero区域
        if (scrollTop < viewportHeight) {
            this.switchToPage('home');
            return;
        }

        // 计算当前在哪个内容页面
        const contentScrollTop = scrollTop - viewportHeight;
        const pageIndex = Math.round(contentScrollTop / viewportHeight);
        
        const pageIds = ['apple', 'ai-coding', 'design', 'photography'];
        const currentPageId = pageIds[pageIndex];
        
        if (currentPageId) {
            this.switchToPage(currentPageId);
        }
    }
}

// 创建全局实例
window.PageManager = new PageManager();