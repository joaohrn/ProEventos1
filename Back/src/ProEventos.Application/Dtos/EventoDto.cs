using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        public string Local { get; set; }
        public string DataEvento { get; set; }

        [
            Required(ErrorMessage = "O campo {0} é obrigatório."),
            StringLength(50, MinimumLength = 3, ErrorMessage = "{0} deve ter entre 3 e 50 caracteres")
        ]
        public string Tema { get; set; }
        [
            Display(Name = "quantidade de pessoas"),
            Range(1, 120000, ErrorMessage = "{0} deve ser entre 1 e 120000 pessoas.")
        ]
        public int QtdPessoas { get; set; }
        [
            RegularExpression(@".*\.(gif|jpe?g|bmp|png)$")
        ]
        public string ImagemURL { get; set; }
        [
            Required(ErrorMessage = "{0} é obrigatório."),
            Phone(ErrorMessage = "{0} invalido.")
        ]
        public string Telefone { get; set; }
        [
            Required(ErrorMessage = "O campo {0} é obrigatório."),
            Display(Name = "e-mail"),
            EmailAddress(ErrorMessage = "O campo {0} deve ser um {0} válido.")]
        public string Email { get; set; }
        public int UserId { get; set; }
        public UserDto UserDto { get; set; }
        public IEnumerable<LoteDto> Lotes { get; set; }
        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
        public IEnumerable<PalestranteDto> Palestrantes { get; set; }
    }
}