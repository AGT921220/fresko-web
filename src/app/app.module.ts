import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ExcelComponent } from './excel/excel.component';
import { ApiService } from './services/api.service';
import { Globals } from './globals';
import { HttpClientModule } from '@angular/common/http';
import { ExcelService } from './services/excel.service';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrearPromocionesComponent } from './crear-promociones/crear-promociones.component';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { CrearAnunciosComponent } from './crear-anuncios/crear-anuncios.component';
import { SubmenusComponent } from './submenus/submenus.component';
import { CoberturaComponent } from './cobertura/cobertura.component';
import { ReferredComponent } from './referred/referred.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ExcelComponent,
    UsuariosComponent,
    UsuarioComponent,
    CrearPromocionesComponent,
    CrearAnunciosComponent,
    SubmenusComponent,
    CoberturaComponent,
    ReferredComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AngularSlickgridModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-top-center'
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ApiService, Globals, ExcelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
