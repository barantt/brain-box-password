import { GAME_CONFIG, BLOCK_SHAPES, RANDOM_BLOCK_SHAPES } from '../config/gameConfig.js';
import { Grid } from './Grid.js';
import { Block } from './Block.js';
import { Physics } from './Physics.js';
import { InputHandler } from './InputHandler.js';
import { UI } from './UI.js';

export class Game {
  constructor() {
    this.stage = null;
    this.layer = null;
    this.blocksGroup = null;
    this.grid = null;
    this.blocks = [];
    this.physics = null;
    this.inputHandler = null;
    this.ui = null;
    this.isCompleted = false;

    this.init();
  }

  /**
   * 初始化游戏
   */
  init() {
    // 创建UI
    this.ui = new UI(this);

    // 检查是否有外部UI
    const hasExternalUI = document.getElementById('container') &&
                         document.querySelector('.bg-gradient-to-br');
    this.ui.setExternalUI(hasExternalUI);

    this.ui.applyStyles();
    const container = this.ui.createContainer();
    this.ui.createInstructions();

    // 创建舞台
    this.stage = new Konva.Stage({
      container: 'container',
      width: GAME_CONFIG.width,
      height: GAME_CONFIG.height,
    });

    // 创建图层
    this.layer = new Konva.Layer();

    // 创建积木组
    this.blocksGroup = new Konva.Group({
      x: 0,
      y: 0,
      width: GAME_CONFIG.width / 2,
      height: GAME_CONFIG.height,
      name: 'blocks'
    });

    // 创建网格
    this.grid = new Grid(this.stage, this.layer);

    // 创建积木
    this.createBlocks();

    // 创建物理引擎
    this.physics = new Physics(this.blocks, this.layer);

    // 创建输入处理器
    this.inputHandler = new InputHandler(this);

    // 添加到图层
    this.layer.add(this.blocksGroup);
    this.stage.add(this.layer);

    // 物理引擎已禁用
    // this.physics.start();

    // 绑定积木选择事件
    this.bindBlockSelection();
  }

  /**
   * 创建积木
   */
  createBlocks() {
    // 复制 BLOCK_SHAPES
    const allShapes = [...BLOCK_SHAPES];

    // 从 RANDOM_BLOCK_SHAPES 中随机选择两个
    const shuffledRandom = [...RANDOM_BLOCK_SHAPES].sort(() => 0.5 - Math.random());
    const randomBlocks = shuffledRandom.slice(0, 2);

    // 将随机积木添加到列表中
    allShapes.push(...randomBlocks);

    // 打乱整个列表
    const finalShapes = allShapes.sort(() => 0.5 - Math.random());

    // 创建所有积木
    for (let i = 0; i < finalShapes.length; i++) {
      const shapeConfig = finalShapes[i];
      const block = new Block(
        shapeConfig,
        shapeConfig.color,
        i,
        this.blocksGroup,
        this.grid
      );

      this.blocks.push(block);
    }
  }

  /**
   * 绑定积木选择事件
   */
  bindBlockSelection() {
    this.blocks.forEach(block => {
      const group = block.getGroup();

      // 设置拖拽结束回调
      block.onDragEnd = (snapped) => {
        // 如果成功吸附，检查是否完成
        if (snapped && this.grid.checkCompletion() && !this.isCompleted) {
          this.isCompleted = true;
          this.ui.showCompletionMessage();
        }
      };

      // 覆盖点击事件
      group.off('click');
      group.on('click', () => {
        this.inputHandler.selectBlock(block);
      });
    });
  }

  /**
   * 重置游戏
   */
  reset() {
    // 停止物理引擎
    this.physics.stop();

    // 重置网格
    this.grid.reset();

    // 重置所有积木（让每个积木自己处理重置逻辑）
    this.blocks.forEach((block, index) => {
      block.reset();
    });

    // 重置物理状态
    this.physics.reset();

    // 重置完成状态
    this.isCompleted = false;
    this.ui.hideCompletionMessage();

    // 物理引擎已禁用
    // this.physics.start();

    // 重绘
    this.layer.draw();
  }

  /**
   * 暂停游戏
   */
  pause() {
    this.physics.pause();
  }

  /**
   * 恢复游戏
   */
  resume() {
    this.physics.resume();
  }

  /**
   * 获取舞台
   * @returns {Konva.Stage}
   */
  getStage() {
    return this.stage;
  }

  /**
   * 获取图层
   * @returns {Konva.Layer}
   */
  getLayer() {
    return this.layer;
  }

  /**
   * 获取积木数组
   * @returns {Array}
   */
  getBlocks() {
    return this.blocks;
  }

  /**
   * 获取网格
   * @returns {Grid}
   */
  getGrid() {
    return this.grid;
  }

  /**
   * 销毁游戏
   */
  destroy() {
    // 停止物理引擎
    if (this.physics) {
      this.physics.destroy();
    }

    // 销毁输入处理器
    if (this.inputHandler) {
      this.inputHandler.destroy();
    }

    // 销毁积木
    this.blocks.forEach(block => {
      block.destroy();
    });

    // 销毁网格
    if (this.grid) {
      this.grid.destroy();
    }

    // 销毁舞台
    if (this.stage) {
      this.stage.destroy();
    }

    // 清理UI
    if (this.ui) {
      this.ui.hideCompletionMessage();
    }
  }
}