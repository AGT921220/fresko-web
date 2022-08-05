import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../global.service';
import { ApiService } from '../services/api.service';
import { AngularGridInstance, GridOption, FieldType } from 'angular-slickgrid';
import { CustomFormatters } from 'src/interfaces/formatters';

@Component({
  selector: 'app-crear-promociones',
  templateUrl: './crear-promociones.component.html',
  styleUrls: ['./crear-promociones.component.scss']
})
export class CrearPromocionesComponent implements OnInit {
  promos = [];
  promo_users = [];
  isLoading = false;
  promo_seleccionada = null;
  tipo = "PROMOCION";
  nueva_promo = {
    editando: false,
    id: 0,
    promotion_name: "",
    tipo_promo: "",
    description: "",
    discount_price: 0,
    minimum_amount: 0,
    imagen: null
  };
  angularGrid: AngularGridInstance;
  gridOptions: GridOption;
  dataset: any[];
  cformat = new CustomFormatters();
  columnDefinitions = [
    { id: 'name', name: 'Nombre', field: 'name', sortable: true, type: FieldType.text, filterable: true, width: 3 },
    { id: 'address', name: 'Direccion', field: 'address', sortable: true, type: FieldType.text, filterable: true, width: 4 },    {
      id: 'has_promotion', name: 'Agregar', field: 'has_promotion', width: 1,
      formatter: this.cformat.plusFormatter,
      onCellClick: (e, args) => {
        let item = args.dataContext;
        let obj ={
          id_promotion: this.promo_seleccionada.id,
          id_user: item.iduser,
          has_promotion: item.has_promotion == 1 ? 0 : 1,
          tipo: item.tipo
        }
        item.has_promotion = obj.has_promotion;
        this.addPromoUser(item, obj).then(res =>{
          console.log('res', res);
        });
        console.log('Promotion', obj);
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

  async addPromoUser(item, obj){
    await this.api.addPromo(obj).toPromise().then( (response:any) =>{
      if(!response.success){
        this.global.showErrorToast(response.message, "Promociones");
      }else{
        this.global.showSuccessToast(response.message, "Promociones");
        this.angularGrid.gridService.updateItem(item, {highlightRow: true});
      }
    }).catch(error =>{

    });
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
    await this.getPromos();
  }

  back(){
    this.router.navigate(['excel']);
  }


  async getPromos() {
    this.isLoading = true;
    await this.api.getPromos().toPromise().then((response: any) => {
      console.log('REsponse', response);
      let pre_promos = response.promos;
      for (var i = 0; i < pre_promos.length; i++) {
        if (pre_promos[i].imagen != null) {
          console.log('base64',);
          pre_promos[i].imagen = "data:image/png;base64," + pre_promos[i].imagen;
        }

      }
      this.promos = pre_promos;
    }).catch(error => {
      this.isLoading = false;
    });
    this.isLoading = false;
  }

  open(content, item) {
    if (item != null) {
      this.nueva_promo.editando = true;
      this.nueva_promo.id = item.id;
      this.nueva_promo.tipo_promo = item.tipo_promo;
      this.nueva_promo.promotion_name = item.promotion_name;
      this.nueva_promo.description = item.description;
      this.nueva_promo.discount_price = item.discount_price;
      this.nueva_promo.minimum_amount = item.minimum_amount;
      this.nueva_promo.imagen = item.imagen;
      if(item.es_paquete == 0){
        this.tipo = "PROMO";
      }else{
        this.tipo = "PAQUETE";
      }
    } else {
      this.nueva_promo.editando = false;
      this.nueva_promo.id = 0;
      this.nueva_promo.tipo_promo = "";
      this.nueva_promo.promotion_name = "";
      this.nueva_promo.description = "";
      this.nueva_promo.discount_price = 0;
      this.nueva_promo.minimum_amount = 0;
      this.nueva_promo.imagen = null;
    }
    console.log('Nueva Promo', this.nueva_promo);
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
    this.nueva_promo.imagen = event[0];
  }

  async guardarPromo() {
    //data->promotion_name, $data->description, $data->free_delivery, $data->is_discount, $data->minimum_amount, $data->discount_price, $data->imagen
    let obj = {
      promotion_name: this.nueva_promo.promotion_name,
      description: this.nueva_promo.description,
      free_delivery: this.nueva_promo.tipo_promo == 'ENVIO GRATIS' ? 1 : 0,
      is_discount: this.nueva_promo.tipo_promo == 'DESCUENTO' ? 1 : 0,
      minimum_amount: this.nueva_promo.minimum_amount,
      discount_price: this.nueva_promo.discount_price,
      imagen: this.nueva_promo.imagen,
      id: this.nueva_promo.id,
      tipo: this.tipo
    };
    if (this.nueva_promo.editando == true) {
      let result = null;
      await this.api.updatePromo(obj.promotion_name, obj.description, obj.free_delivery, obj.is_discount, obj.minimum_amount, obj.discount_price, obj.imagen, obj.id).toPromise().then((response: any) => {
        result = response;
        if (response.success) {
          this.global.showSuccessToast(response.message, "Actualizacion de Promocion");
        } else {
          this.global.showErrorToast(response.message, "Actualizacion de Promocion");
        }
      }).catch(error => {

      });
      if (result != null) {
        if (result.success) {
          this.modalService.dismissAll();
          await this.getPromos();
        }
      }
    } else {
      let result = null;
      await this.api.nuevaPromo(obj.promotion_name, obj.description, obj.free_delivery, obj.is_discount, obj.minimum_amount, obj.discount_price, obj.imagen, obj.tipo).toPromise().then((response: any) => {
        result = response;
        if (response.success) {
          this.global.showSuccessToast(response.message, "Registro de Promocion");
        } else {
          this.global.showErrorToast(response.message, "Registro de Promocion");
        }
      }).catch(error => {

      });
      if (result != null) {
        if (result.success) {
          this.modalService.dismissAll();
          await this.getPromos();
        }
      }
    }
  }

  modalUsuarios(content, item) {
    this.promo_seleccionada = item;
    if (item != null) {
      let promo_users = item.users_promo;
      for(var i = 0; i < promo_users.length; i++){
        promo_users[i].id = i;
      }
      this.promo_users = promo_users;
      this.dataset = this.promo_users;

      console.log('Nueva Promo', this.nueva_promo);
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
