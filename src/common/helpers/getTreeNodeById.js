export function getTreeNodeById(files, nodeId) {
    for (let i = 0; i < files.length; i++) {
        if (files[i].id === nodeId) {
            return files[i];
        } else if (files[i].children && files[i].children.length) {
            return getTreeNodeById(files[i].children, nodeId);
        }
    }
}