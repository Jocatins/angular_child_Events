import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { TransInfo } from '../model/transinfo.model';
import { IBatch, Batch } from 'app/shared/model/batch.model';
import { TransactionService } from 'app/entities/transaction/transaction.service';
import {
  ISupportingDocument,
  SupportingDocument,
} from 'app/shared/model/supporting-document.model';
import { BatchService } from '../ext/batch/batch.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { MandatoryDocument } from 'app/shared/model/ext/document.model';
import { IEGISDIctionary } from '../model/egisdictionary.model';
import { SupportingDocumentService } from 'app/entities/supporting-document/supporting-document.service';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SupportingDocumentDeleteDialogComponent } from '../ext/supporting-document/supporting-document-delete-dialog.component';
import { DictionaryService } from 'app/entities/dictionary/dictionary.service';
import { IDictionary } from 'app/shared/model/dictionary.model';
import { faLessThan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'jhi-trans-detail',
  templateUrl: './supporting-docs.component.html',
  styleUrls: ['supporting-docs.component.scss'],
})
export class SupportingDocsComponent implements OnInit {
  batch: IBatch;
  message: string;
  code_: string;
  tab_: string;
  transInfo: TransInfo;
  docsreceived: boolean;
  prerequisite: boolean;
  procedure: boolean;
  associated: boolean;
  form: boolean;
  supportingDocuments: ISupportingDocument[];
  supportingDocumentsOthers: ISupportingDocument[];
  mandatoryDocs: MandatoryDocument[];
  documentTypes: IEGISDIctionary[];
  madatorySupportingDocuments: Array<IDictionary> = [];
  otherSupportingDocuments: IDictionary[];
  selectedFile: File;
  fileName: string;
  fileNameOthers: string;
  supportingDocument: ISupportingDocument;
  content: any;
  map = new Map();
  typeOfDoc: string;
  batchId: number;
  iDocumentTypes: IDictionary[];
  found: boolean;
  foundOther: boolean;
  fileSize: string;
  fileSizeOthers: string;

  @ViewChild('fileUploader', { static: false }) fileUploader: ElementRef;
  @ViewChild('fileUploaderOthers', { static: false })
  fileUploaderOthers: ElementRef;

  editForm = this.fb.group({
    documentType: [],
    content: [],
    type: [],
    name: [],
    fileSize: [],
    provided: [],
  });

  editFormOthers = this.fb.group({
    documentType: [],
    content: [],
    type: [],
    name: [],
    fileSize: [],
    provided: [],
  });

  constructor(
    protected transactionService: TransactionService,
    private batchService: BatchService,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private dashboardService: DashboardService,
    private supportingDocumentService: SupportingDocumentService,
    private fb: FormBuilder,
    protected modalService: NgbModal,
    protected eventManager: JhiEventManager,
    protected dictionaryService: DictionaryService
  ) {
    this.message = 'SupportingDocsComponent message';
  }

  linkClick() {}

