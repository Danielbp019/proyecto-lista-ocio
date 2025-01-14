<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ObraUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
            'nombre' => ['sometimes', 'string', 'max:255'],
            'numero_capitulos' => ['sometimes', 'integer', 'min:1'],
            'visto' => ['sometimes', 'boolean'],
            'comentarios' => ['nullable', 'string']
        ];
    }
}
