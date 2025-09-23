export class InputHandler {
  constructor(game) {
    this.game = game;
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
        // 记录单击事件
        this.lastClickedBlock = block;
        this.lastClickTime = currentTime;
      }
    }
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
  }
}