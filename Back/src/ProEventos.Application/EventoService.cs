using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class EventoService : IEventoService
    {
        private readonly IGeralPersist _geralPersist;
        private readonly IEventoPersist _eventoPersist;
        private readonly IMapper _mapper;
        public EventoService(IGeralPersist geralPersist, IEventoPersist eventoPersist, IMapper mapper)
        {
            this._mapper = mapper;
            this._eventoPersist = eventoPersist;
            this._geralPersist = geralPersist;

        }
        public async Task<EventoDto> AddEvento(EventoDto model)
        {
            try
            {
                Evento evento = _mapper.Map<Evento>(model);
                _geralPersist.Add<Evento>(evento);
                if (await _geralPersist.SaveChangesAsync())
                {
                    Evento resultado = await _eventoPersist.GetEventoByIdAsync(evento.Id, false);
                    return _mapper.Map<EventoDto>(resultado);
                }
                return null;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto> UpdateEvento(int eventoId, EventoDto model)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId);
                if (evento == null) return null;

                _mapper.Map(model, evento);
                model.Id = evento.Id;
                _geralPersist.Update<Evento>(evento);
                if (await _geralPersist.SaveChangesAsync())
                {
                    Evento retorno = await _eventoPersist.GetEventoByIdAsync(evento.Id, false);
                    return _mapper.Map<EventoDto>(retorno);
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

                if (evento == null) throw new Exception("Evento não foi encontrado.");
                _geralPersist.Delete<Evento>(evento);
                return await _geralPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto[]> GetAllEventosAsync(bool includePalestrantes = false)
        {
            Evento[] eventos = await _eventoPersist
                .GetAllEventosAsync(includePalestrantes);
            if (eventos == null) return null;
            return _mapper.Map<EventoDto[]>(eventos);
        }

        public async Task<EventoDto[]> GetAllEventosByTemaAsync(string Tema, bool includePalestrantes = false)
        {
            Evento[] eventos = await _eventoPersist
                .GetAllEventosByTemaAsync(Tema, includePalestrantes);
            if (eventos == null) return null;
            return _mapper.Map<EventoDto[]>(eventos);
        }

        public async Task<EventoDto> GetEventoByIdAsync(int eventoId, bool includePalestrantes = false)
        {
            Evento evento = await _eventoPersist.GetEventoByIdAsync(eventoId, includePalestrantes);
            if (evento == null) return null;
            return _mapper.Map<EventoDto>(evento);
        }
    }
}