// (pages)/dashboard/anime/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  getAnimes,
  createAnime,
  updateAnime,
  deleteAnime,
  AnimeData,
} from '@/app/services/animesService';
import AnimeTable from '@/app/components/AnimeTable';
import Pagination from '@/app/components/Pagination';
import AnimeModal from '@/app/components/AnimeModal';

export default function AnimePage() {
  const [animes, setAnimes] = useState<AnimeData[]>([]);
  const [filteredAnimes, setFilteredAnimes] = useState<AnimeData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [animeToEdit, setAnimeToEdit] = useState<AnimeData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const recordsPerPage = 10; // Define cuántos registros mostrar por página

  useEffect(() => {
    fetchAnimes(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const filtered = animes.filter((anime) =>
      anime.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAnimes(filtered);
  }, [searchTerm, animes]);

  const fetchAnimes = async (page: number) => {
    try {
      const data = await getAnimes();

      const startIndex = (page - 1) * recordsPerPage;
      const endIndex = startIndex + recordsPerPage;

      setAnimes(
        data.slice(startIndex, endIndex).map((anime) => ({
          ...anime,
          visto: anime.visto === 1 ? 1 : 0, // Aseguramos que "visto" sea 1 o 0
        }))
      ); // Divide los registros por página
      setTotalPages(Math.ceil(data.length / recordsPerPage)); // Calcula el total de páginas
    } catch (error) {
      console.error('Error al cargar animes:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAnime(id);
      fetchAnimes(currentPage);
    } catch (error) {
      console.error('Error al eliminar el anime:', error);
    }
  };

  const handleEdit = (anime: AnimeData) => {
    setAnimeToEdit(anime);
    setModalOpen(true);
  };

  const handleSave = async (anime: AnimeData) => {
    try {
      if (animeToEdit) {
        await updateAnime(animeToEdit.id, anime);
      } else {
        await createAnime(anime);
      }
      setModalOpen(false);
      fetchAnimes(currentPage);
    } catch (error) {
      console.error('Error al guardar el anime:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">Listado de Animes</h1>
      <input
        type="text"
        placeholder="Buscar por nombre"
        className="input input-bordered w-full max-w-xs mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <AnimeTable animes={filteredAnimes} onDelete={handleDelete} onEdit={handleEdit} />
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
      {modalOpen && (
        <AnimeModal anime={animeToEdit} onClose={() => setModalOpen(false)} onSave={handleSave} />
      )}
    </div>
  );
}