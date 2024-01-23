using System;
using System.Data.Common;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using ProEventos.Application.Contratos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class PalestranteService : IPalestranteService
    {
        private readonly IGeralPersist _geralPersist;
        private readonly IPalestrantePersist _palestrantePersist;
        public PalestranteService(IGeralPersist geralPersist, IPalestrantePersist palestrantePersist)
        {
            this._palestrantePersist = palestrantePersist;
            this._geralPersist = geralPersist;
            
        }
        public async Task<Palestrante> AddPalestrantes(Palestrante model)
        {
            try
            {
                _geralPersist.Add<Palestrante>(model);
                if(await _geralPersist.SaveChangesAsync()){
                    return await _palestrantePersist.GetPalestranteByIdAsync(model.Id, false);
                }
                return null;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<Palestrante> UpdatePalestrantes(int palestranteId, Palestrante model)
        {
            try
            {
                var palestrante = _palestrantePersist.GetPalestranteByIdAsync(palestranteId, false);
                if(palestrante == null) return null;
                model.Id = palestrante.Id;
                _geralPersist.Update<Palestrante>(model);
                if(await _geralPersist.SaveChangesAsync()){
                    return await _palestrantePersist.GetPalestranteByIdAsync(palestranteId, false);
                }
                return null;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeletePalestrantes(int palestranteId)
        {
            try
            {
                var palestrante = await _palestrantePersist.GetPalestranteByIdAsync(palestranteId, false);

                if(palestrante == null) throw new Exception("Palestrante não encontrado");
                _geralPersist.Delete<Palestrante>(palestrante);

                return await _geralPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<Palestrante[]> GetAllPalestrantesAsync(bool includeEventos = false)
        {
            try
            {
                return await _palestrantePersist.GetAllPalestrantesAsync(includeEventos);
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string nome, bool includeEventos = false)
        {
            try
            {
                return await _palestrantePersist.GetAllPalestrantesByNomeAsync(nome, includeEventos);
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<Palestrante> GetPalestranteByIdAsync(int palestranteId, bool includeEventos = false)
        {
            try
            {
                return await _palestrantePersist.GetPalestranteByIdAsync(palestranteId, includeEventos);
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }
    }
}