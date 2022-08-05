import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Globals } from "../globals";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
  loading = true;
  error = false;
  message = "";

  constructor(public globals: Globals, private router: Router) {}

  ngOnInit() {}

  logIn(user: string, password: string) {
    this.error = false;
    this.message = "";
    if (user === "hv6n99ojj3sx") {
      if (password === "Contra123@") {
        this.globals.loggedIn = true;
        this.router.navigate(["excel"]);
      } else {
        this.error = true;
        this.message = "La contraseña es incorrecta";
      }
    } else {
      this.error = true;
      this.message = "El nombre de usuario es incorrecto";
    }
  }
}
