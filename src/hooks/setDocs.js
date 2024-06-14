import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const useUploadDoc = () => {
    const [loading, setLoading] = useState(false);

    const uploadDocument = async (formData, file) => {
        if (!formData.nombre || !formData.tipodocumento || !file) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Todos los campos obligatorios deben ser completados.',
            });
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            data.append('copiadigital', '1'); // Aseguramos que siempre esté en '1'

            // Campos obligatorios
            data.append('nombre', formData.nombre);
            data.append('tipodocumento', formData.tipodocumento);
            data.append('id', formData.id);
            data.append('archivo', file);

            // Campos opcionales
            if (formData.copiafisica) {
                data.append('copiafisica', formData.copiafisica);
            }
            if (formData.observaciones) {
                data.append('observaciones', formData.observaciones);
            }
            if (formData.archivador) {
                data.append('archivador', formData.archivador);
            }
            if (formData.visibleestudiante) {
                data.append('visibleestudiante', formData.visibleestudiante);
            }

            console.log('Datos a enviar:', Object.fromEntries(data.entries()));

            const response = await axios.post('/api/postDocuments', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Documento subido correctamente',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.msg || 'Error al subir el documento',
                });
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Error al subir el documento',
            });
        } finally {
            setLoading(false);
        }
    };

    return { uploadDocument, loading };
};

export default useUploadDoc;
