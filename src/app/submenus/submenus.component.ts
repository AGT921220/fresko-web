import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from './../global.service';
import { ApiService } from './../services/api.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AngularGridInstance, GridOption, FieldType } from 'angular-slickgrid';
import { CustomFormatters } from 'src/interfaces/formatters';
@Component({
  selector: 'app-submenus',
  templateUrl: './submenus.component.html',
  styleUrls: ['./submenus.component.scss']
})
export class SubmenusComponent implements OnInit {
  categoria = null;
  categories = [];
  isLoading = false;
  editando = false;
  submenu = {
    nombre: null,
    id_category: null,
    id_submenu: null,
    operation: "INSERT"
  };
  angularGrid: AngularGridInstance;
  gridOptions: GridOption;
  dataset: any[];
  cformat = new CustomFormatters();
  columnDefinitions = [
    { id: 'nombre', name: 'Producto', field: 'nombre', sortable: true, type: FieldType.text, filterable: true, width: 3 },
    { id: 'is_added', name: 'Agregar', field: 'is_added', width: 1,
      formatter: this.cformat.plusFormatter,
      onCellClick: (e, args) => {
        let item = args.dataContext;
        let obj ={
          id_submenu: this.submenu.id_submenu,
          idproduct: item.id,
          tipo: item.is_added == false ? "INSERT" : "DELETE" 
        }
        this.addOpSubmenu(item, obj).then(res =>{
          console.log('res', res);
        });
        console.log('Promotion', obj);
      }
    },
  ];
  constructor(
    private router:Router,
    private api:ApiService,
    private global:GlobalService,
    private modalService: NgbModal,
  ) { }

  async ngOnInit() {
    this.gridOptions = {
      autoResize: {
        containerId: 'contentProductos',
        sidePadding: 10
      },
      enableFiltering: true,
      enableAutoResize: true,
      enableCellNavigation: false,
      enableExcelCopyBuffer: false
    };
    await this.getCategories();
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
  }

  async getCategories(){
    await this.api.getCategories().toPromise().then( (response:any) => {
      this.categories = response.categories;
    }).catch(error =>{
    });
  }

  async addOpSubmenu(item, obj){
    let result = null;
    await this.api.opSubmenuProduct(obj.id_submenu, obj.idproduct, obj.tipo).toPromise().then( (response:any) => {
      result = response;
      if(!response.success){
        this.global.showErrorToast(response.message, "Submenu Productos");
      }else{
        item.is_added = !item.is_added
        this.global.showSuccessToast(response.message, "Submenu Productos");
        this.angularGrid.gridService.updateItem(item, {highlightRow: true});
      }
    }).catch(error =>{

    });
    if(result != null){
      if(result.success){
        this.modalService.dismissAll();
        await this.getCategories();
        this.cancelar();
        this.categoria = null;
      }
    }
  }

  back(){
    this.router.navigate(['excel']);
  }

  selectCategory(){
    this.submenu.id_category = this.categoria.id;
    console.log('Categoria', this.categoria);
  }

  cancelar(){
    this.submenu.nombre = "";
    this.submenu.id_submenu = null;
    this.editando = false;
  }

  editarCategoria(item){
    this.editando = true;
    this.submenu.nombre = item.nombre;
    this.submenu.id_submenu = item.id;
  }

  modalProductos(content, item){
    this.categoria.products.map( x => {
      let exist = item.products.filter(y =>{
        if(y.idproduct == x.idproduct){
          return y;
        }
      });
      x.id = x.idproduct;
      if(exist.length >= 1){
        x.is_added = 1;
      } else{
        x.is_added = 0;
      }
    });
    this.dataset = this.categoria.products;
    console.log('Products', this.dataset);
    this.submenu.id_submenu = item.id;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
    setTimeout(() => {
      this.angularGrid.resizerService.resizeGrid();
    }, 300);
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

  async operationSubmenu(){
    if(this.submenu.nombre == ""){
      return this.global.showErrorToast("Ingresa el nombre del submenu.");
    }
    this.submenu.operation = this.editando == true ? "UPDATE" : "INSERT";
    let result = null;
    await this.api.opSubmenu(this.submenu.operation, this.submenu.nombre, this.submenu.id_category, this.submenu.id_submenu).toPromise().then((response:any) =>{
      result = response;
      if(response.success){
        this.global.showSuccessToast(response.message, "Submenus");
      } else{
        this.global.showErrorToast(response.message, "Submenus");
      }
    });
    if(result){
      if(result.success){
        await this.getCategories();
        this.cancelar();
        this.categoria = null;
      }
    }
  }

  async eliminar(){
    this.submenu.operation = "DELETE";
    let result = null;
    await this.api.opSubmenu(this.submenu.operation, this.submenu.nombre, this.submenu.id_category, this.submenu.id_submenu).toPromise().then((response:any) =>{
      result = response;
      if(response.success){
        this.global.showSuccessToast(response.message, "Submenus");
      } else{
        this.global.showErrorToast(response.message, "Submenus");
      }
    });
    if(result){
      if(result.success){
        await this.getCategories();
        this.cancelar();
        this.categoria = null;
      }
    }
  }

}
