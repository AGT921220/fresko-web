import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  readonly HOST = "https://www.mercasa.mx/API/";
  constructor(private http: HttpClient) { }

  getCategories() {
    const httpParams = new HttpParams();
    return this.http.post(this.HOST + "getCategories.php", httpParams);
  }

  getCoberturas() {
    const httpParams = new HttpParams();
    return this.http.post(this.HOST + "getCoberturas.php", httpParams);
  }

  opCoberturas(codigo_postal, operation, id) {
    const httpParams = new HttpParams()
      .set("codigo_postal", codigo_postal)
      .set("operation", operation)
      .set("id", id)
    return this.http.post(this.HOST + "opCobertura.php", httpParams);
  }


  opSubmenu(operation, nombre, id_category, id_submenu) {
    const httpParams = new HttpParams()
      .set("operation", operation)
      .set("nombre", nombre)
      .set("id_category", id_category)
      .set("id_submenu", id_submenu);
    return this.http.post(this.HOST + "opSubmenu.php", httpParams);
  }

  opSubmenuProduct(id_submenu, id_product, operation) {
    const httpParams = new HttpParams()
      .set("id_submenu", id_submenu)
      .set("idproduct", id_product)
      .set("operation", operation)
    return this.http.post(this.HOST + "opSubmenuProduct.php", httpParams);
  }


  getPromos() {
    const httpParams = new HttpParams();
    return this.http.post(this.HOST + "getPromos.php", httpParams);
  }

  getAnuncios() {
    const httpParams = new HttpParams();
    return this.http.post(this.HOST + "getAnuncios.php", httpParams);
  }
  
  updatePrice(
    precio_final, tipo_pago, idorder, iduser
  ) {
    const httpParams = new HttpParams()
      .set("precio_final", precio_final)
      .set("tipo_pago", tipo_pago)
      .set("idorder", idorder)
      .set("iduser", iduser);
    return this.http.post(this.HOST + "updatePrice.php", httpParams);
  }

  addPromo(obj) {
    const httpParams = new HttpParams()
      .set("data", JSON.stringify(obj));
    return this.http.post(this.HOST + "addPromoUser.php", httpParams);
  }

  
  addAnuncioUser(obj) {
    const httpParams = new HttpParams()
      .set("data", JSON.stringify(obj));
    return this.http.post(this.HOST + "addAnuncioUser.php", httpParams);
  }

  updateAnuncio(id, imagen, titulo) {
    const formData:FormData = new FormData();
    formData.append("id", id);
    formData.append("imagen", imagen);
    formData.append("titulo", titulo);
    return this.http.post(this.HOST + "updateAnuncio.php", formData);
  }


  updatePromo(promotion_name, description, free_delivery, is_discount, minimum_amount, discount_price, imagen, id) {
    const formData:FormData = new FormData();
    formData.append("promotion_name", promotion_name);
    formData.append("description", description);
    formData.append("free_delivery", free_delivery);
    formData.append("is_discount", is_discount);
    formData.append("minimum_amount", minimum_amount);
    formData.append("discount_price", discount_price);
    formData.append("imagen", imagen);
    formData.append("id", id);
    return this.http.post(this.HOST + "updatePromo.php", formData);
  }

  nuevaPromo(promotion_name, description, free_delivery, is_discount, minimum_amount, discount_price, imagen, tipo) {
    const formData:FormData = new FormData();
    formData.append("promotion_name", promotion_name);
    formData.append("description", description);
    formData.append("free_delivery", free_delivery);
    formData.append("is_discount", is_discount);
    formData.append("minimum_amount", minimum_amount);
    formData.append("discount_price", discount_price);
    formData.append("imagen", imagen);
    formData.append("tipo", tipo);
    return this.http.post(this.HOST + "nuevaPromo.php", formData);
  }

  nuevoAnuncio(imagen, titulo) {
    const formData:FormData = new FormData();
    formData.append("imagen", imagen);
    formData.append("titulo", titulo);
    return this.http.post(this.HOST + "nuevoAnuncio.php", formData);
  }



  getOrders(fechaInicio, fechaFin) {
    const httpParams = new HttpParams()
      .set("date_start", fechaInicio)
      .set("token", "RBE_DEV_@_#_|__*")
      .set("date_end", fechaFin);
      return this.http.post(this.HOST + "getOrdersByDateV2.php", httpParams);
  }
  getProducts() {
    const httpParams = new HttpParams().set("token", "RBE_DEV_@_#_|__*");
    return this.http.post(this.HOST + "getAllProducts.php", httpParams);
  }
  getUsuarios(name: string) {
    const httpParams = new HttpParams()
      .set("token", "RBE_DEV_@_#_|__*")
      .set("name", name);
    return this.http.post(this.HOST + "getUsers.php", httpParams);
  }

  editUser(
    idUser: string,
    name: string,
    telephone: string,
    password: string,
    street: string,
    streetnumber: string,
    interior: string,
    colony: string,
    activated: string
  ) {
    const httpParams = new HttpParams()
      .set("token", "RBE_DEV_@_#_|__*")
      .set("iduser", idUser)
      .set("name", name)
      .set("email", "")
      .set("telephone", telephone)
      .set("password", password)
      .set("street", street)
      .set("streetnumber", streetnumber)
      .set("interior", interior)
      .set("colony", colony)
      .set("activated", activated)
      .set("reference", "");
    return this.http.post(this.HOST + "editUser.php", httpParams);
  }
  addUser(
    name: string,
    telephone: string,
    password: string,
    street: string,
    streetnumber: string,
    interior: string,
    colony: string,
    activated: string
  ) {
    const httpParams = new HttpParams()
      .set("token", "RBE_DEV_@_#_|__*")
      .set("name", name)
      .set("email", "")
      .set("telephone", telephone)
      .set("password", password)
      .set("street", street)
      .set("streetnumber", streetnumber)
      .set("interior", interior)
      .set("colony", colony)
      .set("activated", activated)
      .set("reference", "");

    return this.http.post(this.HOST + "insertUser.php", httpParams);
  }
}
