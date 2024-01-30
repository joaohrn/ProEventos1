using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id;
        public string Local;
        public string DataEvento;
        public string Tema;
        public int QtdPessoas;
        public string ImagemURL;
        public string Telefone;
        public string Email;
    }
}