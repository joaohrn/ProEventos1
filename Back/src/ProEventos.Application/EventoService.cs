using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Application.Contratos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class EventoService : IEventoService
    {
        private readonly IGeralPersist _geralPersist;
        private readonly IEventoPersist _eventoPersist;
        public EventoService(IGeralPersist geralPersist, IEventoPersist eventoPersist)
        {
            this._eventoPersist = eventoPersist;
            this._geralPersist = geralPersist;
            
        }
        public async Task<Evento> AddEvento(Evento model)
        {
            try
            {
                _geralPersist.Add<Evento>(model);
                if (await _geralPersist.SaveChangesAsync())
                {
                    return await _eventoPersist.GetEventoByIdAsync(model.Id, false);
                }
                return null;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<Evento> UpdateEvento(int eventoId, Evento model)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId);

                if(evento == null) return null;
                model.Id = evento.Id;
                _geralPersist.Update<Evento>(model);
                if(await _geralPersist.SaveChangesAsync()){
                    return await _eventoPersist.GetEventoByIdAsync(eventoId);
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteEvento(int eventoId)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId);

                if(evento == null) throw new Exception("Evento não foi encontrado.");
                _geralPersist.Delete<Evento>(evento);
                return await _geralPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Evento[]> GetAllEventosAsync(bool includePalestrantes = false)
        {
            return await _eventoPersist
                .GetAllEventosAsync(includePalestrantes);
        }

        public async Task<Evento[]> GetAllEventosByTemaAsync(string Tema, bool includePalestrantes = false)
        {
            return await _eventoPersist
                .GetAllEventosByTemaAsync(Tema, includePalestrantes);
        }

        public async Task<Evento> GetEventoByIdAsync(int eventoId, bool includePalestrantes = false)
        {
            return await _eventoPersist.GetEventoByIdAsync(eventoId, includePalestrantes);
        }
    }
}