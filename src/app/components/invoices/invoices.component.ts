import { Component, OnInit} from '@angular/core';

import {ComponentsService} from '../components.service';
import { Fattura } from 'src/app/models/fattura';

import { InvoiceData } from '../components.service';
import { PageEvent } from '@angular/material/paginator';
import { tap,map } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';

import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {

  dataSource: InvoiceData | any = null;
  pageEvent!: PageEvent;

  displayedColumns: string[] = ['id', 'fatturaNumero', 'data', 'importo', 'ragioneSociale', 'telefonoContatto', 'stato', 'gestioneFattura' ];

  idCliente!: number;

  labelRagioneSociale!: string;

  min!:number;
  max!:number;

  filtrato:boolean = false;

  constructor(private componentsSrv: ComponentsService, private router: Router, private route: ActivatedRoute ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
			this.idCliente = +params['id'];
			console.log(this.idCliente);
    });

    this.initdataSource();
  }

  initdataSource(){

    this.componentsSrv.getInvoices(0, 5).pipe(
      tap((invoiceData: InvoiceData) => console.log(invoiceData)),
      map((invoiceData: InvoiceData) => {this.dataSource = invoiceData}))
    .subscribe();
  }

  onPaginateChange(event: PageEvent){
    let page = event.pageIndex;
    let size = event.pageSize;

    page = page + 1;

    if(this.filtrato){
    this.componentsSrv.getCustomersFiltFatturato(this.min, this.max,page,size).pipe(
      map((invoiceData: InvoiceData) => {this.dataSource = invoiceData}))
    .subscribe();}

    else{
    this.componentsSrv.getInvoices(page, size).pipe(
      map((invoiceData: InvoiceData) => {this.dataSource = invoiceData})).subscribe();
    }

  }

  cancellaFattura(idFattura:number){
    this.componentsSrv.cancellaFattura(idFattura).subscribe(canc =>{
      location.reload();
      console.log("Hai cancellato la fattura con id", idFattura)
    })
  }


  filtra(form: NgForm){ //per importo
    this.min = form.value.importoMinimo;
    this.max = form.value.importoMassimo;

    this.filtrato = true;

    this.componentsSrv.getCustomersFiltFatturato(this.min, this.max,0,20).pipe(
      map((invoiceData: InvoiceData) => {this.dataSource = invoiceData}))
    .subscribe();
  }


}
