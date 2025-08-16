// 滚动指示器组件
// 管理滚动提示和打字机效果

class ScrollIndicator {
    constructor() {
        this.indicatorElement = null;
        this.typewriterElement = null;
        this.isInitialized = false;
        this.isVisible = true;
    }

    init() {
        if (this.isInitialized) return;

        this.indicatorElement = document.querySelector('.scroll-indicator');
        this.typewriterElement = document.querySelector('.typewriter-text');

        if (this.indicatorElement) {
            this.setupEventListeners();
            this.startTypewriterEffect();
            this.isInitialized = true;
            console.log('[ScrollIndicator] Scroll indicator initialized');
        }
    }

    setupEventListeners() {
        // 监听滚动来控制显示/隐藏
        window.addEventListener('scroll', () => {
            this.updateVisibility();
        });

        // 点击指示器进行滚动
        if (this.indicatorElement) {
            this.indicatorElement.addEventListener('click', () => {
                this.scrollToNextSection();
            });
        }
    }

    startTypewriterEffect() {
        if (!this.typewriterElement) return;

        // 打字机文本内容
        const texts = [
            { en: "Scroll to explore", zh: "滚动探索更多" },
            { en: "Discover my work", zh: "发现我的作品" },
            { en: "See what I create", zh: "看看我的创作" }
        ];

        let currentTextIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let isWaiting = false;

        const typeSpeed = 100;
        const deleteSpeed = 50;
        const waitTime = 2000;

        const typeWriter = () => {
            if (isWaiting) {
                setTimeout(() => {
                    isWaiting = false;
                    isDeleting = true;
                    typeWriter();
                }, waitTime);
                return;
            }

            const currentLang = document.body.classList.contains('chinese') ? 'zh' : 'en';
            const currentText = texts[currentTextIndex][currentLang];

            if (isDeleting) {
                // 删除字符
                this.typewriterElement.textContent = currentText.substring(0, currentCharIndex - 1);
                currentCharIndex--;

                if (currentCharIndex === 0) {
                    isDeleting = false;
                    currentTextIndex = (currentTextIndex + 1) % texts.length;
                }
            } else {
                // 添加字符
                this.typewriterElement.textContent = currentText.substring(0, currentCharIndex + 1);
                currentCharIndex++;

                if (currentCharIndex === currentText.length) {
                    isWaiting = true;
                }
            }

            const speed = isDeleting ? deleteSpeed : typeSpeed;
            setTimeout(typeWriter, speed);
        };

        typeWriter();
    }

    updateVisibility() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        
        // 在Hero区域显示，滚动到内容区域后隐藏
        if (scrollTop < viewportHeight * 0.8) {
            this.show();
        } else {
            this.hide();
        }
    }

    scrollToNextSection() {
        const viewportHeight = window.innerHeight;
        window.scrollTo({
            top: viewportHeight,
            behavior: 'smooth'
        });
    }

    show() {
        if (this.indicatorElement && !this.isVisible) {
            this.indicatorElement.style.opacity = '1';
            this.indicatorElement.style.transform = 'translateY(0)';
            this.isVisible = true;
        }
    }

    hide() {
        if (this.indicatorElement && this.isVisible) {
            this.indicatorElement.style.opacity = '0';
            this.indicatorElement.style.transform = 'translateY(20px)';
            this.isVisible = false;
        }
    }

    // 更新打字机文本语言
    updateLanguage() {
        // 语言切换时，打字机效果会自动适应
        console.log('[ScrollIndicator] Language updated');
    }
}

// 创建全局实例
window.ScrollIndicator = new ScrollIndicator();