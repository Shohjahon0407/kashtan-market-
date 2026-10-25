// Each store appears once per cycle, with no repeat across cycle boundaries.
export function createShuffleBag(keys, random = Math.random) {
  let bag = [],
    last;
  return () => {
    if (!bag.length) {
      bag = [...keys];
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      if (bag.length > 1 && bag[0] === last)
        [bag[0], bag[1]] = [bag[1], bag[0]];
    }
    last = bag.shift();
    return last;
  };
}
