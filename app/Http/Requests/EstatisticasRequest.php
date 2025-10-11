<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EstatisticasRequest extends FormRequest
{
    /**
     * Pare na primeira falha para respostas mais objetivas.
     */
    protected $stopOnFirstFailure = true;

    /**
     * Autoriza todos (ajuste se houver política específica).
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normaliza antes de validar:
     * - aceita ids como CSV ou array,
     * - remove vazios,
     * - converte para int.
     */
    protected function prepareForValidation(): void
    {
        $ids = $this->input('ids');

        if (is_string($ids)) {
            $ids = array_map('trim', explode(',', $ids));
        }

        if (is_array($ids)) {
            $ids = array_values(array_filter($ids, static fn($v) => $v !== '' && $v !== null));
            $ids = array_map(static fn($v) => (int) $v, $ids);
        }

        $this->merge([
            'ids'    => $ids ?? [],
            'inicio' => $this->input('inicio'),
            'fim'    => $this->input('fim'),
        ]);
    }

    /**
     * Regras.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'ids'      => ['required', 'array', 'min:1'],
            'ids.*'    => ['integer', 'min:1'],
            'inicio'   => ['required', 'date_format:Y-m-d'],
            'fim'      => ['required', 'date_format:Y-m-d', 'after_or_equal:inicio'],
        ];
    }

    /**
     * Nomes amigáveis dos atributos.
     */
    public function attributes(): array
    {
        return [
            'ids'    => 'campanhas',
            'ids.*'  => 'campanha',
            'inicio' => 'data inicial',
            'fim'    => 'data final',
        ];
    }

    /**
     * Mensagens customizadas.
     */
    public function messages(): array
    {
        return [
            'ids.required'     => 'Informe ao menos uma campanha.',
            'ids.array'        => 'O campo campanhas deve ser uma lista.',
            'ids.min'          => 'Informe ao menos uma campanha.',
            'ids.*.integer'    => 'Cada campanha deve ser um ID numérico.',
            'ids.*.min'        => 'IDs de campanha devem ser positivos.',
            'inicio.required'  => 'Informe a data inicial.',
            'inicio.date_format' => 'A data inicial deve estar no formato Y-m-d.',
            'fim.required'     => 'Informe a data final.',
            'fim.date_format'  => 'A data final deve estar no formato Y-m-d.',
            'fim.after_or_equal' => 'A data final deve ser igual ou posterior à data inicial.',
        ];
    }
}
