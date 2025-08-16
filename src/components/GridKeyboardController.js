// 网格系统键盘控制器
// 管理网格系统的快捷键操作

class GridKeyboardController {
    constructor() {
        this.isInitialized = false;
        this.keyMap = {
            // 主要功能
            'g': 'toggleGrid',           // G键：显示/隐藏网格
            'G': 'toggleGrid',
            'ctrl+g': 'toggleGrid',      // Ctrl+G：显示/隐藏网格
            'cmd+g': 'toggleGrid',       // Cmd+G：显示/隐藏网格（Mac）
            
            // 面板控制
            'i': 'togglePanel',          // I键：显示/隐藏信息面板
            'I': 'togglePanel',
            'ctrl+i': 'togglePanel',     // Ctrl+I：显示/隐藏信息面板
            'cmd+i': 'togglePanel',      // Cmd+I：显示/隐藏信息面板（Mac）
            
            // 吸附点
            's': 'toggleSnapPoints',     // S键：显示/隐藏吸附点
            'S': 'toggleSnapPoints',
            
            // 帮助和文本框
            'h': 'toggleTextBoxes',      // H键：显示/隐藏文本框
            'H': 'toggleTextBoxes',
            '?': 'showHelp',             // ?键：显示帮助信息
            
            // 退出
            'Escape': 'hideGrid'         // ESC键：隐藏网格系统
        };
        
        this.helpVisible = false;
    }
    
    toggleTextBoxes() {
        // 切换所有文本框边框的显示
        const isVisible = document.body.classList.toggle('show-text-boxes');
        this.showNotification(isVisible ? '文本框边框显示' : '文本框边框隐藏');
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.bindKeyboardEvents();
        this.createHelpPanel();
        
        this.isInitialized = true;
        console.log('[GridKeyboardController] Keyboard controller initialized');
    }
    
    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // 检查是否在输入框中
            if (this.isInInputField(e.target)) {
                return;
            }
            
            // 构建键组合
            const keyCombo = this.buildKeyCombo(e);
            
