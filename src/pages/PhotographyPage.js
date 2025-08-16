// 摄影页面 (页面04)
// 管理"Photography"页面的逻辑

class PhotographyPage {
    constructor() {
        this.pageElement = null;
        this.featureGrid = null;
        this.isInitialized = false;
        this.isVisible = false;
    }

    init() {
        if (this.isInitialized) return;

        // 获取页面04的元素
        this.pageElement = document.querySelector('.content-section:nth-child(4)');
        
        if (this.pageElement) {
            this.featureGrid = this.pageElement.querySelector('.feature-grid');
            this.setupPageElements();
            this.isInitialized = true;
            console.log('[PhotographyPage] Photography page initialized');
        }
    }

    setupPageElements() {
        // 设置页面特有的交互逻辑
        const visualElement = this.pageElement.querySelector('.feature-visual');
        
        if (visualElement) {
            // 可以添加摄影作品的预览功能
            visualElement.addEventListener('click', () => {
                this.onPhotoGalleryClick();
            });
        }
    }

    onPhotoGalleryClick() {
        console.log('[PhotographyPage] Photo gallery clicked');
        // 可以添加照片画廊的展开功能
    }

    // 页面进入视图时调用
    onEnter() {
        if (!this.isVisible) {
            this.isVisible = true;
            this.animateIn();
            console.log('[PhotographyPage] Page entered view');
        }
    }

    // 页面离开视图时调用
    onLeave() {
        if (this.isVisible) {
            this.isVisible = false;
            this.animateOut();
            console.log('[PhotographyPage] Page left view');
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
            id: 'photography',
            title: 'Photography',
            section: '04'
        };
    }
}

// 创建全局实例
window.PhotographyPage = new PhotographyPage();