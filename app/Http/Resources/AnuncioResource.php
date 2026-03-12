<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AnuncioResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'          => $this->id,
            'id_event'   => $this->id_Event,
            'title'      => $this->name_anuncio ?? 'sin titulo',
            'description' => $this->description_anuncio ?? 'sin descripcion',
            // Aquí usamos el FeaturedProductResource para que los licores se vean perfectos
            'productos'   => FeaturedProductResource::collection($this->whenLoaded('productos')),
        ];
    }
}