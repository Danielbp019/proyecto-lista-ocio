// (pages)/dashboard/anime/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { getAnimes, createAnime, updateAnime, deleteAnime } from "@/app/services/animesService";
import DashboardLayout from "@/app/layouts/DashboardLayout";
// Componentes
import AnimeModal from "@/app/components/AnimeModal";
import ConfirmDialog from "@/app/components/ConfirmDialog";
import AlertSuccess from "@/app/components/AlertSuccess";
import AlertDanger from "@/app/components/AlertDanger";
import Table from "@/app/components/Table";
import Breadcrumb from "@/app/components/Breadcrumb";

export default function AnimePage() {
  const [data, setData] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [animeToEdit, setAnimeToEdit] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [animeToDelete, setAnimeToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertSuccessOpen, setAlertSuccessOpen] = useState(false); // Estado para controlar la alerta de éxito
  const [alertDangerOpen, setAlertDangerOpen] = useState(false); // Estado para controlar la alerta de error
  const [alertMessage, setAlertMessage] = useState(""); // Estado para el mensaje de la alerta

  const fetchAnimes = async () => {
    setLoading(true);
    const userId = localStorage.getItem("user_id"); // Obtener user_id del localStorage
    const result = await getAnimes(userId); // Pasar userId a getAnimes
    if (result.success) {
      setData(result.data);
    } else {
      console.error("Error obteniendo animes:", result.error);
      setAlertMessage(`Error al obtener los animes: ${result.error}`);
      setAlertDangerOpen(true); // Mostrar la alerta de error
    }
    setLoading(false);
  };

  const handleDelete = (id) => {
    setAnimeToDelete(id);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    setConfirmDialogOpen(false);
    const result = await deleteAnime(animeToDelete);
    if (result.success) {
      await fetchAnimes();
      setColumnFilters([]);
      setAlertMessage("Anime eliminado con éxito");
      setAlertSuccessOpen(true);
    } else {
      setAlertMessage(`Error al eliminar el anime: ${result.error}`);
      setAlertDangerOpen(true); // Mostrar la alerta de error
    }
    setAnimeToDelete(null);
  };

  const handleEdit = (anime) => {
    setAnimeToEdit(anime);
    setModalOpen(true);
  };

  const handleSave = async (anime) => {
    const result = animeToEdit ? await updateAnime(animeToEdit.id, anime) : await createAnime(anime);

    if (result.success) {
      setModalOpen(false);
      setAnimeToEdit(null);
      await fetchAnimes();
      setAlertMessage(animeToEdit ? "Anime actualizado con éxito" : "Anime creado con éxito");
      setAlertSuccessOpen(true);
    } else {
      setAlertMessage(`Error al guardar el anime: ${result.error}`);
      setAlertDangerOpen(true); // Mostrar la alerta de error
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setAnimeToEdit(null);
  };

  const handleClearSearch = () => {
    setColumnFilters([]);
  };

  const columns = [
    { accessorKey: "nombre", header: "Nombre", filterFn: "includesString" },
    { accessorKey: "numero_capitulos", header: "Capítulos" },
    {
      accessorKey: "visto",
      header: "Visto",
      cell: ({ row }) => (row.original.visto === 1 ? "Completo" : "Sin terminar"),
    },
    { accessorKey: "comentarios", header: "Comentarios" },
    { accessorKey: "fecha_actualizacion", header: "Última Actualización" },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button className="btn btn-sm btn-primary" onClick={() => handleEdit(row.original)}>
            Editar
          </button>
          <button className="btn btn-sm btn-error" onClick={() => handleDelete(row.original.id)}>
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchAnimes();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
  });

  const breadcrumbItems = [
    { label: "Escritorio", href: "/dashboard" },
    { label: "Lista de animes", active: true },
  ];
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center h-full">
        <div className="w-full mb-4">
          <h1 className="text-2xl font-bold text-left">Listado de Animes</h1>
          <div className="flex items-center justify-between mt-4">
            <Breadcrumb items={breadcrumbItems} />
            <button className="btn btn-wide btn-sm btn-primary mx-auto" onClick={() => setModalOpen(true)}>
              Agregar Nuevo Anime
            </button>
            <div className="flex items-center ml-4">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                className="input input-bordered input-primary input-sm w-full max-w-xs"
                value={columnFilters.find((filter) => filter.id === "nombre")?.value || ""}
                onChange={(e) => setColumnFilters([{ id: "nombre", value: e.target.value }])}
              />
              <button className="btn btn-sm btn-primary ml-2" onClick={handleClearSearch}>
                Borrar
              </button>
            </div>
          </div>
        </div>
        <Table table={table} loading={loading} columns={columns} />
        <AnimeModal isOpen={isModalOpen} anime={animeToEdit} onClose={handleCloseModal} onSave={handleSave} />
        <ConfirmDialog
          isOpen={confirmDialogOpen}
          message="¿Estás seguro de que deseas eliminar este anime? Esta acción no se puede deshacer."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDialogOpen(false)}
        />
        <AlertSuccess isOpen={alertSuccessOpen} message={alertMessage} onClose={() => setAlertSuccessOpen(false)} />
        <AlertDanger isOpen={alertDangerOpen} message={alertMessage} onClose={() => setAlertDangerOpen(false)} />
      </div>
    </DashboardLayout>
  );
}
