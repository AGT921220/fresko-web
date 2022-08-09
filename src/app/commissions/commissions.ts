import { GlobalService } from '../global.service';
import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Globals } from "src/app/globals";
import { ApiService } from "src/app/services/api.service";
import { ReferredService } from "../services/referred.service";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-commissions",
  templateUrl: "./commissions.component.html",
})
export class CommissionsComponent implements OnInit {
  loading = false;
  error = false;
  commissions: any = [];
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
    private global: GlobalService
  ) {
    this.getCommissions();
  }

  open(content, item) {
    this.modificando = false;
    this.price_confirm = 0;
    this.new_price = item.price;
    this.pedido_seleccionado = item;
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

  ngOnInit() {
    // if (!this.g.loggedIn) {
    //   this.router.navigate(["home"]);
    // }
    this.apiService.getProducts().subscribe((response: any) => {
      this.products = response.products;
    });
  }

  openExcel() {
    this.router.navigate(["excel"]);
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

  openSubmenus() {
    this.router.navigate(['submenus']);
  }

  openCoberturas() {
    this.router.navigate(['cobertura']);
  }

  getCommissions() {
    this.error = false;
    this.loading = true;
    this.apiService
      .getCommissions()
      .subscribe((response: any) => {
        this.commissions = response.commissions
        console.log(response.commissions)
        this.loading = false;

      });

  }

  downloadExcel(fechaInicio, fechaFin) {
    this.ReferredService.createExcelFile(
      this.commissions,
      this.products,
      "Pedidos_Referidos" + fechaInicio + "_" + fechaFin
    );
  }

  modificandoValor() {
    if (this.modificando) {
      this.new_price = this.pedido_seleccionado.price;
    }
    this.modificando = !this.modificando;
  }


  async applyCommission(commissionId) {
      await this.apiService.applyCommission(commissionId).toPromise().then((response: any) => {
        this.getCommissions();
      }).catch(error => {
        this.global.showErrorToast('Ha Ocurrido un Error');
      });
  }
}
