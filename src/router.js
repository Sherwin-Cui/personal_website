// 简单路由器
// 管理页面导航和状态同步

class Router {
    constructor() {
        this.currentRoute = null;
        this.routes = new Map();
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;

        this.setupRoutes();
        this.setupEventListeners();
        this.initializeCurrentRoute();
        
        this.isInitialized = true;
        console.log('[Router] Router initialized');
    }

    setupRoutes() {
        // 定义路由映射
        this.routes.set('home', {
            page: 'home',
            section: 0,
            scrollTop: 0
        });
        
        this.routes.set('apple', {
            page: 'apple',
            section: 1,
            scrollTop: window.innerHeight
        });
        
        this.routes.set('ai-coding', {
            page: 'ai-coding',
            section: 2,
            scrollTop: window.innerHeight * 2
        });
        
        this.routes.set('design', {
            page: 'design',
            section: 3,
            scrollTop: window.innerHeight * 3
        });
        
        this.routes.set('photography', {
            page: 'photography',
            section: 4,
            scrollTop: window.innerHeight * 4
        });
    }

    setupEventListeners() {
        // 监听键盘导航
        document.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });

        // 监听滚动变化
        window.addEventListener('scroll', () => {
            this.updateCurrentRouteByScroll();
        });
    }

    handleKeyNavigation(e) {
        const key = e.key;
        
        // 数字键1-4直接跳转到对应页面
        if (['1', '2', '3', '4'].includes(key)) {
            e.preventDefault();
            const routes = ['apple', 'ai-coding', 'design', 'photography'];
            this.navigateTo(routes[parseInt(key) - 1]);
        }
        
        // 方向键上下切换
        else if (key === 'ArrowUp') {
            e.preventDefault();
            this.navigatePrevious();
        }
        else if (key === 'ArrowDown') {
            e.preventDefault();
            this.navigateNext();
        }
        
        // ESC键回到首页
        else if (key === 'Escape') {
            e.preventDefault();
            this.navigateTo('home');
        }
    }

    navigateTo(routeName) {
        const route = this.routes.get(routeName);
        if (!route) {
            console.warn(`[Router] Route not found: ${routeName}`);
            return;
        }

        // 滚动到目标位置
        window.scrollTo({
            top: route.scrollTop,
            behavior: 'smooth'
        });

        // 更新当前路由
        this.currentRoute = routeName;
        
        // 通知页面管理器
        if (window.PageManager) {
            window.PageManager.switchToPage(route.page);
        }

        console.log(`[Router] Navigated to: ${routeName}`);
    }

    navigateNext() {
        const routeNames = Array.from(this.routes.keys());
        const currentIndex = routeNames.indexOf(this.currentRoute);
        const nextIndex = Math.min(currentIndex + 1, routeNames.length - 1);
        
        if (nextIndex !== currentIndex) {
            this.navigateTo(routeNames[nextIndex]);
        }
    }

    navigatePrevious() {
        const routeNames = Array.from(this.routes.keys());
        const currentIndex = routeNames.indexOf(this.currentRoute);
        const prevIndex = Math.max(currentIndex - 1, 0);
        
        if (prevIndex !== currentIndex) {
            this.navigateTo(routeNames[prevIndex]);
        }
    }

    updateCurrentRouteByScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        
        // 确定当前在哪个路由
        let newRoute = 'home';
        
        if (scrollTop >= viewportHeight * 3.5) {
            newRoute = 'photography';
        } else if (scrollTop >= viewportHeight * 2.5) {
            newRoute = 'design';
        } else if (scrollTop >= viewportHeight * 1.5) {
            newRoute = 'ai-coding';
        } else if (scrollTop >= viewportHeight * 0.5) {
            newRoute = 'apple';
        }

        if (newRoute !== this.currentRoute) {
            this.currentRoute = newRoute;
            
            // 通知页面管理器
            if (window.PageManager) {
                const route = this.routes.get(newRoute);
                if (route) {
                    window.PageManager.switchToPage(route.page);
                }
            }
        }
    }

    initializeCurrentRoute() {
        // 根据当前滚动位置确定初始路由
        this.updateCurrentRouteByScroll();
    }

    getCurrentRoute() {
        return this.currentRoute;
    }

    getAllRoutes() {
        return Array.from(this.routes.keys());
    }
}

// 创建全局实例
window.Router = new Router();