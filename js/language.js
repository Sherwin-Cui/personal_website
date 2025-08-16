// 语言管理模块
window.LanguageManager = (function() {
    let currentLanguage = AppConfig.languages.default;
    
    function toggleLanguage() {
        currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
        updateLanguage();
    }
    
    function updateLanguage() {
        const body = document.body;
        const elements = document.querySelectorAll('[data-en][data-zh]');
        const languageToggle = document.getElementById('languageToggle');
        const backButton = document.getElementById('backButton');
        
        if (currentLanguage === 'zh') {
            body.classList.add('chinese');
            // 更新语言切换按钮文字（保留弹窗结构）
            const buttonText = languageToggle.childNodes[0];
            if (buttonText && buttonText.nodeType === Node.TEXT_NODE) {
                buttonText.textContent = 'English';
            }
            languageToggle.classList.remove('show-chinese');
            
            elements.forEach(element => {
                element.textContent = element.getAttribute('data-zh');
            });
            
            // 更新title属性
            if (backButton) {
                backButton.title = backButton.getAttribute('data-title-zh');
            }
        } else {
            body.classList.remove('chinese');
            // 更新语言切换按钮文字（保留弹窗结构）
            const buttonText = languageToggle.childNodes[0];
            if (buttonText && buttonText.nodeType === Node.TEXT_NODE) {
                buttonText.textContent = '中文';
            }
            languageToggle.classList.add('show-chinese');
            
            elements.forEach(element => {
                element.textContent = element.getAttribute('data-en');
            });
            
            // 更新title属性
            if (backButton) {
                backButton.title = backButton.getAttribute('data-title-en');
            }
        }
        
        // 更新语言切换弹窗文字
        const tooltip = document.querySelector('.language-tooltip');
        if (tooltip) {
            tooltip.textContent = currentLanguage === 'zh' ? tooltip.getAttribute('data-zh') : tooltip.getAttribute('data-en');
        }
        
        // 重新启动打字机动画
        if (window.TypewriterManager) {
            window.TypewriterManager.init();
        }
        
        // 更新下拉菜单内容（如果当前有显示的话）
        if (window.DropdownManager) {
            window.DropdownManager.updateLanguage(currentLanguage);
        }
    }
    
    function getCurrentLanguage() {
        return currentLanguage;
    }
    
    function init() {
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', (e) => {
                e.preventDefault();
                toggleLanguage();
            });
        }
        updateLanguage();
    }
    
    return {
        init,
        toggleLanguage,
        updateLanguage,
        getCurrentLanguage
    };
})();