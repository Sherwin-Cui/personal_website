// 打字机动画管理模块
window.TypewriterManager = (function() {
    let typewriterTimeout;
    
    // 打字机状态变量 - 移到全局作用域
    let currentText = '';
    let isDeleting = false;
    let charIndex = 0;
    
    function init() {
        const typewriterElement = document.querySelector('.typewriter-text');
        if (!typewriterElement) return;
        
        // 清除之前的定时器
        if (typewriterTimeout) {
            clearTimeout(typewriterTimeout);
        }
        
        // 重置打字机状态
        currentText = '';
        isDeleting = false;
        charIndex = 0;
        
        const texts = AppConfig.text.scrollIndicator;
        
        function typeWriter() {
            const currentLanguage = window.LanguageManager ? window.LanguageManager.getCurrentLanguage() : 'en';
            const fullText = currentLanguage === 'zh' ? texts.zh : texts.en;
            
            if (!isDeleting) {
                // 正在输入
                currentText = fullText.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === fullText.length) {
                    // 输入完成，等待一段时间后开始删除
                    typewriterTimeout = setTimeout(() => {
                        isDeleting = true;
                        typeWriter();
                    }, AppConfig.animations.typewriterDelay.pauseAfterComplete);
                    typewriterElement.textContent = currentText;
                    return;
                }
            } else {
                // 正在删除
                currentText = fullText.substring(0, charIndex - 1);
                charIndex--;
                
                if (charIndex === 0) {
                    // 删除完成，等待一段时间后重新开始输入
                    isDeleting = false;
                    typewriterTimeout = setTimeout(() => {
                        typeWriter();
                    }, AppConfig.animations.typewriterDelay.pauseAfterDelete);
                    typewriterElement.textContent = currentText;
                    return;
                }
            }
            
            typewriterElement.textContent = currentText;
            
            // 设置下一次执行的延迟
            const delay = isDeleting ? 
                AppConfig.animations.typewriterDelay.deleting : 
                AppConfig.animations.typewriterDelay.typing;
            typewriterTimeout = setTimeout(typeWriter, delay);
        }
        
        // 开始打字机动画
        typeWriter();
    }
    
    return {
        init
    };
})();