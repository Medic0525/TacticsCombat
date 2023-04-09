export function deepCopyOf (arr) {
    let newarr = [];
    for (let item of arr) newarr.push(item)
    return newarr
}
export function itemPoped (arr, item) {
    let others = deepCopyOf (arr);
    let index = arr.indexOf(item);
    if (index===-1) throw new Error("why isn't the item you're looking for there?")
    others.splice(index,1);
    return others
}
export function multiply2DVectors ([x1,y1], [x2,y2]) {
    return [x1*x2, y1*y2]
}
export function addUp2DVectors ([x1,y1], [x2,y2]) {
    return [x1+x2, y1+y2]
}
export function minus2DVectors ([x1,y1], [x2,y2]) {
    return [x1-x2, y1-y2]
}
