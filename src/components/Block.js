import { GAME_CONFIG } from '../config/gameConfig.js';
import { getGridKey, getDistance } from '../utils/helpers.js';

export class Block {
  constructor(shapeData, color, index, layer, grid) {
    this.shapeData = shapeData.shape;
    this.color = color;
    this.index = index;
    this.layer = layer;
    this.grid = grid;
    this.centerBlock = this.findCenterBlock();
    this.group = null;
    this.blocks = [];

    this.init();
  }

  /**
   * 查找中心方块
   * @returns {Array} [row, col] 中心方块的坐标
   */
  findCenterBlock() {
    for (let row = 0; row < this.shapeData.length; row++) {
      for (let col = 0; col < this.shapeData[row].length; col++) {
        if (this.shapeData[row][col] === 2) {
          return [row, col];
        }
      }
    }
    // 如果没有找到中心点（向后兼容），默认为 [1, 1]
    return [1, 1];
  }

  /**
   * 初始化积木
   */
  init() {
    // 计算网格布局位置
    const config = GAME_CONFIG.blocks;
    const row = Math.floor(this.index / config.cols);
    const col = this.index % config.cols;

    const x = config.startX + col * config.horizontalSpacing;
    const y = config.startY + row * config.verticalSpacing;

    // 创建积木组
    this.group = new Konva.Group({
      x: x,
      y: y,
      draggable: true,
      rotation: 45,
      offset: {
        x: 0,
        y: 0
      }
    });

    // 添加物理属性
    this.group.physics = {
      velocityY: 0,
      isGrounded: false,
      isDragging: false,
      isSelected: false,
      isFlippedX: false,
      isFlippedY: false
    };

    // 创建积木形状
    this.createShape();

    // 添加事件监听
    this.addEventListeners();

    this.layer.add(this.group);
  }

