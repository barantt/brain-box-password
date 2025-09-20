// 工具函数

/**
 * 生成网格坐标的键
 * @param {number} x
 * @param {number} y
 * @returns {string}
 */
export function getGridKey(x, y) {
  return `${Math.round(x)},${Math.round(y)}`;
}

/**
 * 计算两点之间的距离
 * @param {Object} point1
 * @param {Object} point2
 * @returns {number}
 */
export function getDistance(point1, point2) {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.hypot(dx, dy);
}

/**
 * 深度复制对象
 * @param {Object} obj
 * @returns {Object}
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 防抖函数
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 检查点是否在菱形区域内
 * @param {Object} point
 * @param {Object} center
 * @param {number} size
 * @returns {boolean}
 */
export function isPointInDiamond(point, center, size) {
  const dx = Math.abs(point.x - center.x);
  const dy = Math.abs(point.y - center.y);
  return (dx / size + dy / size) <= 1;
}