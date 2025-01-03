// (pages)/layouts/DashboardLayout.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logout } from "@/app/services/authService";
import SideBar from "../components/UI/SideBar";
import TemasDisponibles from "../components/TemasDisponibles";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@/app/styles/globals.css";

export default function DashboardLayout({ children }) {
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar abierto por defecto
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(() => "");
  const [userName, setUserName] = useState(""); // Estado para almacenar el nombre del usuario
  const router = useRouter();

  useEffect(() => {
    // Verificación del token de autenticación
    const token = localStorage.getItem("access_token");
    const userName = localStorage.getItem("user_name"); // Obtener el nombre del usuario

    if (!token) {
      router.push("/auth/login");
    } else {
      setUserName(userName); // Establecer el nombre del usuario en el estado
    }
  }, [router]);

  useEffect(() => {
    // Configurar el tema inicial desde el almacenamiento local
    const storedTheme = localStorage.getItem("theme") || "dark";
    setSelectedTheme(storedTheme);
    document.documentElement.setAttribute("data-theme", storedTheme);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleThemeDropdown = () => {
    setIsThemeDropdownOpen(!isThemeDropdownOpen);
    setIsProfileDropdownOpen(false); // Cierra el dropdown de perfil si está abierto
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsThemeDropdownOpen(false); // Cierra el dropdown de temas si está abierto
  };

  const handleOutsideClick = (event) => {
    const target = event.target;
    if (!target.closest("aside") && !target.closest("button") && !target.closest(".dropdown")) {
      setIsThemeDropdownOpen(false);
      setIsProfileDropdownOpen(false);
    }
  };

  const handleResize = () => {
    if (window.innerWidth < 640) {
      // Cambia este valor según el breakpoint que prefieras
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      document.cookie = "auth_token=; max-age=0"; // Eliminar token
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setError("Error al cerrar sesión");
    }
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    window.addEventListener("resize", handleResize);
    handleResize(); // Llamar una vez para configurar el estado inicial

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex h-screen">
      <SideBar isSidebarOpen={isSidebarOpen} />
      {/* Main Layout */}
      <div className={`flex-1 flex flex-col ${isSidebarOpen ? "ml-64" : "ml-0"} transition-all duration-300`}>
        {/* Header */}
        <header className="w-full shadow z-40 flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button onClick={toggleSidebar} className="btn btn-square btn-outline z-50">
              <i className="bi bi-list"></i> {/* Icono de menú */}
            </button>
            <div className="flex items-center text-primary">
              <Image src="/logo.png" alt="Logo" className="h-6 w-auto" width={50} height={50} />
              <span className="font-bold ml-2">DB Admin - Proyecto Lista Anime</span>
            </div>
          </div>
          {/* Mensajes de error */}
          {error && <p className="text-error text-sm text-center mb-4">{error}</p>}
          {/* Nav */}
          <nav className="flex items-center space-x-4">
            {/* Selector de tema y saludo */}
            <div className="badge badge-primary">Hola {userName}, usas el tema: {selectedTheme || "Cargando..."}</div>
            {/* dropdown de temas */}
            <div className="dropdown dropdown-end">
              <button
                className="btn btn-ghost btn-circle dropdown-toggle bg-gray-200 text-black"
                tabIndex={0}
                onClick={toggleThemeDropdown}
              >
                Temas
              </button>
              {isThemeDropdownOpen && <TemasDisponibles handleThemeChange={handleThemeChange} />}
            </div>
            {/* dropdown menu de usuario */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle" onClick={toggleProfileDropdown}>
                <div className="w-10 rounded-full">
                  <Image src="/profile-img.jpg" alt="Profile" width={50} height={50} className="rounded-full" />
                </div>
              </label>
              {isProfileDropdownOpen && (
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <a href="/settings">
                      <i className="bi bi-gear"></i> {/* Icono de configuración */}
                      Configuración
                    </a>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="btn btn-error btn-sm">
                      <i className="bi bi-box-arrow-right"></i> {/* Icono de cerrar sesión */}
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-base-100 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
