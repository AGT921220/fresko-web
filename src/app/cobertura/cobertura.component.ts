import { Router } from '@angular/router';
import { GlobalService } from './../global.service';
import { ApiService } from './../services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cobertura',
  templateUrl: './cobertura.component.html',
  styleUrls: ['./cobertura.component.scss']
})
export class CoberturaComponent implements OnInit {
  cobertura = {
    id: 0,
    cp: "",
    editando: false,
    operation: "INSERT"
  };
  isLoading = true;
  coberturas = [];
  constructor(
    private api: ApiService,
    private global: GlobalService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.getCoberturas();
  }

  back() {
    this.router.navigate(['excel']);
  }


  async getCoberturas() {
    this.isLoading = true;
    await this.api.getCoberturas().toPromise().then((response: any) => {
      this.coberturas = response.coberturas;
    }).catch(error => {
      this.isLoading = false;
    });
    this.isLoading = false;
  }

  async operationCobertura() {
    if (this.cobertura.cp == "") {
      return this.global.showErrorToast("Ingresa el codigo postal.");
    }
    this.cobertura.operation = this.cobertura.editando == true ? "UPDATE" : "INSERT";
    let result = null;
    await this.api.opCoberturas(this.cobertura.cp, this.cobertura.operation, this.cobertura.id).toPromise().then((response: any) => {
      result = response;
      if (response.success) {
        this.global.showSuccessToast(response.message, "Coberturas");
      } else {
        this.global.showErrorToast(response.message, "Coberturas");
      }
    });
    if (result) {
      if (result.success) {
        await this.getCoberturas();
        this.cancelar();
      }
    }
  }

  editarCobertura(item) {
    this.cobertura.id = item.id;
    this.cobertura.cp = item.codigo_postal;
    this.cobertura.editando = true;
  }

  cancelar() {
    this.cobertura.id = 0;
    this.cobertura.cp = "";
    this.cobertura.operation = "INSERT";
    this.cobertura.editando = false;
  }

  async eliminar() {
    this.cobertura.operation = "DELETE";
    let result = null;
    await this.api.opCoberturas(this.cobertura.cp, this.cobertura.operation, this.cobertura.id).toPromise().then((response: any) => {
      result = response;
      if (response.success) {
        this.global.showSuccessToast(response.message, "Coberturas");
      } else {
        this.global.showErrorToast(response.message, "Coberturas");
      }
    });
    if (result) {
      if (result.success) {
        await this.getCoberturas();
        this.cancelar();
      }
    }
  }

}
