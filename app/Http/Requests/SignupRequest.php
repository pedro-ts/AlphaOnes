<?php
// Na primeira linha da função de singnup, damos o comando validade, ou seja para validar os dados vindo de data, aqui criamos como eles serão validados e mudamos o authorize para true
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class SignupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; //está linha serve para bloquear a requisição automaticamente por isso deve ser mudada para true pq mesmos usuarios que não estão logados podem fazer requisições, quando for uma requisição que precisa ter um certo cargo e estar logado por exemplo, se deve fazer uma logica para bloquear automaticamente caso não esteja logado ou não contenha um cargo
        // exemplo:
        // public function authorize(): bool
        // {
        //     // só autoriza se o usuário atual é admin
        //     return auth()->user()?->is_admin === true;
        // }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:55',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->symbols()

            ]
        ];
    }
}
