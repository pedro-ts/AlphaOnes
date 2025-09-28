<?php
// Base model é o arquivo que é criado para padronizar os models principalemente esses que vão ser consumidos via API
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

abstract class BaseModel extends Model
{
    // Proteção: por padrão nada é fillable (você decide no serviço/repositório)
    protected $guarded = [];

    // Campos que você não quer expor em JSON
    protected $hidden  = [];

    // Conversões comuns (defina nos filhos quando precisar)
    protected $casts   = [];
}
