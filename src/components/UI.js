import { GAME_CONFIG } from '../config/gameConfig.js';

export class UI {
  constructor(game) {
    this.game = game;
    this.celebrationGroup = null;
    this.celebrationTween = null;
    this.isExternalUI = false; // 标记是否使用外部UI
  }

  /**
   * 显示完成庆祝信息
   */
  showCompletionMessage() {
    // 如果使用外部UI，只触发事件但不显示Konva的庆祝消息
    if (this.isExternalUI) {
      // 触发自定义事件，让外部UI处理
      const event = new CustomEvent('gameCompleted');
      document.dispatchEvent(event);
      return;
    }

    // 隐藏之前的庆祝信息
    this.hideCompletionMessage();

    // 创建庆祝文本
    const completionText = new Konva.Text({
      x: GAME_CONFIG.width / 2 - 100,
      y: GAME_CONFIG.height / 2 - 50,
      text: '🎉 恭喜！拼图完成！ 🎉',
      fontSize: 24,
      fontFamily: 'Arial',
      fill: '#ff6b6b',
      stroke: '#ffffff',
      strokeWidth: 2,
      align: 'center',
      width: 200
    });

    // 创建背景矩形
    const completionBg = new Konva.Rect({
      x: GAME_CONFIG.width / 2 - 120,
      y: GAME_CONFIG.height / 2 - 70,
      width: 240,
      height: 100,
      fill: 'rgba(255, 255, 255, 0.95)',
      stroke: '#ff6b6b',
      strokeWidth: 3,
      cornerRadius: 10,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOpacity: 0.3
    });

    // 创建庆祝组
    this.celebrationGroup = new Konva.Group({
      name: 'celebration'
    });

    this.celebrationGroup.add(completionBg);
    this.celebrationGroup.add(completionText);

    // 先添加到图层
    this.game.layer.add(this.celebrationGroup);
    this.game.layer.draw();

    // 然后创建闪烁动画（确保节点已经在图层中）
    this.celebrationTween = new Konva.Tween({
      node: this.celebrationGroup,
      duration: GAME_CONFIG.ui.celebration.tweenDuration,
      opacity: 0.3,
      yoyo: true,
      repeat: -1
    });

    this.celebrationTween.play();

    // 5秒后自动隐藏
    setTimeout(() => {
      this.hideCompletionMessage();
    }, GAME_CONFIG.ui.celebration.duration);
  }

  /**
   * 隐藏庆祝信息
   */
  hideCompletionMessage() {
    if (this.celebrationTween) {
      this.celebrationTween.destroy();
      this.celebrationTween = null;
    }

    if (this.celebrationGroup) {
      this.celebrationGroup.destroy();
      this.celebrationGroup = null;
    }

    this.game.layer.draw();
  }

  /**
   * 创建说明面板
   */
  createInstructions() {
    // 如果使用外部UI，不创建内部说明
    if (this.isExternalUI) return null;

    const instructions = document.createElement('div');
    instructions.className = 'instructions';
    instructions.innerHTML = `
      <strong>操作说明:</strong><br>
      • 点击选中积木<br>
      • 拖拽旋转控制器旋转<br>
      • <strong>H键</strong> 或 <strong>左右箭头</strong>: 水平翻转<br>
      • <strong>V键</strong> 或 <strong>上下箭头</strong>: 垂直翻转<br>
      • 双击重置积木
    `;

    document.body.appendChild(instructions);
    return instructions;
  }

  /**
   * 创建游戏容器
   */
  createContainer() {
    const container = document.createElement('div');
    container.id = 'container';

    // 如果不是外部UI，应用内联样式
    if (!this.isExternalUI) {
      container.style.width = `${GAME_CONFIG.width}px`;
      container.style.height = `${GAME_CONFIG.height}px`;
      container.style.background = '#e9e9e9';
      container.style.border = '1px solid #bbb';
    }

    document.body.appendChild(container);
    return container;
  }

  /**
   * 应用样式
   */
  applyStyles() {
    // 如果使用外部UI，不应用内部样式
    if (this.isExternalUI) return;

    const style = document.createElement('style');
    style.textContent = `
      html, body {
        height: 100%;
        margin: 0;
      }

      body {
        background: #e9e9e9;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
      }

      .instructions {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 255, 255, 0.9);
        padding: 10px;
        border-radius: 5px;
        font-size: 12px;
        color: #333;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1000;
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * 设置使用外部UI
   */
  setExternalUI(enabled) {
    this.isExternalUI = enabled;
  }
}