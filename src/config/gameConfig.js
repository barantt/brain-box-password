// 游戏配置参数
export const GAME_CONFIG = {
  // 画布尺寸
  width: 900,
  height: 700,

  // 游戏元素尺寸
  halfBlockSize: 30,

  // 物理系统配置
  physics: {
    force: 0.3,      // 重力加速度
    friction: 0.98,  // 空气阻力
    bounce: 5,       // 反弹系数
    groundY: 700     // 地面位置
  },

  // 网格配置
  grid: {
    rows: 11,        // 从 -5 到 5
    cols: 9,         // 从 -4 到 4
    maxSnapDistance: 90,  // 最大吸附距离 (halfBlockSize * 3)
    tolerance: 5     // 吸附容错范围
  },

  // 积木配置
  blocks: {
    count: 12,
    spacing: 120,    // 垂直间距
    startX: 600,     // 起始X位置 (width/2 + 150)
    startY: 50       // 起始Y位置
  },

  // UI配置
  ui: {
    celebration: {
      duration: 5000,  // 庆祝动画持续时间
      tweenDuration: 0.8
    }
  }
};

// 积木形状和颜色配置
export const BLOCK_SHAPES = [
  {
    shape: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 0, 0],
      [1, 0, 0]
    ],
    color: {
      fill: '#572765',
      stroke: '#572765'
    }
  },
  {
    shape: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
    ],
    color: {
      fill: '#193376',
      stroke: '#193376'
    }
  },
  {
    shape: [
      [1, 0, 0],
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: {
      fill: '#e4132e',
      stroke: '#e4132e'
    }
  },
  {
    shape: [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
    color: {
      fill: '#058434',
      stroke: '#058434'
    }
  },
  {
    shape: [
      [0, 0, 0],
      [0, 0, 1],
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: {
      fill: '#dc506e',
      stroke: '#dc506e'
    }
  },
  {
    shape: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 1],
      [0, 0, 0],
    ],
    color: {
      fill: '#9dc9ba',
      stroke: '#9dc9ba'
    }
  },
  {
    shape: [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    color: {
      fill: '#85381c',
      stroke: '#85381c'
    }
  },
  {
    shape: [
      [0, 0, 0],
      [0, 1, 1],
      [0, 0, 1],
      [0, 1, 1],
    ],
    color: {
      fill: '#dbb301',
      stroke: '#dbb301'
    }
  },
  {
    shape: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: {
      fill: '#fe200c',
      stroke: '#fe200c'
    }
  },
  {
    shape: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
    color: {
      fill: '#dfbca8',
      stroke: '#dfbca8'
    }
  },
  {
    shape: [
      [1, 0, 0],
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
    ],
    color: {
      fill: '#9daf26',
      stroke: '#9daf26'
    }
  },
  {
    shape: [
      [1, 0, 0],
      [1, 1, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    color: {
      fill: '#cfc2a4',
      stroke: '#cfc2a4'
    }
  }
];