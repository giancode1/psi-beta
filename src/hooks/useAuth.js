import { useState } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

const roleRoutes = {
  rectorado: '/dashboard/estadistica/nuevosFecha',
  supervisor: '/dashboard/admisiones/expediente',
  analista: '/dashboard/admisiones/expediente',
  caces: '/dashboard/caces',
  ti: '/dashboard/',
  // Agrega más roles y sus rutas correspondientes aquí
};

export const useAuth = () => {
    const router = useRouter();
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Estado de carga

    const authenticate = async (email, password) => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/getAuth', {   // Ajustado al endpoint correcto
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: email, pass: password }),
            });

            const result = await response.json();

            if (!response.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en la autenticación',
                    text: result.error || 'Error desconocido.',
                });
                setIsLoading(false);
                return false;
            }

            setUserEmail(result.data.emailint); // Establece el correo para depuración
            setUserRole(result.role);  // Ajustado para usar 'result.role' directamente si ese es el formato de la respuesta
            console.log("Rol del usuario:", result.role);  // Asegúrate de que 'role' es la clave correcta
            console.log("Email del usuario:", result.data.emailint);

            // Redirigir según el rol del usuario
            const redirectRoute = roleRoutes[result.role] || '/dashboard';
            router.push(redirectRoute);

            setIsLoading(false);
            return true;
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: 'No se pudo conectar al servidor: ' + error.message,
            });
            setIsLoading(false);
            return false;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!(await authenticate(user, pass))) {
            console.log("Fallo en la autenticación.");
        }
    };

    return {
        setUser,
        setPass,
        handleSubmit,
        userRole,
        userEmail, // Devuelve el correo
        isLoading,
    };
};
