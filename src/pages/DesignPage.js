// 平面设计页面 (页面03)
// 管理"Graphic design works"页面和像素艺术的逻辑

class DesignPage {
    constructor() {
        this.pageElement = null;
        this.featureGrid = null;
        this.pixelArtContainer = null;
        this.isInitialized = false;
        this.isVisible = false;
    }

    init() {
        if (this.isInitialized) return;

        // 获取页面03的元素
        this.pageElement = document.querySelector('.content-section:nth-child(3)');
        
        if (this.pageElement) {
            this.featureGrid = this.pageElement.querySelector('.feature-grid');
            this.pixelArtContainer = this.pageElement.querySelector('.pixel-art-container');
            this.setupPageElements();
            this.isInitialized = true;
            console.log('[DesignPage] Design page initialized');
        }
    }

    setupPageElements() {
        // 设置像素艺术相关的交互
        if (this.pixelArtContainer) {
            this.setupPixelArtInteractions();
        }
    }

    setupPixelArtInteractions() {
        // 像素艺术的交互逻辑
        this.pixelArtContainer.addEventListener('click', () => {
            this.onPixelArtClick();
        });
    }

    onPixelArtClick() {
        console.log('[DesignPage] Pixel art clicked');
        // 可以添加像素艺术的交互效果
    }

    // 页面进入视图时调用
    onEnter() {
        if (!this.isVisible) {
            this.isVisible = true;
            this.animateIn();
            this.initializePixelArt();
            console.log('[DesignPage] Page entered view');
        }
    }

    // 页面离开视图时调用
    onLeave() {
        if (this.isVisible) {
            this.isVisible = false;
            this.animateOut();
            console.log('[DesignPage] Page left view');
        }
    }

    // 初始化像素艺术
    initializePixelArt() {
        if (window.PixelArtManager && this.pixelArtContainer) {
            // 确保像素艺术在页面可见时才初始化
            setTimeout(() => {
                window.PixelArtManager.init();
            }, 300);
        }
    }

    // 进入动画
    animateIn() {
        if (this.featureGrid) {
            this.featureGrid.style.opacity = '1';
        }
    }

    // 离开动画
    animateOut() {
        if (this.featureGrid) {
            this.featureGrid.style.opacity = '1';
        }
    }

    // 获取页面数据
    getPageData() {
        return {
            id: 'design',
            title: 'Graphic design works',
            section: '03',
            hasPixelArt: true
        };
    }
}

// 创建全局实例
window.DesignPage = new DesignPage();