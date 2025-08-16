// AI编程页面 (页面02)
// 管理"AI Coding"页面的逻辑

class AICodingPage {
    constructor() {
        this.pageElement = null;
        this.featureGrid = null;
        this.isInitialized = false;
        this.isVisible = false;
    }

    init() {
        if (this.isInitialized) return;

        // 获取页面02的元素
        this.pageElement = document.querySelector('.content-section:nth-child(2)');
        
        if (this.pageElement) {
            this.featureGrid = this.pageElement.querySelector('.feature-grid');
            this.setupPageElements();
            this.isInitialized = true;
            console.log('[AICodingPage] AI Coding page initialized');
        }
    }

    setupPageElements() {
        // 设置页面特有的交互逻辑
        const textElement = this.pageElement.querySelector('.feature-text');
        
        if (textElement) {
            // 可以添加特定的文本动画或交互
            textElement.addEventListener('mouseenter', () => {
                this.onTextHover();
            });
        }
    }

    onTextHover() {
        console.log('[AICodingPage] Text area hovered');
        // 可以添加悬停效果
    }

    // 页面进入视图时调用
    onEnter() {
        if (!this.isVisible) {
            this.isVisible = true;
            this.animateIn();
            console.log('[AICodingPage] Page entered view');
        }
    }

    // 页面离开视图时调用
    onLeave() {
        if (this.isVisible) {
            this.isVisible = false;
            this.animateOut();
            console.log('[AICodingPage] Page left view');
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
            id: 'ai-coding',
            title: 'AI Coding',
            section: '02'
        };
    }
}

// 创建全局实例
window.AICodingPage = new AICodingPage();