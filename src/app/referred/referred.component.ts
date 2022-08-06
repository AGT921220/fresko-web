import { GlobalService } from '../global.service';
import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Globals } from "src/app/globals";
import { ApiService } from "src/app/services/api.service";
import { ReferredService } from "../services/referred.service";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-referred",
  templateUrl: "./referred.component.html",
})
export class ReferredComponent implements OnInit {
  loading = false;
  error = false;
  orders: any = [];
  mensaje = "";
  fechaActual = "";
  fechaInicio = "";
  products = [];
  modificando = false;
  new_price = 0;
  price_confirm = 0;
  pedido_seleccionado = null;
  constructor(
    private apiService: ApiService,
    public g: Globals,
    private router: Router,
    private ReferredService: ReferredService,
    private modalService: NgbModal,
    private global:GlobalService
  ) {
    const dateToday = new Date();
    this.fechaInicio = formatDate(dateToday, "yyyy-MM-dd", "en");
    dateToday.setDate(dateToday.getDate() + 1);
    this.fechaActual = formatDate(dateToday, "yyyy-MM-dd", "en");
    this.getOrdersReferreds(this.fechaInicio, this.fechaActual);
  }

  open(content, item) {
    this.modificando = false;
    this.price_confirm = 0;
    this.new_price = item.price;
    this.pedido_seleccionado = item;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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

  ngOnInit() {
    // if (!this.g.loggedIn) {
    //   this.router.navigate(["home"]);
    // }
    this.apiService.getProducts().subscribe((response: any) => {
      this.products = response.products;
    });
  }

  openReferreds() {
    this.router.navigate(["referidos"]);
  }

  openUsers() {
    this.router.navigate(["usuarios"]);
  }
  openPromos() {
    this.router.navigate(["promos"]);
  }

  openAnuncios() {
    this.router.navigate(["anuncios"]);
  }

  openSubmenus(){
    this.router.navigate(['submenus']);
  }

  openCoberturas(){
    this.router.navigate(['cobertura']);
  }

  getOrdersReferreds(fechaInicio, fechaFin) {
    this.error = false;
    this.loading = true;
    this.orders = [];
    let pre_orders = [];
    this.apiService
      .getOrdersReferreds(fechaInicio, fechaFin)
      .subscribe((response: any) => {
        if (response.success == "1") {
          pre_orders = response.orders;
          for(var i = 0; i < pre_orders.length; i++){
            if(parseInt(pre_orders[i].free_delivery) == 1 || parseInt(pre_orders[i].discount) != 0){
              pre_orders[i].es_promo = true;
              if(pre_orders[i].discount != 0){
                let descuento = pre_orders[i].price * parseFloat("0." + pre_orders[i].discount);
                pre_orders[i].descuento_otorgado = descuento;
                pre_orders[i].nombre_promocion = "DESCUENTO";
              } else{
                pre_orders[i].descuento_otorgado = 0;
                pre_orders[i].nombre_promocion = "ENVIO GRATIS";
              }
            } else{
              pre_orders[i].es_promo = false;
              pre_orders[i].descuento_otorgado = 0;
              pre_orders[i].nombre_promocion = "";
            }
          }
          this.orders = pre_orders;
          console.log('Ordenes', this.orders);
        } else {
          this.error = true;
          this.mensaje = response.mensaje;
        }
        this.loading = false;
      });
  }

  downloadExcel(fechaInicio, fechaFin) {
    this.ReferredService.createExcelFile(
      this.orders,
      this.products,
      "Pedidos_Referidos" + fechaInicio + "_" + fechaFin
    );
  }

  modificandoValor(){
    if(this.modificando){
      //RESTAURAR
      this.new_price = this.pedido_seleccionado.price;
    }
    this.modificando = !this.modificando;
  }

  onChangePrice(){
    console.log('New Price', this.new_price);
    console.log('Pedido', this.pedido_seleccionado);
    if(this.pedido_seleccionado.free_delivery == 1){
      this.pedido_seleccionado.price_real = this.new_price - 15;
    } else if(this.pedido_seleccionado.discount != null && this.pedido_seleccionado.discount != 0){
      let descuento = this.new_price *  (this.pedido_seleccionado.discount / 100);
      this.pedido_seleccionado.descuento_otorgado = descuento;
      this.pedido_seleccionado.price_real = (this.new_price - descuento) + 15;
    }
  }

  async actualizarPrecio(){
    if(this.new_price >= 1){
      if(this.new_price != this.price_confirm && this.modificando){
        return this.global.showErrorToast("Los precios deben coincidir.");
      }
      let result = null;
      //Actualizarlo.
      await this.apiService.updatePrice(this.new_price, this.pedido_seleccionado.tipo_pago, this.pedido_seleccionado.idorder, this.pedido_seleccionado.iduser).toPromise().then((response:any)=>{
        result = response;
        if(response.success){
          this.global.showSuccessToast(response.message, "Actualizacion de Precio");
        } else{
          this.global.showErrorToast(response.message, "Actualizacion de Precio");
        }
      }).catch(error =>{
        this.global.showErrorToast(JSON.stringify(error));
      });

      if(result != null){
        if(result.success){
          console.log('Aqui esta');
          this.modalService.dismissAll();
          await this.getOrdersReferreds(this.fechaInicio, this.fechaActual);
        }
      }

    } else{
      return this.global.showErrorToast("Ingresa el subtotal nuevo..");
    }
  }
}
