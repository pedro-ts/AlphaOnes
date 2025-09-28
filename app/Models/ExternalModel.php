<?php

namespace App\Models;

abstract class ExternalModel extends BaseModel
{
    // Usa SEMPRE a conexão 'external' definida no config/database.php
    protected $connection = 'external';

    // Muitos bancos legados não têm created_at/updated_at do Laravel
    public $timestamps = false;
}

// Não esquecer de quando for criar usando artisa:
    // php artisan make:model nomeDoModel
// Deixar a primeira linha da função dando extends no basemodel external
    // Exemplo:
    // class LegacyCliente extends nomeDoModel

// =====================================================================================
// Observação: aqui eu fiz extends ExternalModel.
// Se você não tivesse criado a classe ExternalModel (que já define protected $connection = 'external'), então teria que colocar manualmente dentro do LegacyCliente:

// protected $connection = 'external';
