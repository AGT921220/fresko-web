import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../global.service';
import { ApiService } from '../services/api.service';
import { AngularGridInstance, GridOption, FieldType } from 'angular-slickgrid';
import { CustomFormatters } from 'src/interfaces/formatters';


@Component({
  selector: 'app-crear-anuncios',
  templateUrl: './crear-anuncios.component.html',
  styleUrls: ['./crear-anuncios.component.scss']
})
export class CrearAnunciosComponent implements OnInit {

  anuncios = [];
  anuncios_users = [];
  isLoading = false;
  anuncio_seleccionado = null;
  nuevo_anuncio = {
    id: 0,
    editando: false,
    titulo: "",
    imagen: null
  };
  angularGrid: AngularGridInstance;
  gridOptions: GridOption;
  dataset: any[];
  cformat = new CustomFormatters();
  columnDefinitions = [
    { id: 'name', name: 'Nombre', field: 'name', sortable: true, type: FieldType.text, filterable: true, width: 3 },
    { id: 'address', name: 'Direccion', field: 'address', sortable: true, type: FieldType.text, filterable: true, width: 4 },    {
      id: 'has_anuncio', name: 'Agregar', field: 'has_anuncio', width: 1,
      formatter: this.cformat.plusFormatter,
      onCellClick: (e, args) => {
        let item = args.dataContext;
        let obj ={
          id_anuncio: this.anuncio_seleccionado.id,
          id_user: item.iduser,
          has_anuncio: item.has_anuncio == 1 ? 0 : 1
        }
        item.has_anuncio = obj.has_anuncio;
        this.addAnuncioUser(item, obj).then(res =>{
          console.log('res', res);
        });
        console.log('Anuncio', obj);
      }
    },
  ];
  constructor(
    private global: GlobalService,
    private api: ApiService,
    private modalService: NgbModal,
    private domSanitizer: DomSanitizer,
    private router:Router
  ) { }

  async addAnuncioUser(item, obj){
    await this.api.addAnuncioUser(obj).toPromise().then( (response:any) =>{
      if(!response.success){
        this.global.showErrorToast(response.message, "Anuncios");
      }else{
        this.global.showSuccessToast(response.message, "Anuncios");
        this.angularGrid.gridService.updateItem(item, {highlightRow: true});
      }
    }).catch(error =>{

    });
  }

  back(){
    this.router.navigate(['excel']);
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
  }

  async ngOnInit() {
    this.gridOptions = {
      autoResize: {
        containerId: 'contentUsuarios',
        sidePadding: 10
      },
      enableFiltering: true,
      enableAutoResize: true,
      enableCellNavigation: false,
      enableExcelCopyBuffer: false
    };
    await this.getAnuncios();
  }

  async getAnuncios() {
    this.isLoading = true;
    await this.api.getAnuncios().toPromise().then((response: any) => {
      console.log('REsponse', response);
      let pre_anuncios = response.anuncios;
      for(var i = 0; i < pre_anuncios.length; i++){
        pre_anuncios[i].imagen =  "data:image/png;base64," + pre_anuncios[i].imagen;
      }
      this.anuncios = pre_anuncios;
      console.log('Anuncios', this.anuncios);
    }).catch(error => {
      this.isLoading = false;
    });
    this.isLoading = false;
  }

  open(content, item) {
    if (item != null) {
      this.nuevo_anuncio.editando = true;
      this.nuevo_anuncio.id = item.id;
      this.nuevo_anuncio.titulo = item.titulo;
      this.nuevo_anuncio.imagen = item.imagen;
    } else {
      this.nuevo_anuncio.editando = false;
      this.nuevo_anuncio.id = 0;
      this.nuevo_anuncio.titulo = "";
      this.nuevo_anuncio.imagen = null;
    }
    console.log('Nuevo Anuncio', this.nuevo_anuncio);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  handleUpload(event) {
    this.nuevo_anuncio.imagen = event[0];
  }

  async guardarAnuncio() {
    //data->promotion_name, $data->description, $data->free_delivery, $data->is_discount, $data->minimum_amount, $data->discount_price, $data->imagen
    let obj = {
      titulo: this.nuevo_anuncio.titulo,
      imagen: this.nuevo_anuncio.imagen,
      id: this.nuevo_anuncio.id,
    };
    if (this.nuevo_anuncio.editando == true) {
      let result = null;
      await this.api.updateAnuncio(obj.id, obj.imagen, obj.titulo).toPromise().then((response: any) => {
        result = response;
        if (response.success) {
          this.global.showSuccessToast(response.message, "Actualizacion de Anuncio");
        } else {
          this.global.showErrorToast(response.message, "Actualizacion de Anuncio");
        }
      }).catch(error => {

      });
      if (result != null) {
        if (result.success) {
          this.modalService.dismissAll();
          await this.getAnuncios();
        }
      }
    } else {
      let result = null;
      await this.api.nuevoAnuncio(obj.imagen, obj.titulo).toPromise().then((response: any) => {
        result = response;
        if (response.success) {
          this.global.showSuccessToast(response.message, "Registro de Anuncio");
        } else {
          this.global.showErrorToast(response.message, "Registro de Anuncio");
        }
      }).catch(error => {

      });
      if (result != null) {
        if (result.success) {
          this.modalService.dismissAll();
          await this.getAnuncios();
        }
      }
    }
  }

  modalUsuarios(content, item) {
    this.anuncio_seleccionado = item;
    if (item != null) {
      let anuncios_users = item.anuncios_users;
      for(var i = 0; i < anuncios_users.length; i++){
        anuncios_users[i].id = i;
      }
      this.anuncios_users = anuncios_users;
      this.dataset = this.anuncios_users;

      console.log('Usuarios', this.anuncios_users);
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        console.log(`Closed with: ${result}`);
      }, (reason) => {
        console.log(`Dismissed ${this.getDismissReason(reason)}`);
      });
      setTimeout(() => {
        this.angularGrid.resizerService.resizeGrid();
      }, 300);
    }
  }

}