  private createFromForm(type: IDictionary): ISupportingDocument {
    if (this.typeOfDoc === 'mandatory') {
      return {
        ...new SupportingDocument(),
        documentType: type,
        // type: this.editForm.get(['type']).value,
        name: this.editForm.get(['name']).value,
        fileSize: this.editForm.get(['fileSize']).value,
        content: this.editForm.get(['content']).value,
        provided: this.editForm.get(['provided']).value,
      };
    } else {
      return {
        ...new SupportingDocument(),
        documentType: type,
        // type: this.editForm.get(['type']).value,
        name: this.editFormOthers.get(['name']).value,
        fileSize: this.editFormOthers.get(['fileSize']).value,
        content: this.editFormOthers.get(['content']).value,
        provided: this.editFormOthers.get(['provided']).value,
      };
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<HttpResponse<ISupportingDocument>>
  ) {
    result.subscribe(
      (document) => {
        const supDOc = document.body;
        this.batchService.find(this.batchId).subscribe((dBatch) => {
          const batch = dBatch.body;

          const docs = batch.transactions[0].docs;
          if (docs === null) {
            batch.transactions[0].docs = [];
          }
          batch.transactions[0].docs.push(supDOc);
          this.transactionService
            .update(batch.transactions[0])
            .subscribe(() => {
              this.eventManager.broadcast({
                name: 'supportingDocumentListModification',
                content: 'Added an supportingDocument',
              });
              this.refreshDocument(this.batch);
            });
        });

        this.onSaveSuccess();
      },
      () => this.onSaveError()
    );
  }

  resetForm() {
    if (this.typeOfDoc === 'mandatory') {
      this.editForm.patchValue({
        content: null,
        documentType: null,
      });
      this.fileUploader.nativeElement.value = null;
    } else {
      this.editFormOthers.patchValue({
        content: null,
        documentType: null,
      });
      this.fileUploaderOthers.nativeElement.value = null;
    }
  }

  protected onSaveSuccess() {
    this.resetForm();
  }

  protected onSaveError() {
    alert('document fialed to be uploaded');
  }

  save() {
    this.dictionaryService
      .find(this.editForm.get(['documentType']).value)
      .subscribe((data) => {
        const supportingDocument = this.createFromForm(data.body);
        this.subscribeToSaveResponse(
          this.supportingDocumentService.create(supportingDocument)
        );
      });
  }

  saveOthers() {
    this.dictionaryService
      .find(this.editFormOthers.get(['documentType']).value)
      .subscribe((data) => {
        const supportingDocument = this.createFromForm(data.body);
        this.subscribeToSaveResponse(
          this.supportingDocumentService.create(supportingDocument)
        );
      });
  }

  // @SuppDocList
  // code_ and batchId are passed from the calling component
  ngOnInit() {
    const params = this.route.snapshot.paramMap;
    this.batchId = Number(params.get('batchId'));

    // calls the batch service to set the batch and documenets objects
    // documents list is displayed by the component view page
    this.batchService.find(this.batchId).subscribe(
      (data) => {
        this.batch = data.body;

        this.code_ = this.batch.transactions[0].transactionCode.code;
        this.dashboardService
          .getMandatorySupportDocs(this.code_)
          .subscribe((data1) => {
            this.mandatoryDocs = data1.body;

            //({'category.equals':'document_type'}

            this.dictionaryService.query().subscribe((dataDocs) => {
              const allDicts = dataDocs.body;

              const xDicts = allDicts.filter(
                (s) => s.category === 'document_type'
              );
              this.mandatoryDocs.forEach((mandatoryDoc) => {
                xDicts.forEach((xDict) => {
                  if (mandatoryDoc.document_code === xDict.code) {
                    this.madatorySupportingDocuments.push(xDict);
                  }
                });
              });

              const subxDicts = allDicts.filter(
                (s) => s.category === 'document_subtype'
              );
              this.mandatoryDocs.forEach((mandatoryDoc) => {
                subxDicts.forEach((xDict) => {
                  if (mandatoryDoc.document_code === xDict.code) {
                    this.madatorySupportingDocuments.push(xDict);
                  }
                });
              });

              // if (this.madatorySupportingDocuments.length === 0){
              //   this.madatorySupportingDocuments =  xDicts.slice(0,5);
              // }

              this.otherSupportingDocuments = xDicts.filter(
                (x) => !this.madatorySupportingDocuments.includes(x)
              );
              this.refreshDocument(this.batch);
            });
          });
      },
      () => alert()
    );
  }

  refreshDocument(batch: Batch) {
    this.batchService.find(batch.id).subscribe(
      (data) => {
        const allDocs = data.body.transactions[0].docs;
        this.supportingDocuments = allDocs.filter((x) => x.provided === 'Y');
        this.supportingDocumentsOthers = allDocs.filter(
          (x) => x.provided !== 'Y'
        );
        this.found = false;
        this.foundOther = false;

        // this.addMoreDetailDocument();
      },
      () => {
        // alert()
      }
    );
  }

  editNewDocument(newOrEdit: string, batchId: number, documentId: number) {
    const path = '/application/document';
    this.router.navigate([path, batchId, documentId, newOrEdit]);
  }

  onFileSelectedOthers(event) {
    this.typeOfDoc = 'others';

    this.selectedFile = event.target.files[0] as File;

    const reader = new FileReader();
    if (this.selectedFile.size >= 150000) {
      this.fileSizeOthers =
        'Your upload is of size  ' +
        this.selectedFile.size +
        ' and it exceeds the limit - 150kb';
      return;
    } else {
      this.fileSizeOthers =
        'Your upload is of size  ' + this.selectedFile.size + ' and it is Ok';
    }

    if (event.target.files && event.target.files.length) {
      this.fileNameOthers = event.target.files[0].name;
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        // this.content = reader.result
        this.editFormOthers.patchValue({
          content: reader.result,
          type: this.selectedFile.type,
          name: this.fileNameOthers,
          fileSize: this.selectedFile.size,
          provided: 'N',
        });

        this.saveOthers();

        this.fileSizeOthers = null;
      };
    }
  }

