// 苹果主题页面 (页面01)
// 管理"Green Apple's Thousand and One Nights"页面的逻辑

class ApplePage {
    constructor() {
        this.pageElement = null;
        this.featureGrid = null;
        this.isInitialized = false;
        this.isVisible = false;
    }

    init() {
        if (this.isInitialized) return;

        // 获取页面01的元素
        this.pageElement = document.querySelector('.content-section:nth-child(1)');
        
        if (this.pageElement) {
            this.featureGrid = this.pageElement.querySelector('.feature-grid');
            this.setupPageElements();
            this.isInitialized = true;
            console.log('[ApplePage] Apple page initialized');
        }
    }

    setupPageElements() {
        // 设置页面特有的交互逻辑
        const visualElement = this.pageElement.querySelector('.feature-visual');
        
        if (visualElement) {
            // 可以添加特定的视觉效果或交互
            visualElement.addEventListener('click', () => {
                console.log('[ApplePage] Visual element clicked');
            });
        }
    }

    // 页面进入视图时调用
    onEnter() {
        if (!this.isVisible) {
            this.isVisible = true;
            this.animateIn();
            console.log('[ApplePage] Page entered view');
        }
    }

    // 页面离开视图时调用
    onLeave() {
        if (this.isVisible) {
            this.isVisible = false;
            this.animateOut();
            console.log('[ApplePage] Page left view');
        }
    }

    // 进入动画 - 移除渐显逻辑，元素始终存在
    animateIn() {
        // 元素相对页面静止，不需要动画逻辑
        console.log('[ApplePage] Apple page in view');
    }

    // 离开动画 - 移除渐显逻辑，元素始终存在
    animateOut() {
        // 元素相对页面静止，不需要动画逻辑
        console.log('[ApplePage] Apple page out of view');
    }

    // 获取页面数据
    getPageData() {
        return {
            id: 'apple',
            title: 'Green Apple\'s Thousand and One Nights',
            section: '01'
        };
    }
}

// 创建全局实例
window.ApplePage = new ApplePage();