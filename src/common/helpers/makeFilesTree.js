export function makeFilesTree(files, parentArray, parent) {
    if (!parentArray) {
        parentArray = files.filter(parent => !parent.parentId)
    }

    return parentArray.map(file => {
        if (file.children && file.children.length) {
            const childrenArr = [];
            file.children.forEach(fileId => {
                const child = files.find(file => file.id === fileId);
                if (child) {
                    childrenArr.push(child);
                }
            })
            file.children = childrenArr.length ? makeFilesTree(files, childrenArr, file) : [];
        }
        if (parent) {
            file.parentId = parent.id;
        }

        return file
    })
}
