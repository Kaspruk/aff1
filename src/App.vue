<template>
  <v-app>
    <l-header/>
    <v-main>
      <file-manager-window
        v-for="(manager, index) in fileManagers"
        :key="index"
        v-bind="manager"
        :items="files"
        :manager-index="index"
        :active="manager.active"
        @insertFiles="onInsertFiles(index)"
        @removeFiles="onRemoveFiles($event || manager.selectedFiles)"
        @setActive="changeActiveManager(index)"
        @setActiveFolder="manager.activeFolder = $event"
        @setSelectedFiles="manager.selectedFiles = $event"
        @setFilesWaitingForCut="manager.filesWaitingForCut = $event"
        @dragAndDrop="onDragAndDrop(index, $event)"
      />
    </v-main>
    <l-dialog/>
  </v-app>
</template>

<script>
const FakeData = require('./config/FakeData.json');

import LDialog from '@/components/layouts/LDialog';
import LHeader from '@/components/layouts/LHeader';
import FileManagerWindow from '@/components/shared/FileManagerWindow';

import {cloneDeep} from 'lodash-es';

export default {
    components: {
        LHeader,
        LDialog,
        FileManagerWindow,
    },
    data: () => ({
        files: FakeData,
        activeWindow: 'first',
        fileManagers: [
            {
                active: true,
                activeFolder: null,
                selectedFiles: [],
                filesWaitingForCut: [],
            },
            {
                active: false,
                activeFolder: null,
                selectedFiles: [],
                filesWaitingForCut: [],
            },
        ],
    }),
    methods: {
        changeActiveManager(index) {
            this.fileManagers.forEach((manager, i) => {
                manager.selectedFiles = [];
                manager.active = index === i;
            });
        },
        onRemoveFiles(files) {
            const hasFolder = files.some(file => file.type === 'folder');

            if (hasFolder) {
                this.$openDialog({
                    component: 'confirmation',
                    params: {
                        width: 400,
                    },
                    props: {
                        showReject: true,
                        rejectText: this.$t('buttons.cancel'),
                        resolveText: this.$t('buttons.remove'),
                        text: this.$t('dialogs.confirmRemoveFolder'),
                    },
                }).then(() => this.removeFiles(files));
            } else {
                this.removeFiles(files);
            }
        },
        removeFiles(files) {
            files.forEach(file => {
                this.fileManagers.forEach(manager => {
                    if (manager.activeFolder && manager.activeFolder.id === file.id) {
                        manager.activeFolder = null;
                    }
                });

                this.files.splice(this.files.findIndex(f => f.id === file.id), 1);
            });
        },
        onInsertFiles(index) {
            let waitingForCutFiles = this.fileManagers[index].filesWaitingForCut;
            if (!waitingForCutFiles.length) {
                waitingForCutFiles = this.fileManagers.filter(manager => {
                    return manager.filesWaitingForCut.length
                }).flatMap(manager => manager.filesWaitingForCut)
            }

            const newFilesArr = this.switchFilesPosition(this.fileManagers[index].activeFolder, waitingForCutFiles);
            this.fileManagers[index].filesWaitingForCut = [];
            this.files = newFilesArr;
        },
        onDragAndDrop(currentIndex, fromIndex) {
          this.files = this.switchFilesPosition(
              this.fileManagers[currentIndex].activeFolder,
              this.fileManagers[fromIndex].selectedFiles
          );
        },
        switchFilesPosition(oldFolder, filesToSwitch) {
            const allFiles = cloneDeep(this.files);

            const folderIndex = oldFolder ? allFiles.findIndex(f => f.id === oldFolder.id) : -1;
            if (folderIndex !== -1 && filesToSwitch.includes(allFiles[folderIndex].id)) {
                return;
            }

            let oldParentFolder;
            filesToSwitch.forEach(file => {
                const fileIndex = allFiles.findIndex(f => f.id === file.id);

                if (allFiles[fileIndex].parentId) {
                    if (!oldParentFolder) {
                        oldParentFolder = allFiles.find(file => file.id === allFiles[fileIndex].parentId);
                    }
                    oldParentFolder.children.splice(oldParentFolder.children.indexOf(file.id), 1);
                }

                if (oldFolder) {
                    allFiles[fileIndex].parentId = oldFolder.id;
                    allFiles[folderIndex].children.push(file.id);
                } else {
                    allFiles[fileIndex].parentId = null;
                }
            });
            this.updateActiveFolders(allFiles, folderIndex);

            return allFiles;
        },
        updateActiveFolders(newFilesArr) {
            this.fileManagers.forEach(manager => {
                if (manager.activeFolder) {
                    manager.activeFolder = newFilesArr.find(file => file.id === manager.activeFolder.id);
                    manager.selectedFiles = [];
                    manager.filesWaitingForCut = [];
                }
            });
        },
    },
};
</script>