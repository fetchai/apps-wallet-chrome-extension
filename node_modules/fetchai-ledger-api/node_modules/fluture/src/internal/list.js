export const empty = ({isEmpty: true, size: 0, head: null, tail: null});
export const cons = (head, tail) => ({isEmpty: false, size: tail.size + 1, head, tail});
