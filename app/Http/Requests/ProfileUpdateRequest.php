<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Obtiene las reglas de validación que se aplican a la solicitud.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre_usuario' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'peso' => ['nullable', 'numeric', 'min:0', 'max:500'],
            'altura' => ['nullable', 'numeric', 'min:0', 'max:300'],
            'peso_objetivo' => ['nullable', 'numeric', 'min:0', 'max:500'],
            'calorias_diarias' => ['nullable', 'integer', 'min:0', 'max:10000'],
            'genero' => ['nullable', 'string', 'in:masculino,femenino'],
            'edad' => ['nullable', 'integer', 'min:1', 'max:120'],
            'nivel_actividad' => ['nullable', 'string', 'max:255'],
            'target_proteins' => ['nullable', 'integer', 'min:0', 'max:1000'],
            'target_carbs' => ['nullable', 'integer', 'min:0', 'max:1000'],
            'target_fats' => ['nullable', 'integer', 'min:0', 'max:1000'],
        ];
    }
}
