export class InputHandler {
  constructor(game) {
    this.game = game;
    this.transformer = null;
    this.selectedBlock = null;

    this.init();
  }

  /**
   * 初始化输入处理器
   */
  init() {
    // 创建变换器
    this.transformer = new Konva.Transformer({
      rotationSnaps: [0, 45, 135, 225, 315],
      rotationSnapTolerance: 45,
      enabledAnchors: [],
      resizeEnabled: false,
      borderEnabled: false,
    });

    // 添加到游戏层
    this.game.layer.add(this.transformer);

    // 添加事件监听
    this.addEventListeners();
  }

  /**
   * 添加事件监听器
   */
  addEventListeners() {
    // 舞台点击事件
    this.game.stage.on('click', (e) => {
      this.handleStageClick(e);
    });

    // 键盘事件
    window.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });
  }

  /**
   * 处理舞台点击
   * @param {Object} e
   */
  handleStageClick(e) {
    // 如果点击的不是积木，取消选择
    if (e.target === this.game.stage ||
        e.target.getParent() === this.game.grid.group ||
        e.target.getParent() === this.game.blocksGroup) {
      this.deselectAll();
    }
  }

  /**
   * 处理键盘按下
   * @param {KeyboardEvent} e
   */
  handleKeyDown(e) {
    if (!this.selectedBlock) return;

    switch(e.key.toLowerCase()) {
      case 'h':
      case 'arrowleft':
      case 'arrowright':
        e.preventDefault();
        this.selectedBlock.flip('horizontal');
        break;
      case 'v':
      case 'arrowup':
      case 'arrowdown':
        e.preventDefault();
        this.selectedBlock.flip('vertical');
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
    this.transformer.nodes([block.getGroup()]);
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
    this.transformer.nodes([]);
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
   * 销毁输入处理器
   */
  destroy() {
    this.transformer.destroy();
    window.removeEventListener('keydown', this.handleKeyDown);
    this.game.stage.off('click', this.handleStageClick);
  }
}