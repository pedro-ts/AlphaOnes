<?php
// Importar AuthController usado na Auth rota
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EstatisticasController;
// Importar o crud api do usuario
use App\Http\Controllers\Api\UserController;
// Imports padrão
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::apiResource('/users', UserController::class);

    Route::prefix('estatisticas')->group(function () {
        Route::get('/bases', [EstatisticasController::class, 'bases']); // GET /api/estatisticas/bases
        Route::post('/campanha', [EstatisticasController::class, 'campanha']);
    });
    
});

// Auth rota
Route::post('/signup', [AuthController::class, 'signup']);
// Route::post('/login', [AuthController::class, 'login']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1'); //rate limit no login