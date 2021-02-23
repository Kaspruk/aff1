<template>
  <div
    ref="wrapper"
    :class="{'file-manager-window--disabled': !active}"
    class="file-manager-window"
    @click="!active && $emit('setActive')"
  >
    <c-address-line
      :items="breadcrumbs"
      prefix="/"
      @openFile="openFile"
    />
    <files-table
      :items="files"
      :show-return="!!activeFolder"
      @openFile="openFile"
      @selectFile="selectFile"
      @itemCtrlClick="selectFiles"
      @itemDragEnd="onDragEnd"
      @onReturn="goToParentFolder"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import {cloneDeep} from 'lodash-es';
import FilesTable from '@/components/shared/FilesTable';
import CAddressLine from '@/components/ui/CAddressLine';

export default {
    name: 'FileManagerWindow',
    inheritAttrs: false,
    props: {
        items: { type: Array, default: () => ([]) },
        active: { type: Boolean, default: false },
        managerIndex: { type: Number, default: 0 },
        activeFolder: { type: Object, default: null },
        selectedFiles: { type: Array, default: () => ([]) },
        filesWaitingForCut: { type: Array, default: () => ([]) }
    },
    components: {
        CAddressLine,
        FilesTable,
    },
    data: () => ({
        files: [],
        breadcrumbs: [],
        isDragOvered: false,
    }),
    mounted() {
        this.registerGlobalEvents();
    },
    watch: {
        items: {
            handler() {
                this.getFilesByFolder(this.activeFolder);
            },
            immediate: true,
        },
    },
    methods: {
        openFile(file) {
            if (file) {
                if ((this.activeFolder && this.activeFolder.id === file.id) || file.type !== 'folder') {
                    return;
                }

                this.setBreadcrumbs(file);
                this.$emit('setActiveFolder', file);
            } else {
                this.breadcrumbs = [];
                this.$emit('setActiveFolder', null);
            }
            this.$emit('setSelectedFiles', []);
            this.getFilesByFolder(file);
        },
        setBreadcrumbs(file) {
            if (this.breadcrumbs.length) {
                const hasItemIndex = this.breadcrumbs.findIndex(item => item.id === file.id);

                if (hasItemIndex > -1) {
                    this.breadcrumbs = this.breadcrumbs.slice(0, hasItemIndex+1)
                } else {
                    this.breadcrumbs.push(file)
                }
            } else {
                this.breadcrumbs.push(file)
            }
        },
        goToParentFolder() {
            const parentFolder = this.items.find(item => item.id === this.activeFolder.parentId);
            this.openFile(parentFolder);
        },
        getFilesByFolder(folder) {
            this.files = cloneDeep(this.items.filter(file => {
                const condition = folder ? folder.children.includes(file.id) : !file.parentId;

                if (condition) {
                    file.isSelected = !!this.selectedFiles.find(f => f.id === file.id);
                    file.isWaitingForCut = !!this.filesWaitingForCut.find(f => f.id === file.id);
                }

                return condition;
            }));
        },
        selectFile(file) {
            this.$emit('setSelectedFiles', file ? [file] : []);
            this.files.forEach(f => f.isSelected = file ? (f.id === file.id && !f.isSelected) : false);
        },
        selectFiles(file) {
            if (file) {
                const fileIndex = this.selectedFiles.findIndex(f => f.id === file.id);
                const selectedFilesCopy = this.selectedFiles.slice(0);

                if (fileIndex === -1) {
                    selectedFilesCopy.push(file);
                } else {
                    selectedFilesCopy.splice(fileIndex, 1)
                }

                this.$emit('setSelectedFiles', selectedFilesCopy);
                this.files.forEach(file => file.isSelected = selectedFilesCopy.find(f => f.id === file.id));
            }
        },
        cutFiles(files) {
            this.$emit('setFilesWaitingForCut', files.slice(0))
            this.files.forEach(file => file.isWaitingForCut = !!files.find(f => f.id === file.id));
        },
        resetCutFiles() {
            this.$emit('setFilesWaitingForCut', []);
            this.files.forEach(file => this.$set(file, 'isWaitingForCut', false));
        },
        registerGlobalEvents() {
            this.keypressEvents();
            this.dragAndDropEvents();
        },
        keypressEvents() {
            const callback = e => {
                if (this.active) {
                    if (e.keyCode === 46 && this.selectedFiles.length) {
                        this.$emit('removeFiles');
                        this.selectFile(null);
                    } else if (e.keyCode === 38 || e.keyCode === 40) {
                        this.onPressKeyArrow(e.keyCode === 40);
                    } else if ((e.keyCode === 88 && (e.ctrlKey || e.metaKey)) && this.selectedFiles.length) {
                        this.cutFiles(this.selectedFiles);
                    } else if ((e.keyCode === 86 && (e.ctrlKey || e.metaKey))) {
                        this.$emit('insertFiles');
                    } else if (e.keyCode === 27) {
                        this.resetCutFiles();
                    }
                }
            };

            addEventListener('keydown', callback);
            this.$on('hook:beforeDestroy', () => removeEventListener('keydown', callback));
        },
        onPressKeyArrow(isDownDirection) {
            if (this.selectedFiles.length) {
                const lastSelectedFile = this.selectedFiles[this.selectedFiles.length - 1];
                const lastSelectedFileIndex = this.files.findIndex(file => file.id === lastSelectedFile.id);

                let nextItemIndex;
                if (isDownDirection) {
                    if (lastSelectedFileIndex === this.files.length - 1) {
                        nextItemIndex = 0;
                    } else {
                        nextItemIndex = lastSelectedFileIndex + 1;
                    }
                } else {
                    if (!lastSelectedFileIndex) {
                        nextItemIndex = this.files.length - 1;
                    } else {
                        nextItemIndex = lastSelectedFileIndex - 1;
                    }
                }

                this.selectFile(this.files[nextItemIndex]);
            } else {
                this.selectFile(this.files[0]);
            }
        },
        dragAndDropEvents() {
            this.$eventBus.$on('onDrop', ({dropElement, fromManagerIndex}) => {
                if (dropElement === this.$refs.wrapper || this.$isDescendant(this.$refs.wrapper, dropElement)) {
                    this.$emit('dragAndDrop', fromManagerIndex);
                }
            });
        },
        onDragEnd(dropElement) {
            this.$eventBus.$emit('onDrop', {dropElement, fromManagerIndex: this.managerIndex});
        },
    },
};
</script>

<style lang="scss">
@import "src/assets/styles/shared/FileManagerWindow";
</style>