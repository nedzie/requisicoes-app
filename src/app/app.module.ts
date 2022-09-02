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

/* Toastr */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

/* Mask e PhonePipe */
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from './shared/shared.module';

/* Localização */
import ptBr from "@angular/common/locales/pt";
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';

registerLocaleData(ptBr);

/* Casca vazia */

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
    SharedModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxMaskModule.forRoot({
      dropSpecialCharacters: true
    })
  ],
  providers: [
    AuthenticationService,
    { provide: LOCALE_ID, useValue: "pt" },
    { provide: DEFAULT_CURRENCY_CODE, useValue: "BRL" }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
