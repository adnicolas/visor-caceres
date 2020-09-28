import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { VsMapUserMap } from '@cotvisor/models/vs-map-user-map';
import { UserDocModel, UserModel } from '@cotvisor-admin/models';
import { GlobalAuthService, UserDocsService } from '@cotvisor-admin/services';
import { VsMapService } from '@cotvisor/services/vs-map.service';
import { takeUntil } from 'rxjs/operators';

/**
 * Componente que muestra los documentos de un mapa recibido
 *
 * @export
 * @class MapManagerDocsComponent
 */
@Component({
  selector: 'cot-map-manager-docs',
  templateUrl: './map-manager-docs.component.html',
  // styleUrls: ['./map-manager-docs.component.scss']
})
export class MapManagerDocsComponent extends ParentComponent implements OnInit, OnDestroy {

  @Input() public vsMapUserMap: VsMapUserMap;
  public documents: UserDocModel[];
  public docsFolderOpen = false;
  public icons = [];
  private availableFormats = ['PNG', 'JPG', 'JPEG', 'ZIP', 'XML', 'XLSX',
    'XLS', 'TXT', 'TIF', 'PPT', 'PDF', 'DWG', 'DOCX', 'DOC', 'CSV'];
  public userLoggedIn: boolean = false;

  private loggedUser: UserModel;
  public userIsOwner: boolean;

  constructor(
    private globalAuthService: GlobalAuthService,
    private userDocsService: UserDocsService,
    private vsMapService: VsMapService) {
    super();
    this.vsMapService.activeMapChanged$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((vsMap: VsMapUserMap) => this.vsMapUserMap = vsMap);
  }

  public ngOnInit(): void {
    this.documents = this.vsMapUserMap.userMapSource.documents;
    this.assignIcons(this.documents);

    this.globalAuthService.authState$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (user) => {
          this.loggedUser = user;
          if (user) {
            this.userLoggedIn = true;
          } else {
            this.userLoggedIn = false;
          }
        },
      );
    this.loggedUser = this.globalAuthService.getCurrentUser();

    // TODO:
    // SUSCRIBIRSE AL MAPA PARA OBTENER LOS DOCUMENTOS QUE SE AÑADAN tras la carga inicial
    // this.vsMapUserMap.observableDocAdded$.pipe(takeUntil(this.unSubscribe)).subscribe(
    //     (newDoc) => {
    //         this.addDocToDocList(newDoc);
    //     }
    // )
  }

  /**
   * Asignar icon al documento segun su formato
   *
   * @param {UserDocModel[]} docs
   * @memberof MapManagerDocsComponent
   */
  public assignIcons(docs: UserDocModel[]) {
    const RUTA = 'assets/icons/file-formats/';
    docs.forEach((doc, i) => {
      const ft = doc.fileType;
      if (this.availableFormats.indexOf(ft) !== -1) {
        this.icons[i] = RUTA + ft + '.png';
      } else {
        this.icons[i] = RUTA + 'unknown.png';
      }
    });
  }

  /**
   * Descargar documento onClick
   *
   * @param {*} doc
   * @memberof MapManagerDocsComponent
   */
  public downloadDocument(doc) {
    this.userDocsService.downloadDoc(doc.id);
  }

  /**
   * quitar documento del mapa
   *
   * @param {*} doc
   * @memberof MapManagerDocsComponent
   */
  public removeDocument(doc) {
    // TODO ADAPTAR

    alert('Pte de adaptar ' + doc);
    // const alert = this.alertController.create({
    //     title: this.getLiteral('delete_title'),
    //     // @ts-ignore
    //     message: this.literals.confirmRemoval,
    //     buttons: [
    //         {
    //             text: this.getLiteral('delete_no'),
    //             role: 'cancel',
    //             cssClass: '',
    //             handler: () => {
    //                 // @ts-ignore
    //                 this.toastService.presentAutocloseToast(this.literals.cancelled);
    //             },
    //         },
    //         {
    //             text: this.getLiteral('delete_yes'),
    //             cssClass: '',
    //             handler: () => {
    //                 // remove map id from document & save
    //                 Utilities.removeElementByKeyFromArray(this.vsMapUserMap.userMapSource.documents, 'id', doc.id);
    //                 // @ts-ignore
    //                 this.toastService.presentAutocloseToast(this.literals.documentRemoved);
    //             },
    //         },
    //     ],
    // });
    // alert.present();
  }

  /**
   * mostrar/esconder docs container
   *
   * @memberof MapManagerDocsComponent
   */
  public toggleDocuments() {
    this.docsFolderOpen = !this.docsFolderOpen;
  }

  /**
   * mostrar popover
   *
   * @param {*} $event
   * @memberof MapManagerDocsComponent
   */
  public showPopover($event) {
    // TODO adaptar
    alert('adaptar');
    // this.popoverService.presentMapDocsPopover($event);
  }
  /**
   * mostrar Modal
   *
   * @memberof MapManagerDocsComponent
   */
  public showModal() {
    // TODO mostrar modal de carga
    alert('mostrar modal de carga a ' + this.loggedUser);
    // const modal = this.modalService.showModal(UploadDocsModalComponent, { userId: this.loggedUser.id, existingDocs: this.documents, type: 'map' });
    // modal.onDidDismiss((selected: { selectedDocuments: UserDocModel[] }) => {
    //     if (selected) {
    //         if (selected.selectedDocuments) {
    //             this.changeUserDocs(selected.selectedDocuments);
    //         }
    //     }
    // });
  }

  /**
   *
   *
   * @param {*} selectedDocs
   * @memberof MapManagerDocsComponent
   */
  public changeUserDocs(selectedDocs) {
    for (const doc of selectedDocs) {
      this.documents.push(doc);
    }
    this.assignIcons(this.documents);
  }

}
