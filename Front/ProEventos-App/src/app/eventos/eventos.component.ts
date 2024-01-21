import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  public eventos : any = [];
  public eventosFiltrados: any = [];
  public showImages = false;
  private _filtroLista: string = "";


  public get filtroLista() : string {
    return this._filtroLista
  }
  
  public set filtroLista(v : string) {
    this._filtroLista = v;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos
  }
  
  filtrarEventos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase()
    return this.eventos.filter(
      (evento: any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }
  

  constructor(private http: HttpClient) { }

  public getEventos(): void{
      this.http.get("https://localhost:5001/api/eventos").subscribe(
      res => {
        this.eventos = res
        this.eventosFiltrados = res
      },
      error => console.log(error)
    )
  }
  
  ngOnInit(): void {
    this.getEventos()
  }

}
