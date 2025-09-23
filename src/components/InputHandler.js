export class InputHandler {
  constructor(game) {
    this.game = game;
    this.selectedBlock = null;
    this.lastClickTime = 0;
    this.lastClickedBlock = null;
    this.rightClickTimer = null;
    this.doubleClickDelay = 300; // 双击判定时间（毫秒）
    this.rightClickDelay = 250; // 右键单击判定时间（毫秒）

    this.init();
  }

  /**
   * 初始化输入处理器
   */
  init() {
    // 添加事件监听
    this.addEventListeners();
    this.addKeyboardListeners();
    this.addStageListener();
  }

  /**
   * 添加事件监听器
   */
  addEventListeners() {
    // 为每个积木添加事件监听
    this.game.blocks.forEach(block => {
      const group = block.getGroup();

      // 移除旧的事件监听器
      group.off('click');
      group.off('dblclick');
      group.off('contextmenu');
      group.off('mousedown');

      // 添加新的事件监听器
      group.on('mousedown', (e) => {
        this.handleBlockMouseDown(e, block);
      });

      group.on('contextmenu', (e) => {
        e.evt.preventDefault(); // 阻止默认右键菜单
      });
    });
  }

  /**
   * 处理积木鼠标按下事件
   * @param {Object} e
   * @param {Block} block
   */
  handleBlockMouseDown(e, block) {
    // 阻止事件冒泡和默认行为
    e.evt.preventDefault();

    const currentTime = Date.now();
    const isRightClick = e.evt.button === 2;

    if (isRightClick) {
      // 右键处理
      if (this.rightClickTimer) {
        // 清除之前的定时器（这是双击）
        clearTimeout(this.rightClickTimer);
        this.rightClickTimer = null;
        // 右键双击 - 顺时针旋转90度
        block.rotate(90);
      } else {
        // 设置定时器判断是单击还是双击
        this.rightClickTimer = setTimeout(() => {
          // 右键单击 - 镜像翻转
          block.flip('horizontal');
          this.rightClickTimer = null;
        }, this.rightClickDelay);
      }
    } else {
      // 左键处理
      if (this.lastClickedBlock === block &&
          currentTime - this.lastClickTime < this.doubleClickDelay) {
        // 左键双击 - 逆时针旋转90度
        block.rotate(-90);
        this.lastClickedBlock = null;
        this.lastClickTime = 0;
      } else {
        // 左键单击 - 选中积木
        this.selectBlock(block);
        this.lastClickedBlock = block;
        this.lastClickTime = currentTime;
      }
    }
  }

  /**
   * 添加键盘事件监听器
   */
  addKeyboardListeners() {
    // 键盘事件 - 监听整个文档
    document.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });
  }

  /**
   * 处理键盘按下事件
   * @param {KeyboardEvent} e
   */
  handleKeyDown(e) {
    // 只处理方向键且必须有选中的积木
    if (!this.selectedBlock) return;

    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.selectedBlock.rotate(-90); // 选中积木逆时针旋转90度
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.selectedBlock.rotate(90); // 选中积木顺时针旋转90度
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        e.preventDefault();
        this.selectedBlock.flip('horizontal'); // 选中积木水平翻转
        break;
    }
  }

  /**
   * 选择积木
   * @param {Block} block
   */
  selectBlock(block) {
    // 取消之前的选择
    this.deselectAll();

    // 选择新积木
    this.selectedBlock = block;
    block.select();
    this.game.layer.draw();
  }

  /**
   * 取消选择所有积木
   */
  deselectAll() {
    this.game.blocks.forEach(block => {
      block.deselect();
    });
    this.selectedBlock = null;
    this.game.layer.draw();
  }

  /**
   * 获取当前选中的积木
   * @returns {Block|null}
   */
  getSelectedBlock() {
    return this.selectedBlock;
  }

  /**
   * 添加舞台事件监听器
   */
  addStageListener() {
    // 点击舞台空白区域取消选择
    this.game.stage.on('click', (e) => {
      // 如果点击的是舞台本身或网格，取消选择
      if (e.target === this.game.stage ||
          e.target.getParent() === this.game.grid.group) {
        this.deselectAll();
      }
    });
  }

  /**
   * 重新绑定事件（用于积木重置后）
   */
  rebindEvents() {
    this.addEventListeners();
  }

  /**
   * 销毁输入处理器
   */
  destroy() {
    // 清理定时器
    if (this.rightClickTimer) {
      clearTimeout(this.rightClickTimer);
      this.rightClickTimer = null;
    }

    // 移除所有事件监听器
    this.game.blocks.forEach(block => {
      const group = block.getGroup();
      group.off('mousedown');
      group.off('contextmenu');
    });

    // 移除键盘事件监听器
    document.removeEventListener('keydown', this.handleKeyDown);

    // 移除舞台事件监听器
    this.game.stage.off('click');
  }
}