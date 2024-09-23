using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ProEventos.API.helpers
{
    public interface IUtil
    {
        public Task<string> SaveImage(IFormFile imageFile, string destino);
        public void DeleteImage(string imageName, string destino);
    }
}