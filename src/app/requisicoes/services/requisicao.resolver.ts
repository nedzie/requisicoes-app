import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Requisicao } from '../models/requisicao.model';
import { RequisicaoService } from './requisicao.service';

@Injectable({
  providedIn: 'root'
})
export class RequisicaoResolver implements Resolve<Requisicao> { // Era boolean

  constructor(
    private requisicaoService: RequisicaoService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Requisicao> { // Era boolean
    return this.requisicaoService.selecionarPorId(route.params['id']); // E é assim que pega a informação enviada por parâmetro na rota, do [routerLink]
  }
}
