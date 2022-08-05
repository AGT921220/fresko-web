import { Injectable } from "@angular/core";

@Injectable()
export class Globals {
  loggedIn = false;
  readonly URL_LOGO = "Excel/assets/icon.png";
  users: any = [];
}