  /**
   * 创建积木形状
   */
  createShape() {
    const blockSize = Math.hypot(GAME_CONFIG.halfBlockSize, GAME_CONFIG.halfBlockSize);

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.shapeData[row] && this.shapeData[row][col] > 0) {
          const block = new Konva.Rect({
            x: col * blockSize,
            y: row * blockSize,
            width: blockSize,
            height: blockSize,
            fill: this.color.fill,
            stroke: this.color.stroke,
          });
          this.group.add(block);
          this.blocks.push(block);
        }
      }
    }
  }

  /**
   * 添加事件监听
   */
  addEventListeners() {
    // 拖拽开始
    this.group.on('dragstart', () => {
      this.group.physics.isDragging = true;
      this.grid.releaseGroupGrids(this.group);
      this.group.physics.isGrounded = false;
      this.group.opacity(0.9);
    });

    // 拖拽移动 - 添加边界检测
    this.group.on('dragmove', () => {
      this.constrainToBounds();
    });

    // 拖拽结束
    this.group.on('dragend', () => {
      this.group.physics.isDragging = false;
      const snapped = this.snapToGrid();
      this.group.opacity(1);

      // 触发拖拽结束事件
      if (this.onDragEnd) {
        this.onDragEnd(snapped);
      }
    });
  }

  /**
   * 选中积木
   */
  select() {
    // 添加选中效果 - 提高透明度和添加边框
    this.blocks.forEach(block => {
      block.stroke('white');
      block.strokeWidth(3);
      block.shadowColor('black');
      block.shadowBlur(10);
      block.shadowOpacity(0.5);
    });
  }

  /**
   * 取消选中
   */
  deselect() {
    // 移除选中效果
    this.blocks.forEach(block => {
      block.stroke(this.color.stroke);
      block.strokeWidth(1);
      block.shadowColor(null);
      block.shadowBlur(0);
      block.shadowOpacity(0);
    });
  }

  /**
   * 重置积木位置
   */
  reset() {
    this.grid.releaseGroupGrids(this.group);

    // 回到网格布局位置
    const config = GAME_CONFIG.blocks;
    const row = Math.floor(this.index / config.cols);
    const col = this.index % config.cols;

    const x = config.startX + col * config.horizontalSpacing;
    const y = config.startY + row * config.verticalSpacing;

    // 设置位置和状态
    this.group.x(x);
    this.group.y(y);
    this.group.rotation(45);
    this.group.scaleX(1);
    this.group.scaleY(1);

    // 重置物理状态
    this.group.physics.velocityY = 0;
    this.group.physics.isGrounded = false;
    this.group.physics.isDragging = false;
    this.group.physics.isFlippedX = false;
    this.group.physics.isFlippedY = false;
  }

  /**
   * 翻转积木
   * @param {string} direction - 'horizontal' 或 'vertical'
   */
  flip(direction) {
    const blockSize = Math.hypot(GAME_CONFIG.halfBlockSize, GAME_CONFIG.halfBlockSize);

    // 计算中心方块的世界坐标
    const centerBlockRow = this.centerBlock[0];
    const centerBlockCol = this.centerBlock[1];

    // 中心方块在积木组中的本地坐标
    const centerLocalX = centerBlockCol * blockSize + blockSize / 2;
    const centerLocalY = centerBlockRow * blockSize + blockSize / 2;

    // 计算当前中心点的世界坐标
    const currentTransform = this.group.getTransform();
    const currentCenterWorld = currentTransform.point({
      x: centerLocalX,
      y: centerLocalY
    });

    if (direction === 'horizontal') {
      this.group.physics.isFlippedX = !this.group.physics.isFlippedX;
      const scaleX = this.group.physics.isFlippedX ? -1 : 1;
      this.group.scaleX(scaleX);
    } else if (direction === 'vertical') {
      this.group.physics.isFlippedY = !this.group.physics.isFlippedY;
      const scaleY = this.group.physics.isFlippedY ? -1 : 1;
      this.group.scaleY(scaleY);
    }

    // 计算翻转后中心点的世界坐标
    const newTransform = this.group.getTransform();
    const newCenterWorld = newTransform.point({
      x: centerLocalX,
      y: centerLocalY
    });

    // 计算偏移量，使中心点回到原来的位置
    const offsetX = currentCenterWorld.x - newCenterWorld.x;
    const offsetY = currentCenterWorld.y - newCenterWorld.y;

    // 调整积木组位置
    this.group.x(this.group.x() + offsetX);
    this.group.y(this.group.y() + offsetY);

    // 翻转后进行边界检测
    this.constrainToBounds();
  }

  /**
   * 旋转积木
   * @param {number} angle - 旋转角度（正值顺时针，负值逆时针）
   */
  rotate(angle) {
    const blockSize = Math.hypot(GAME_CONFIG.halfBlockSize, GAME_CONFIG.halfBlockSize);

    // 计算中心方块的世界坐标
    const centerBlockRow = this.centerBlock[0];
    const centerBlockCol = this.centerBlock[1];

    // 中心方块在积木组中的本地坐标
    const centerLocalX = centerBlockCol * blockSize + blockSize / 2;
    const centerLocalY = centerBlockRow * blockSize + blockSize / 2;

    // 计算当前旋转后的中心点世界坐标
    const currentTransform = this.group.getTransform();
    const currentCenterWorld = currentTransform.point({
      x: centerLocalX,
      y: centerLocalY
    });

    // 计算新的旋转角度
    const currentRotation = this.group.rotation();
    let newRotation = currentRotation + angle;

    // 标准化新角度到 0-360 范围
    newRotation = newRotation % 360;
    if (newRotation < 0) newRotation += 360;

    // 设置新的旋转角度
    this.group.rotation(newRotation);

    // 计算旋转后中心点的世界坐标
    const newTransform = this.group.getTransform();
    const newCenterWorld = newTransform.point({
      x: centerLocalX,
      y: centerLocalY
    });

    // 计算偏移量，使中心点回到原来的位置
    const offsetX = currentCenterWorld.x - newCenterWorld.x;
    const offsetY = currentCenterWorld.y - newCenterWorld.y;

    // 调整积木组位置
    this.group.x(this.group.x() + offsetX);
    this.group.y(this.group.y() + offsetY);

    // 旋转后进行边界检测
    this.constrainToBounds();

    this.layer.draw();
  }

  /**
   * 吸附到网格
   * @returns {boolean}
   */
  snapToGrid() {
    const firstBlock = this.blocks[0];
    if (!firstBlock) return false;

    const blockSize = Math.hypot(GAME_CONFIG.halfBlockSize, GAME_CONFIG.halfBlockSize);

    // 计算第一个方块的中心坐标
    const blockLocalCenterX = firstBlock.x() + blockSize / 2;
    const blockLocalCenterY = firstBlock.y() + blockSize / 2;

    // 转换为世界坐标
    const groupTransform = this.group.getTransform();
    const rotatedPoint = groupTransform.point({
      x: blockLocalCenterX,
      y: blockLocalCenterY
    });

    // 查找最近的网格
    const nearestGrid = this.grid.findNearestGrid(
      rotatedPoint.x,
      rotatedPoint.y,
      GAME_CONFIG.grid.maxSnapDistance
    );

    if (nearestGrid) {
      const currentBlockCenterX = rotatedPoint.x;
      const currentBlockCenterY = rotatedPoint.y;

      const offsetX = nearestGrid.x - currentBlockCenterX;
      const offsetY = nearestGrid.y - currentBlockCenterY;

      // 检查所有方块是否都在有效网格上
      const allBlocksOnValidGrids = this.blocks.every(block => {
        const blockLocalCenterX = block.x() + blockSize / 2;
        const blockLocalCenterY = block.y() + blockSize / 2;

        const futureGroupX = this.group.x() + offsetX;
        const futureGroupY = this.group.y() + offsetY;

        const futureTransform = new Konva.Transform();
        futureTransform.translate(futureGroupX, futureGroupY);
        futureTransform.rotate(this.group.rotation() * Math.PI / 180);
        futureTransform.scale(this.group.scaleX(), this.group.scaleY());

        const futureBlockCenter = futureTransform.point({
          x: blockLocalCenterX,
          y: blockLocalCenterY
        });

        // 检查是否在有效网格上
        const targetGrid = this.findTargetGrid(futureBlockCenter);
        if (!targetGrid) return false;

        // 检查是否被占用
        if (this.grid.isOccupied(targetGrid.x, targetGrid.y, this.group)) {
          return false;
        }

        return true;
      });

      if (!allBlocksOnValidGrids) return false;

      // 执行吸附
      this.grid.releaseGroupGrids(this.group);
      this.group.x(this.group.x() + offsetX);
      this.group.y(this.group.y() + offsetY);

      // 标记占用
      this.blocks.forEach(block => {
        const blockLocalCenterX = block.x() + blockSize / 2;
        const blockLocalCenterY = block.y() + blockSize / 2;

        const currentTransform = this.group.getTransform();
        const blockWorldPos = currentTransform.point({
          x: blockLocalCenterX,
          y: blockLocalCenterY
        });

        const targetGrid = this.findTargetGrid(blockWorldPos);
        if (targetGrid) {
          this.grid.occupy(targetGrid.x, targetGrid.y, this.group);
        }
      });

      // 停止重力
      this.group.physics.isGrounded = true;
      this.group.physics.velocityY = 0;

      // 网格吸附后进行边界检测
      this.constrainToBounds();

      return true;
    }

    return false;
  }

  /**
   * 查找目标网格
   * @param {Object} point
   * @returns {Object|null}
   */
  findTargetGrid(point) {
    const centers = this.grid.getCenters();
    for (const gridCenter of centers) {
      const distance = getDistance(point, gridCenter);
      if (distance <= GAME_CONFIG.grid.tolerance) {
        return gridCenter;
      }
    }
    return null;
  }

  /**
   * 应用物理效果 (已禁用重力)
   */
  applyPhysics() {
    // 重力系统已禁用，积木保持静止
    return;
  }

  /**
   * 边界检测 - 限制积木在可视区域内
   */
  constrainToBounds() {
    const group = this.group;

    // 计算所有实际渲染方块的世界坐标边界
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    // 遍历所有实际渲染的方块
    this.blocks.forEach(block => {
      // 获取方块的四个角的世界坐标
      const corners = [
        { x: block.x(), y: block.y() },
        { x: block.x() + block.width(), y: block.y() },
        { x: block.x(), y: block.y() + block.height() },
        { x: block.x() + block.width(), y: block.y() + block.height() }
      ];

      // 转换为世界坐标并更新边界
      corners.forEach(corner => {
        const worldPoint = group.getTransform().point(corner);
        minX = Math.min(minX, worldPoint.x);
        minY = Math.min(minY, worldPoint.y);
        maxX = Math.max(maxX, worldPoint.x);
        maxY = Math.max(maxY, worldPoint.y);
      });
    });

    // 如果没有找到任何方块，返回
    if (minX === Infinity) return;

    // 计算积木的实际宽度和高度
    const actualWidth = maxX - minX;
    const actualHeight = maxY - minY;

    // 获取画布边界
    const canvasMinX = 0;  // 允许积木超出左侧边界
    const canvasMinY = 0;
    // 获取积木组的当前位置
    let groupX = group.x();
    let groupY = group.y();

    // 计算需要调整的偏移量
    let offsetX = 0, offsetY = 0;

    if (minX < canvasMinX) {
      offsetX = canvasMinX - minX;
    } else if (maxX > GAME_CONFIG.width) {
      offsetX = GAME_CONFIG.width - maxX;
    }

    if (minY < canvasMinY) {
      offsetY = canvasMinY - minY;
    } else if (maxY > GAME_CONFIG.height) {
      offsetY = GAME_CONFIG.height - maxY;
    }

    // 如果需要调整，更新积木组位置
    if (offsetX !== 0 || offsetY !== 0) {
      group.x(groupX + offsetX);
      group.y(groupY + offsetY);
    }
  }

  /**
   * 获取积木组
   * @returns {Konva.Group}
   */
  getGroup() {
    return this.group;
  }

  /**
   * 获取物理状态
   * @returns {Object}
   */
  getPhysics() {
    return this.group.physics;
  }

  /**
   * 销毁积木
   */
  destroy() {
    this.group.destroy();
    this.blocks = [];
  }
}