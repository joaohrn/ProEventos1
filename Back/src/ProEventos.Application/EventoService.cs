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
        public async Task<EventoDto> AddEvento(int userId, EventoDto model)
        {
            try
            {
                Evento evento = _mapper.Map<Evento>(model);
                evento.UserId = userId;
                _geralPersist.Add<Evento>(evento);
                if (await _geralPersist.SaveChangesAsync())
                {
                    Evento resultado = await _eventoPersist.GetEventoByIdAsync(userId, evento.Id, false);
                    return _mapper.Map<EventoDto>(resultado);
                }
                return null;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto> UpdateEvento(int userId, int eventoId, EventoDto model)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(userId, eventoId);
                if (evento == null) return null;

                _mapper.Map(model, evento);
                model.Id = evento.Id;
                model.UserId = userId;
                _geralPersist.Update<Evento>(evento);
                if (await _geralPersist.SaveChangesAsync())
                {
                    Evento retorno = await _eventoPersist.GetEventoByIdAsync(userId, evento.Id, false);
                    return _mapper.Map<EventoDto>(retorno);
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteEvento(int userId, int eventoId)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(userId, eventoId);

                if (evento == null) throw new Exception("Evento não foi encontrado.");
                _geralPersist.Delete<Evento>(evento);
                return await _geralPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto[]> GetAllEventosAsync(int userId, bool includePalestrantes = false)
        {
            Evento[] eventos = await _eventoPersist
                .GetAllEventosAsync(userId, includePalestrantes);
            if (eventos == null) return null;
            return _mapper.Map<EventoDto[]>(eventos);
        }

        public async Task<EventoDto[]> GetAllEventosByTemaAsync(int userId, string Tema, bool includePalestrantes = false)
        {
            Evento[] eventos = await _eventoPersist
                .GetAllEventosByTemaAsync(userId, Tema, includePalestrantes);
            if (eventos == null) return null;
            return _mapper.Map<EventoDto[]>(eventos);
        }

        public async Task<EventoDto> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false)
        {
            Evento evento = await _eventoPersist.GetEventoByIdAsync(userId, eventoId, includePalestrantes);
            if (evento == null) return null;
            return _mapper.Map<EventoDto>(evento);
        }
    }
}