import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

/* Firebase */
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './auth/services/authentication.service';
import { LoginComponent } from './auth/login/login.component';

/* CRUD */
import { PainelComponent } from './painel/painel.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DepartamentoModule } from './departamentos/departamento.module';
import { EquipamentoModule } from './equipamentos/equipamento.module';

/* Toastr */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PainelComponent,
    NavbarComponent,
  ],
  imports: [ /* Definem o que as 'declarations' terão acesso */
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    DepartamentoModule,
    EquipamentoModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
