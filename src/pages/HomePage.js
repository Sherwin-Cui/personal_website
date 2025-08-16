// Hero页面逻辑
// 管理主页的Hero区域和动画效果

class HomePage {
    constructor() {
        this.heroTextContainer = null;
        this.fillElements = [];
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;

        this.heroTextContainer = document.querySelector('.hero-text-container');
        this.fillElements = document.querySelectorAll('.text-fill');

        if (this.heroTextContainer) {
            this.setupHeroAnimations();
            this.isInitialized = true;
            console.log('[HomePage] Hero page initialized');
        }
    }

    setupHeroAnimations() {
        // Hero区域的动画设置
        // 这里可以添加特定的Hero动画逻辑
    }

    // 获取Hero区域的滚动进度
    getHeroScrollProgress() {
        const heroHeight = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return Math.min(scrollTop / heroHeight, 1);
    }

    // 更新文字填充效果
    updateTextFill(progress) {
        this.fillElements.forEach((element, index) => {
            // 为每个文字元素设置不同的动画时机
            const delay = index * 0.2;
            const adjustedProgress = Math.max(0, (progress - delay) / (1 - delay));
            
            if (adjustedProgress > 0) {
                const fillPercentage = Math.min(adjustedProgress * 100, 100);
                element.style.setProperty('--fill-progress', `${fillPercentage}%`);
            }
        });
    }

    // 显示Hero区域
    show() {
        if (this.heroTextContainer) {
            this.heroTextContainer.style.opacity = '1';
        }
    }

    // 隐藏Hero区域
    hide() {
        if (this.heroTextContainer) {
            this.heroTextContainer.style.opacity = '0';
        }
    }
}

// 创建全局实例
window.HomePage = new HomePage();