            // 查找对应的操作
            const action = this.keyMap[keyCombo];
            if (action) {
                e.preventDefault();
                this.executeAction(action);
            }
        });
        
        // 监听Ctrl/Cmd键组合（特殊处理）
        document.addEventListener('keydown', (e) => {
            if (this.isInInputField(e.target)) return;
            
            // Ctrl/Cmd + M：鼠标追踪模式切换
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
                e.preventDefault();
                this.toggleMouseTracking();
            }
        });
    }
    
    buildKeyCombo(e) {
        const keys = [];
        
        if (e.ctrlKey) keys.push('ctrl');
        if (e.metaKey) keys.push('cmd');
        if (e.altKey) keys.push('alt');
        if (e.shiftKey && e.key !== 'Shift') keys.push('shift');
        
        keys.push(e.key);
        
        return keys.join('+');
    }
    
    isInInputField(element) {
        const inputTypes = ['input', 'textarea', 'select'];
        return inputTypes.includes(element.tagName.toLowerCase()) ||
               element.contentEditable === 'true';
    }
    
    executeAction(action) {
        if (!window.GridSystem) {
            console.warn('[GridKeyboardController] GridSystem not available');
            return;
        }
        
        switch (action) {
            case 'toggleGrid':
                window.GridSystem.toggle();
                this.showNotification('网格系统切换');
                break;
                
            case 'togglePanel':
                window.GridSystem.togglePanel();
                this.showNotification('信息面板切换');
                break;
                
            case 'toggleSnapPoints':
                window.GridSystem.toggleSnapPoints();
                this.showNotification('吸附点切换');
                break;
                
            case 'toggleTextBoxes':
                this.toggleTextBoxes();
                break;
                
            case 'showHelp':
                this.toggleHelp();
                break;
                
            case 'hideGrid':
                window.GridSystem.hide();
                this.hideHelp();
                this.showNotification('网格系统已隐藏');
                break;
                
            default:
                console.warn(`[GridKeyboardController] Unknown action: ${action}`);
        }
    }
    
    toggleMouseTracking() {
        // 切换鼠标坐标追踪显示模式
        const indicator = document.getElementById('gridMouseIndicator');
        if (indicator) {
            const isAlwaysVisible = indicator.style.display === 'block';
            if (isAlwaysVisible) {
                indicator.style.display = '';
                this.showNotification('鼠标追踪：仅网格模式');
            } else {
                indicator.style.display = 'block';
                indicator.classList.add('visible');
                this.showNotification('鼠标追踪：始终显示');
            }
        }
    }
    
    createHelpPanel() {
        const helpPanel = document.createElement('div');
        helpPanel.id = 'gridHelpPanel';
        helpPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #ff0000;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10002;
            display: none;
            max-width: 400px;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
        `;
        
        helpPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #333;">网格系统快捷键</h3>
                <button onclick="window.GridKeyboardController.hideHelp()" style="
                    background: #ff5555;
                    border: none;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    color: white;
                    font-size: 12px;
                ">×</button>
            </div>
            
            <div style="font-size: 13px; line-height: 1.6;">
                <div style="margin-bottom: 12px;">
                    <strong style="color: #ff0000;">主要功能：</strong><br>
                    <code>G</code> 或 <code>Ctrl/Cmd+G</code> - 显示/隐藏网格<br>
                    <code>I</code> 或 <code>Ctrl/Cmd+I</code> - 显示/隐藏信息面板<br>
                    <code>S</code> - 显示/隐藏吸附点<br>
                    <code>ESC</code> - 隐藏网格系统
                </div>
                
                <div style="margin-bottom: 12px;">
                    <strong style="color: #ff0000;">鼠标追踪：</strong><br>
                    <code>Ctrl/Cmd+M</code> - 切换鼠标坐标显示模式
                </div>
                
                <div style="margin-bottom: 12px;">
                    <strong style="color: #ff0000;">帮助：</strong><br>
                    <code>H</code> 或 <code>?</code> - 显示/隐藏这个帮助面板
                </div>
                
                <div style="background: #f8f8f8; padding: 10px; border-radius: 4px; margin-top: 15px;">
                    <strong>网格系统说明：</strong><br>
                    • 基于MacBook 14英寸优化 (1470×919)<br>
                    • 4列×3行网格布局，30px间距<br>
                    • 自动吸附到网格交叉点<br>
                    • 实时显示精确坐标位置
                </div>
            </div>
        `;
        
        document.body.appendChild(helpPanel);
        this.helpPanel = helpPanel;
    }
    
    toggleHelp() {
        if (this.helpVisible) {
            this.hideHelp();
        } else {
            this.showHelp();
        }
    }
    
    showHelp() {
        if (this.helpPanel) {
            this.helpPanel.style.display = 'block';
            this.helpVisible = true;
        }
    }
    
    hideHelp() {
        if (this.helpPanel) {
            this.helpPanel.style.display = 'none';
            this.helpVisible = false;
        }
    }
    
    showNotification(message) {
        // 创建临时通知
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            z-index: 10003;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 动画显示
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
        });
        
        // 自动移除
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 1500);
    }
    
    // 获取所有快捷键映射
    getKeyMap() {
        return { ...this.keyMap };
    }
    
    // 添加自定义快捷键
    addKeyBinding(keyCombo, action) {
        this.keyMap[keyCombo] = action;
        console.log(`[GridKeyboardController] Added key binding: ${keyCombo} -> ${action}`);
    }
    
    // 移除快捷键
    removeKeyBinding(keyCombo) {
        delete this.keyMap[keyCombo];
        console.log(`[GridKeyboardController] Removed key binding: ${keyCombo}`);
    }
}

// 创建全局实例
window.GridKeyboardController = new GridKeyboardController();