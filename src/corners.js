import { distance } from './aim';

function inside(source, targetMin, targetMax) {
  if (source >= targetMin && source <= targetMax) return 0;
  else if (source > targetMin) return -1;
  else return 1;
}

export function corners(source, target) {
  source = { left: source.pageX, top: source.pageY };
  target = target.getBoundingClientRect();

  let ver, hor;

  hor = inside(source.left, target.left, target.left + target.width);
  ver = inside(source.top, target.top, target.top + target.height);

  if (hor === -1 && ver === -1) return ['top-right', 'bottom-left'];
  if (hor === -1 && ver === 0) return ['top-right', 'bottom-right'];
  if (hor === -1 && ver === 1) return ['top-left', 'bottom-right'];

  if (hor === 0 && ver === -1) return ['bottom-right', 'bottom-left'];
  if (hor === 0 && ver === 0) return [];
  if (hor === 0 && ver === 1) return ['top-left', 'top-right'];

  if (hor === 1 && ver === -1) return ['bottom-right', 'top-left'];
  if (hor === 1 && ver === 0) return ['bottom-left', 'top-left'];
  if (hor === 1 && ver === 1) return ['bottom-left', 'top-right'];
}

export function boundaries(corners, source, target) {
  target = target.getBoundingClientRect();
  source = {
    left: source.pageX,
    top: source.pageY
  };

  const dist = distance({ x: target.left + target.width / 2, y: target.top + target.height / 2 }, { x: source.left, y: source.top });
  const tolerance = Math.round(dist / 10);
  const position = {
    left: target.left - tolerance,
    top: target.top - tolerance,
    width: target.width + tolerance * 2,
    height: target.height + tolerance * 2
  };

  var doc = document.documentElement;
  var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

  let first = true;
  let positions = [];
  corners.forEach(corner => {
    switch (corner) {
    case 'top-right':
      if (first) positions.push({ x: target.left + target.width + left, y: target.top + top });
      positions.push({ x: position.left + position.width + left, y: position.top + top });
      if (!first) positions.push({ x: target.left + target.width + left, y: target.top + top });
      break;
    case 'top-left':
      if (first) positions.push({ x: target.left + left, y: target.top + top });
      positions.push({ x: position.left + left, y: position.top + top });
      if (!first) positions.push({ x: target.left + left, y: target.top + top });
      break;
    case 'bottom-right':
      if (first) positions.push({ x: target.left + target.width + left, y: target.top + target.height + top });
      positions.push({ x: position.left + position.width + left, y: position.top + position.height + top });
      if (!first) positions.push({ x: target.left + target.width + left, y: target.top + target.height + top });
      break;
    case 'bottom-left':
      if (first) positions.push({ x: target.left + left, y: target.top + target.height + top });
      positions.push({ x: position.left + left, y: position.top + position.height + top });
      if (!first) positions.push({ x: target.left + left, y: target.top + target.height + top });
      break;
    }
    if (first) {
      positions.push({ x: source.left, y: source.top });
    }
    first = false;
  });

  return positions;
}

export default corners;
