import { Component, OnInit } from "@angular/core";
import { Globals } from "../globals";
import { Router } from "@angular/router";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
})
export class UsuariosComponent implements OnInit {
  mensaje: string;
  loading: boolean;
  name = "";
  error: boolean;
  users: any = [];
  constructor(
    public g: Globals,
    public router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // if (this.g.loggedIn) {
    // } else {
    //   this.router.navigate([""]);
    // }
  }

  edit(id: number) {
    this.router.navigate([`usuario/${id}`]);
  }
  openAdd() {
    this.router.navigate([`usuario`]);
  }
  search() {
    this.loading = true;
    this.error = false;
    this.apiService.getUsuarios(this.name).subscribe({
      next: (response: any) => {
        this.users = response.users;
        this.g.users = this.users;
        if (this.users.length === 0) {
          this.error = true;
          this.mensaje = "No se han encontrado resultado";
        }
        this.loading = false;
      },
    });
  }
}
