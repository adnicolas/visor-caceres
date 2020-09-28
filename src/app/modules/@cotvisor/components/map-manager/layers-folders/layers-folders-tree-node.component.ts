import { Component, Input } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { LayersFolderClass } from './layers-folder.class';
import { LayersFoldersTreeService } from './layers-folders-tree.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';


/**
 * Componente que muestra la estructura de capas y carpetas de un mapa recibido
 *
 * @export
 * @class LayersFoldersTreeComponent
 */
@Component({
  selector: 'cot-layers-folders-tree-node',
  templateUrl: './layers-folders-tree-node.component.html',
  styleUrls: ['./layers-folders-tree-node.component.scss']

})
export class LayersFoldersTreeNodeComponent extends ParentComponent {

  @Input() public layersFolder: LayersFolderClass;
  // protected dragulaOptions: any;
  // public FOLDER_OPENED_ICON = 'folder-open';
  // public FOLDER_CLOSED_ICON = 'folder';

  constructor(private layersFoldersTreeService: LayersFoldersTreeService) {
    super();
  }

  /**
   * abre o cierra la carpeta
   *
   * @memberof LayersFoldersTreeNodeComponent
   */
  public toggle() {
    if (!this.layersFolder.editable) {
      this.layersFolder.open = !this.layersFolder.open;
    }
  }

  /**
   * Dejar de editar la carpeta
   *
   * @memberof LayersFoldersTreeNodeComponent
   */
  public stopEdit($event) {
    this.layersFolder.editable = false;
    this.layersFoldersTreeService.changeUserFolderName(this.layersFolder);
  }

  // /**
  //  * mostrar popover
  //  *
  //  * @param {*} $event
  //  * @memberof LayersFoldersTreeNodeComponent
  //  */
  // public showOptionsPopover($event) {
  //   this.popoverService.presentMapFolderPopover($event, this.layersFolder);
  // }

  // public openAddLayersModal() {
  //   this.layersFoldersTreeService.setSelectedFolder(this.layersFolder);
  //   this.modalService.showModal(AddLayersModalComponent);
  // }

  public onDrop(event: CdkDragDrop<string[]>) {
    alert(`mover del ${event.previousIndex} al ${event.currentIndex} del contenedor ${event.previousContainer.id} al ${event.container.id}`);
  }
}
