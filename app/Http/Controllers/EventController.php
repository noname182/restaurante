<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use Inertia\Inertia;
use App\Http\Resources\EventResource;
use App\Models\Anuncio;

class EventController extends Controller
{
   
    /**
     *  funcion para mostrar detalle del evento, anuncios
     *  con productos disponibles y su multimedia y variantes cargadas.
     * */
    public function show($id)
    {
       // 1. Eager Loading con filtros para optimizar la carga de productos
        $eventDetail = Evento::with([

            'anuncios' => function($query) {
                $query->select('id', 'id_Event', 'name_anuncio', 'description_anuncio');
            },

            'anuncios.productos' => function($query) {
                // Solo traemos productos disponibles y cargamos su multimedia
                $query->where('available', 1)
                      ->with(['multimedia', 'variants.values.attribute']);
         }
        ])->findOrFail($id);

        return Inertia::render('Event', [
            'eventDetail' => new EventResource($eventDetail)
        ]);
    }

    /**
     * Función complementaria para obtener anuncios vía API si fuera necesario.
     */
    public function getAnuncios($eventId) {
        return Anuncio::where('id_Event', $eventId)
            ->with(['productos' => fn($q) => $q->where('available', 1)])
            ->get();
    }

    
}

