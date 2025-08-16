// 头部组件
// 管理网站头部导航和语言切换功能

class Header {
    constructor() {
        this.headerElement = null;
        this.languageToggle = null;
        this.navLinks = [];
        this.ctaButton = null;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;

        this.headerElement = document.getElementById('header');
        this.languageToggle = document.getElementById('languageToggle');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.ctaButton = document.querySelector('.cta-button');

        if (this.headerElement) {
            this.setupEventListeners();
            this.isInitialized = true;
            console.log('[Header] Header component initialized');
        }
    }

    setupEventListeners() {
        // 语言切换按钮
        if (this.languageToggle) {
            this.languageToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.onLanguageToggle();
            });
        }

        // 导航链接
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.onNavLinkClick(link);
            });
        });

        // CTA按钮
        if (this.ctaButton) {
            this.ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.onCtaClick();
            });
        }

        // 滚动时的头部状态更新
        window.addEventListener('scroll', () => {
            this.updateHeaderState();
        });
    }

    onLanguageToggle() {
        console.log('[Header] Language toggle clicked');
        if (window.LanguageManager) {
            window.LanguageManager.toggle();
        }
    }

    onNavLinkClick(link) {
        const dropdownType = link.getAttribute('data-dropdown');
        console.log(`[Header] Nav link clicked: ${dropdownType}`);
        
        if (window.DropdownManager) {
            window.DropdownManager.toggle(dropdownType);
        }
    }

    onCtaClick() {
        console.log('[Header] CTA button clicked');
        // 可以添加联系功能
    }

    updateHeaderState() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 根据滚动位置更新头部样式
        if (scrollTop > 100) {
            this.headerElement.classList.add('scrolled');
        } else {
            this.headerElement.classList.remove('scrolled');
        }
    }

    // 显示头部
    show() {
        if (this.headerElement) {
            this.headerElement.style.transform = 'translateY(0)';
        }
    }

    // 隐藏头部
    hide() {
        if (this.headerElement) {
            this.headerElement.style.transform = 'translateY(-100%)';
        }
    }

    // 设置活动状态的导航项
    setActiveNav(navItem) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        if (navItem) {
            navItem.classList.add('active');
        }
    }
}

// 创建全局实例
window.Header = new Header();