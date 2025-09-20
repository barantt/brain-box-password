import { GAME_CONFIG } from '../config/gameConfig.js';

export class Physics {
  constructor(blocks, layer) {
    this.blocks = blocks;
    this.layer = layer;
    this.animation = null;
    this.isRunning = false;
  }

  /**
   * 启动物理引擎
   */
  start() {
    if (this.isRunning) return;

    this.animation = new Konva.Animation(() => {
      this.update();
    }, this.layer);

    this.animation.start();
    this.isRunning = true;
  }

  /**
   * 停止物理引擎
   */
  stop() {
    if (!this.isRunning) return;

    this.animation.stop();
    this.animation = null;
    this.isRunning = false;
  }

  /**
   * 更新物理状态
   */
  update() {
    this.blocks.forEach(block => {
      block.applyPhysics();
    });

    this.layer.draw();
  }

  /**
   * 重置所有积木的物理状态
   */
  reset() {
    this.blocks.forEach(block => {
      const physics = block.getPhysics();
      physics.velocityY = 0;
      physics.isGrounded = false;
      physics.isDragging = false;
      physics.isSelected = false;
    });
  }

  /**
   * 暂停物理引擎
   */
  pause() {
    if (this.animation) {
      this.animation.stop();
    }
  }

  /**
   * 恢复物理引擎
   */
  resume() {
    if (this.animation && this.isRunning) {
      this.animation.start();
    }
  }

  /**
   * 检查物理引擎是否运行中
   * @returns {boolean}
   */
  isRunning() {
    return this.isRunning;
  }

  /**
   * 销毁物理引擎
   */
  destroy() {
    this.stop();
    this.blocks = null;
    this.layer = null;
  }
}