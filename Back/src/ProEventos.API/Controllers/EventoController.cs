using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProEventos.API.models;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventoController : ControllerBase
    {
        public EventoController()
        {
        }

        public IEnumerable<Evento> _evento = new Evento[]{
            new Evento(){
                EventoId = 1,
                Tema = "Angular e .Net",
                Local = "Belo Horizonte",
                Lote = "1º Lote",
                QtdPessoas = 69,
                DataEvento = DateTime.Now.AddDays(2).ToString(),
                ImagemURL = "Foto.png"
            },
            new Evento(){
                EventoId = 2,
                Tema = "Angular e Novidades",
                Local = "São Paulo",
                Lote = "2º Lote",
                QtdPessoas = 46,
                DataEvento = DateTime.Now.AddDays(2).ToString(),
                ImagemURL = "Foto.png"
            }
        };

        [HttpGet]
        public IEnumerable<Evento> Get()
        {
            return _evento;
        }
        [HttpGet("{id}")]
        public IEnumerable<Evento> Get(int id)
        {
            return _evento.Where(evento => evento.EventoId == id);
        }

        [HttpPost]
        public string Post()
        {
            return "Exemplo de post";
        }
        [HttpPut("{id}")]
        public string Put(int id)
        {
            return $"Exemplo de put id:{id}";
        }
        [HttpDelete("{id}")]
        public string Delete(int id)
        {
            return $"Exemplo de delete id:{id}";
        }
    }
}