  // fileSelected($event) {
  //   const file = $event.target.files[0];
  //   this.file = file;

  //   if (file) {
  //     const fileSize = 0;
  //     if (file.size > 100 * 1024) this.fileSize = 'file size exceeded 150kb';
  //     else this.fileSize = (Math.round((file.size * 100) / 1024) / 100).toString() + 'KB';
  //   }
  // }

  onFileSelected(event) {
    this.typeOfDoc = 'mandatory';
    this.selectedFile = event.target.files[0] as File;

    if (this.selectedFile.size >= 150000) {
      this.fileSize =
        'Your upload is of size  ' +
        this.selectedFile.size +
        ' and it exceeds the limit - 150kb';
      return;
    } else {
      this.fileSize =
        'Your upload is of size  ' + this.selectedFile.size + ' and it is Ok';
    }

    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.fileName = event.target.files[0].name;

      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        // this.content = reader.result
        this.editForm.patchValue({
          content: reader.result,
          type: this.selectedFile.type,
          name: this.fileName,
          fileSize: this.selectedFile.size,
          provided: 'Y',
        });

        this.save();
        this.fileSize = null;
      };
    }
  }

  // We do file upload here  - mandatory
  onChange() {
    //@Nicholas
    //check the file size here, if the size is within recomended size, proceed, else fail... Also report the failure message on the UI.

    //check if the item is already subbitted
    this.found = false;
    const id = this.editForm.get(['documentType']).value;
    if (id != null || id !== undefined) {
      this.dictionaryService.find(id).subscribe((data) => {
        const selectedCode = data.body.code;

        for (const sd of this.supportingDocuments) {
          if (selectedCode === sd.documentType.code) {
            this.found = true;
            return;
          }
        }
        this.fileUploader.nativeElement.value = null;
      });
    }
  }

  // We do file upload here  - others
  onChangeOthers() {
    //@Nicholas
    //check the file size here, if the size is within recomended size, proceed, else fail... Also report the failure message on the UI.

    // this.fileUploader.nativeElement.value = null;
    this.foundOther = false;
    const id = this.editFormOthers.get(['documentType']).value;
    if (id != null || id !== undefined) {
      this.dictionaryService.find(id).subscribe((data) => {
        const selectedCode = data.body.code;

        for (const sd of this.supportingDocumentsOthers) {
          if (selectedCode === sd.documentType.code) {
            this.foundOther = true;
            return;
          }
        }
        this.fileUploader.nativeElement.value = null;
      });
    }
  }

  allMandatoryDocumentAdded(): boolean {
    if (
      this.madatorySupportingDocuments !== undefined &&
      this.supportingDocuments !== undefined
    ) {
      if (
        this.madatorySupportingDocuments.length ===
        this.supportingDocuments.length
      ) {
        return true;
      }
    }

    return false;
  }

  deleteDoc(supportingDocument: SupportingDocument) {
    const modalRef = this.modalService.open(
      SupportingDocumentDeleteDialogComponent,
      { size: 'lg', backdrop: 'static' }
    );
    modalRef.componentInstance.supportingDocument = supportingDocument;
    this.eventManager.subscribe('supportingDocumentListModification', () => {
      this.transactionService.find(this.batch.transactions[0].id).subscribe(
        (data) => {
          this.supportingDocuments = data.body.docs;

          // this.refreshParty(this.batch.id);
          this.refreshDocument(this.batch);
        },
        () => alert()
      );
    });
  }

  // addMoreDetailDocument() {
  //   this.supportingDocuments.forEach(value => {
  //     const dict = this.map.get(value.documentType) as IEGISDIctionary;
  //     value.description = dict.label;
  //   });

  //   this.supportingDocumentsOthers.forEach(value => {
  //     const dict = this.map.get(value.documentType) as IEGISDIctionary;
  //     value.description = dict.label;
  //   });
  // }

  b64toBlob(b64Data: string, contentType: string, sliceSize: number) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  getFile(documentId: number, content: string, filename: string) {
    const index = content.indexOf('base64') + 7;

    const blob = this.b64toBlob(
      content.substring(index),
      content.substr(0, index - 8),
      512
    );
    const downloadURL = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadURL;
    link.download = filename;
    link.click();
  }

  goParcel(batchId: number) {
    this.router.navigate([
      '/application/property',
      batchId,
      this.batch.transactions[0].parcels[0].id,
      'edit',
    ]);
  }

  goToSummary(batchId: number) {
    this.router.navigate(['/application/application-summary', batchId]);
  }
}

export class TabDisplay {
  constructor() {}
}
