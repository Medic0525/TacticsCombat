deepCopyOf = (arr) => {
    let newarr = [];
    for (let item of arr) newarr.push(item)
    return newarr
}
itemPoped = (arr, item) => {
    let others = deepCopyOf (arr);
    let index = arr.indexOf(item);
    if (index===-1) throw new Error("why isn't the item you're looking for there?")
    others.splice(index,1);
    return others
}