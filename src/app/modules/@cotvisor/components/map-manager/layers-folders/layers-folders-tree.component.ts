import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { LayersFolderClass } from './layers-folder.class';
import { LayersFoldersTreeService } from './layers-folders-tree.service';
import { takeUntil } from 'rxjs/operators';
import { CdkDragDrop } from '@angular/cdk/drag-drop';


/**
 * Componente que muestra la estructura de capas y carpetas de un mapa recibido
 *
 * @export
 * @class LayersFoldersTreeComponent
 */
@Component({
  selector: 'cot-layers-folders-tree',
  templateUrl: './layers-folders-tree.component.html',
  encapsulation: ViewEncapsulation.None
})
export class LayersFoldersTreeComponent extends ParentComponent implements OnInit {

  @Input() public scrollContainer: any;  // Carpeta root del árbol. Viene el elemento ion-content
  public rootFolder: LayersFolderClass;

  constructor(private layersFoldersTreeService: LayersFoldersTreeService) {
    super();

  }

  public ngOnInit(): void {
    this.layersFoldersTreeService.getRootFolder()
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (rootFolder: LayersFolderClass) => {
          this.rootFolder = rootFolder;
        });
  }

  // public ngAfterViewInit(): void {
  //   // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
  //   // Add 'implements AfterViewInit' to the class.
  //   let drake = this.dragulaService.find('TOC').drake;
  //   if (!drake) {
  //     drake = dragula();
  //     this.dragulaService.add('TOC', drake);
  //   }

  //   // añadimos el scroll automático cuando se está arrastrando un elemento del árbol
  //   this.scroll = autoScroll(
  //     // can also be an array of elements if they're { overflow: auto; max-height: XXpx } containers.
  //     // i.e. [someViewChild.nativeElement]
  //     this.scrollContainer._scrollContent.nativeElement,
  //     {
  //       margin: 30,
  //       maxSpeed: 25,
  //       scrollWhenOutside: true,

  //       autoScroll() { // don't use () => {} syntax, we want to keep the 'this'
  //         // Only scroll when the pointer is down, and there is a child being dragged.
  //         return this.down && drake.dragging;
  //       },
  //     });

  //   this.dragulaService.drop.pipe(takeUntil(this.unSubscribe)).subscribe((value) => {
  //     this.onDrop(value.slice(1));
  //   });

  //   this.dragulaService.over.pipe(takeUntil(this.unSubscribe)).subscribe((value) => {
  //     this.onOver(value.slice(1));
  //   });

  //   /*     this.dragulaService.out.pipe(takeUntil(this.unSubscribe)).subscribe((value) => {
  //         this.onOut(value.slice(1));
  //       }); */
  // }

  public onDrop(event: CdkDragDrop<string[]>) {
    alert('mover');
    // const [element, listSink, listSource] = event; // element, elementListSink,elementListSource,nextElement

    // const fromFolder = listSource.dataset.folder;
    // const toFolder = listSink.dataset.folder;
    // // Recogemos la carpeta destino y comprobamos el orden del elemento dentro de las capas/carpetas
    // const foldersHTMLArray = Array.from(listSink.children);
    // const order = foldersHTMLArray.indexOf(element);
    // const nodeId = element.dataset.nodeid;
    // const type = element.localName === 'app-layers-folders-tree-node' ? 'folder' : 'layer';
    // this.layersFoldersTreeService.moveNode(nodeId, fromFolder, toFolder, type, order);
  }

  // private onOver(args) {
  //   const [element, listSink] = args; // element, elementListSink,elementListSource,nextElement
  //   // Añado la clase que destacaba el contenedor de la carpeta
  //   // listSink.classList.add('ex-over');
  //   if (element.localName === 'app-layers-folders-tree-node') { // Si se trata de una carpeta
  //     const nodeId = element.dataset.nodeid;
  //     const toFolder = listSink.dataset.folder;
  //     const folder = this.layersFoldersTreeService.getFolderByNodeId(nodeId);
  //     const toParentFolder = this.layersFoldersTreeService.getFolderByNodeId(toFolder);
  //     folder.deepLevel = toParentFolder.deepLevel + 1;
  //   }
  // }

  // /*   private onOut(args) {
  //     let [element, listSink] = args; //element, elementListSink,elementListSource,nextElement
  //     // Elimino la clase que destacaba el contenedor de la carpeta
  //     listSink.classList.remove('ex-over');
  //   } */

  // public ngOnDestroy() {
  //   super.ngOnDestroy();
  //   this.dragulaService.destroy('TOC');
  //   this.scroll.destroy();
  // }
}
