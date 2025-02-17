<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\ObraModel;
// Validaciones
use App\Http\Requests\ObraStoreRequest;
use App\Http\Requests\ObraUpdateRequest;
use Illuminate\Support\Carbon;

class ObraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Obtener el id del usuario desde la solicitud
            $userId = $request->id;
            // Select con filtro por user_id
            $obra = ObraModel::select(
                'id',
                'nombre',
                'numero_capitulos',
                'visto',
                'comentarios',
                'fecha_actualizacion',
                'tipo_id'
            )
                ->where('user_id', $userId)
                ->orderBy('nombre', 'asc')
                ->get();

            return response()->json($obra);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ObraStoreRequest $request)
    {
        //
        try {
            $nuevoObra = ObraModel::create([
                'nombre' => ucwords(strtolower(trim($request['nombre']))),
                'numero_capitulos' => trim($request['numero_capitulos']),
                'visto' => $request['visto'],
                'comentarios' => $this->mb_ucfirst(trim($request['comentarios']), "UTF-8", true),
                'fecha_actualizacion' => Carbon::now()->format('Y-m-d'),
                'user_id' => $request->user_id,
                'tipo_id' => $request->tipo_id
            ]);

            return response()->json(['success' => true, 'nuevoObra' => $nuevoObra], 201);
        } catch (\Exception $e) {
            /* \Log::error('Error al crear la obra: ' . $e->getMessage()); Pone el error en el log*/
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        try {
            $obraBuscar = ObraModel::findOrFail($id);

            return response()->json($obraBuscar);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ObraUpdateRequest $request, string $id)
    {
        //
        try {
            $editarObra = ObraModel::findOrFail($id);
            $editarObra->fill([
                'nombre' => ucwords(strtolower(trim($request['nombre']))),
                'numero_capitulos' => trim($request['numero_capitulos']),
                'visto' => $request['visto'],
                'comentarios' => $this->mb_ucfirst(trim($request['comentarios']), "UTF-8", true),
                'fecha_actualizacion' => Carbon::now()->format('Y-m-d'),
                'tipo_id' => $request->tipo_id
            ]);
            $editarObra->save();

            return response()->json(['success' => true, 'editarObra' => $editarObra], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        try {
            $borrarObra = ObraModel::findOrFail($id);
            $borrarObra->delete();

            return response()->json(['success' => true, 'message' => 'Obra eliminado correctamente.'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /*     Convertir solo la primera letra en mayuscula de una texto o parrafo ignorando si existen numeros antes.
    echo mb_ucfirst("01 arenga"); Output: "01 Arenga"
    echo mb_ucfirst("123 ejemplo de texto"); Output: "123 Ejemplo de texto"
    echo mb_ucfirst("sin numeros"); Output: "Sin numeros"
    echo mb_ucfirst("123456"); Output: "123456" */

    public function mb_ucfirst($str, $encoding = "UTF-8", $lower_str_end = false)
    {
        // Buscar la primera letra alfabética
        preg_match('/[^\d\s]/u', $str, $matches, PREG_OFFSET_CAPTURE);
        // Si no hay letras alfabéticas, retornar la cadena original
        if (empty($matches)) {
            return $str;
        }
        $first_letter_pos = $matches[0][1];
        $first_letter = mb_strtoupper(mb_substr($str, $first_letter_pos, 1, $encoding), $encoding);
        // Partes iniciales y finales de la cadena
        $before_letter = mb_substr($str, 0, $first_letter_pos, $encoding);
        $after_letter = mb_substr($str, $first_letter_pos + 1, null, $encoding);

        if ($lower_str_end) {
            $after_letter = mb_strtolower($after_letter, $encoding);
        }

        return $before_letter . $first_letter . $after_letter;
    }
}
