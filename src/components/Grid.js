import { GAME_CONFIG } from '../config/gameConfig.js';
import { getGridKey, getDistance } from '../utils/helpers.js';

export class Grid {
  constructor(stage, layer) {
    this.stage = stage;
    this.layer = layer;
    this.centers = [];
    this.occupancy = new Map();
    this.group = null;

    this.init();
  }

  /**
   * 初始化网格
   */
  init() {
    // 创建网格组
    this.group = new Konva.Group({
      x: 0,
      y: 0,
      width: GAME_CONFIG.width / 2,
      height: GAME_CONFIG.height,
      name: 'grid'
    });

    // 创建背景
    const background = new Konva.Rect({
      width: GAME_CONFIG.width / 2,
      height: GAME_CONFIG.height,
      fill: '#817863',
      stroke: 'black',
      strokeWidth: 1,
    });
    this.group.add(background);

    // 生成菱形网格
    this.generateDiamondGrid();

    // 初始化占用状态
    this.initOccupancy();

    this.layer.add(this.group);
  }

  /**
   * 生成菱形网格
   */
  generateDiamondGrid() {
    const center = {
      x: GAME_CONFIG.width / 2,
      y: GAME_CONFIG.height / 2
    };

    for (let i = -4; i <= 4; i++) {
      for (let j = 5; j >= -5; j--) {
        if (Math.abs(i % 2) === Math.abs(j % 2)) {
          continue;
        }

        const x = i * GAME_CONFIG.halfBlockSize + center.x / 2;
        const y = j * GAME_CONFIG.halfBlockSize + center.y;

        this.centers.push({ x, y });

        // 创建网格方块
        const block = this.createGridBlock(x, y);
        this.group.add(block);
      }
    }
  }

  /**
   * 创建单个网格方块
   * @param {number} x
   * @param {number} y
   * @returns {Konva.Line}
   */
  createGridBlock(x, y) {
    return new Konva.Line({
      points: [
        x, y + GAME_CONFIG.halfBlockSize,
        x + GAME_CONFIG.halfBlockSize, y,
        x, y - GAME_CONFIG.halfBlockSize,
        x - GAME_CONFIG.halfBlockSize, y
      ],
      fill: 'white',
      stroke: 'grey',
      strokeWidth: 1,
      closed: true,
    });
  }

  /**
   * 初始化网格占用状态
   */
  initOccupancy() {
    this.centers.forEach(grid => {
      const key = getGridKey(grid.x, grid.y);
      this.occupancy.set(key, null);
    });
  }

  /**
   * 检查网格是否被占用
   * @param {number} x
   * @param {number} y
   * @param {Konva.Group} excludeGroup
   * @returns {boolean}
   */
  isOccupied(x, y, excludeGroup = null) {
    const key = getGridKey(x, y);
    const occupiedBy = this.occupancy.get(key);
    return occupiedBy !== null && occupiedBy !== excludeGroup;
  }

  /**
   * 占用网格
   * @param {number} x
   * @param {number} y
   * @param {Konva.Group} group
   */
  occupy(x, y, group) {
    const key = getGridKey(x, y);
    this.occupancy.set(key, group);
  }

  /**
   * 释放网格
   * @param {number} x
   * @param {number} y
   */
  release(x, y) {
    const key = getGridKey(x, y);
    this.occupancy.set(key, null);
  }

  /**
   * 释放组占用的所有网格
   * @param {Konva.Group} group
   */
  releaseGroupGrids(group) {
    for (const [key, occupiedBy] of this.occupancy.entries()) {
      if (occupiedBy === group) {
        this.occupancy.set(key, null);
      }
    }
  }

  /**
   * 查找最近的网格
   * @param {number} x
   * @param {number} y
   * @param {number} maxDist
   * @returns {Object|null}
   */
  findNearestGrid(x, y, maxDist) {
    let best = null;
    let bestD = Infinity;

    for (const grid of this.centers) {
      const distance = getDistance(grid, { x, y });

      if (distance < bestD && distance <= maxDist) {
        bestD = distance;
        best = grid;
      }
    }

    return best;
  }

  /**
   * 检查拼图是否完成
   * @returns {boolean}
   */
  checkCompletion() {
    let occupiedCount = 0;
    for (const [key, occupiedBy] of this.occupancy.entries()) {
      if (occupiedBy !== null) {
        occupiedCount++;
      }
    }

    return occupiedCount === this.centers.length;
  }

  /**
   * 获取所有网格中心点
   * @returns {Array}
   */
  getCenters() {
    return this.centers;
  }

  /**
   * 获取占用状态
   * @returns {Map}
   */
  getOccupancy() {
    return this.occupancy;
  }

  /**
   * 重置网格
   */
  reset() {
    this.occupancy.clear();
    this.initOccupancy();
  }

  /**
   * 销毁网格
   */
  destroy() {
    this.group.destroy();
    this.occupancy.clear();
    this.centers = [];
  }
}