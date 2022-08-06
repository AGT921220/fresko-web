import { CoberturaComponent } from './cobertura/cobertura.component';
import { SubmenusComponent } from './submenus/submenus.component';
import { CrearAnunciosComponent } from './crear-anuncios/crear-anuncios.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ExcelComponent } from "./excel/excel.component";
import { ReferredComponent } from "./referred/referred.component";

import { UsuariosComponent } from "./usuarios/usuarios.component";
import { UsuarioComponent } from "./usuario/usuario.component";
import { CrearPromocionesComponent } from "./crear-promociones/crear-promociones.component";

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "excel", component: ExcelComponent },
  { path: "usuarios", component: UsuariosComponent },
  { path: "usuario/:id", component: UsuarioComponent },
  { path: "usuario", component: UsuarioComponent },
  { path: "promos", component: CrearPromocionesComponent },
  { path: "anuncios", component: CrearAnunciosComponent },
  { path: "submenus", component: SubmenusComponent },
  { path: "cobertura", component: CoberturaComponent },
  { path: "referidos", component: ReferredComponent },

  { path: "**", pathMatch: "full", redirectTo: "home" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
