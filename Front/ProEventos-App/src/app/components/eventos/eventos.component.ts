import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../model/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  public modalRef = {} as BsModalRef;
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public showImages = false;
  private filtroListado: string = "";


  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  public get filtroLista() : string {
    return this.filtroListado
  }
  
  public set filtroLista(v : string) {
    this.filtroListado = v;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos
  }
  
  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase()
    return this.eventos.filter(
      (evento: any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }

  public getEventos(): void{
      this.eventoService.getEventos().subscribe(
        {
          next: (res: Evento[]) => {
                this.eventos = res
                this.eventosFiltrados = res
          },
          error: error => {
            this.spinner.hide()
            this.toastr.error("Erro ao buscar os eventos", "Erro!")
          },
          complete: () => this.spinner.hide()
        }
    )
  }

  public openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'})
  }
  public confirm(): void {
    this.modalRef.hide()
    this.toastr.success("Evento removido com successo", "Deletado!")
    
  }
  public decline(): void {
    this.modalRef.hide()
  }
  
  public ngOnInit(): void {
    this.getEventos()
    this.spinner.show()
  }

}
