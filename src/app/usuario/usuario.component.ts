import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Globals } from "../globals";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-usuario",
  templateUrl: "./usuario.component.html",
})
export class UsuarioComponent implements OnInit {
  editar: boolean;
  isLoading: boolean;
  mensaje: string;
  user: any;

  name: string;
  telephone: string;
  password: string;
  street: string;
  streetNumber: string;
  interior: string;
  colony: string;
  activado: boolean;

  constructor(
    private router: Router,
    public g: Globals,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    if (this.g.loggedIn) {
      this.activatedRoute.params.subscribe((params) => {
        if (params.id != null) {
          this.editar = true;
          const users = this.g.users;
          this.user = users.find((x) => Number(x.iduser) === Number(params.id));
          if (!this.user) {
            this.router.navigate(["usuarios"]);
          } else {
            this.name = this.user.name;
            this.telephone = this.user.telephone;
            this.password = "";
            this.street = this.user.street;
            this.streetNumber = this.user.streetnumber;
            this.interior = this.user.interior;
            this.colony = this.user.colony;
            if (Number(this.user.activated) === 0) {
              this.activado = false;
            } else {
              this.activado = true;
            }
          }
        } else {
          this.editar = false;
          this.name = "";
          this.telephone = "";
          this.password = "";
          this.street = "";
          this.streetNumber = "";
          this.interior = "";
          this.colony = "";
          this.activado = true;
        }
      });
    } else {
      this.router.navigate([""]);
    }
  }

  checkInformation() {
    if (this.name.length > 0) {
      if (this.telephone.length > 0) {
        if (!this.editar && this.password.length === 0) {
          this.mensaje = "Por favor, rellena la contraseña";
        } else {
          this.mensaje = "";
          this.callApi();
        }
      } else {
        this.mensaje = "Por favor, rellena el nombre";
      }
    } else {
      this.mensaje = "Por favor, rellena el nombre";
    }
  }

  callApi() {
    if (this.editar) {
      let indice = 0;
      if (this.activado) {
        indice = 1;
      }
      this.apiService
        .editUser(
          this.user.iduser,
          this.name,
          this.telephone,
          this.password,
          this.street,
          this.streetNumber,
          this.interior,
          this.colony,
          String(indice)
        )
        .subscribe({
          next: (response: any) => {
            this.router.navigate(["usuarios"]);
          },
          error: () => {
            this.mensaje = "No se ha podido guardar el usuario";
          },
        });
    } else {
      let indice = 0;
      if (this.activado) {
        indice = 1;
      }
      this.apiService
        .addUser(
          this.name,
          this.telephone,
          this.password,
          this.street,
          this.streetNumber,
          this.interior,
          this.colony,
          String(indice)
        )
        .subscribe({
          next: (response: any) => {
            this.router.navigate(["usuarios"]);
          },
          error: () => {
            this.mensaje = "No se ha podido guardar el usuario";
          },
        });
    }
  }
}
