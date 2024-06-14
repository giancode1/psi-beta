import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Input, Divider } from "@nextui-org/react";
import useFetchPaises from '../../hooks/usePaises';
import useFetchProvincias from '../../hooks/useProvincias';
import useFetchCantones from '../../hooks/useCantones';
import useFetchParroquias from '../../hooks/useParroquias';
import useFetchPaos from '../../hooks/usePaosList';
import useFetchSesiones from '../../hooks/useSesiones';
import useFetchOpcionesRegistro from '../../hooks/useOpciones';
import useUpdateStudent from '../../hooks/setStudentInfo';

export default function EditForm({ student, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    ide: '',
    identificador: '',
    paisresidencia: '',
    provinciaresidencia: '',
    cantonresidencia: '',
    parroquiaresidencia: '',
    calleprincipal: '',
    callesecuendaria: '',
    numeroresidencia: '',
    email: '',
    telefonomovil: '',
    periodo: '',
    sesion: '',
    opcionregistro: ''
  });

  const { paises, loading: loadingPaises, error: errorPaises } = useFetchPaises();
  const { provincias, loading: loadingProvincias, error: errorProvincias } = useFetchProvincias();
  const { cantones, loading: loadingCantones, error: errorCantones } = useFetchCantones(formValues.provinciaresidencia);
  const { parroquias, loading: loadingParroquias, error: errorParroquias } = useFetchParroquias(formValues.cantonresidencia);
  const { paos, isLoading: loadingPaos, error: errorPaos } = useFetchPaos();
  const { sesiones, isLoading: loadingSesiones, error: errorSesiones } = useFetchSesiones();
  const { opciones, isLoading: loadingOpciones, error: errorOpciones } = useFetchOpcionesRegistro();
  const { updateStudent } = useUpdateStudent();

  useEffect(() => {
    if (student) {
      setFormValues({
        ide: student.id || '',
        identificador: student.identificador || '',
        paisresidencia: '',
        provinciaresidencia: '',
        cantonresidencia: '',
        parroquiaresidencia: '',
        calleprincipal: student.calleprincipal || '',
        callesecuendaria: student.callesecuendaria || '',
        numeroresidencia: '',
        email: student.email || '',
        telefonomovil: student.telefonomovil || '',
        periodo: '',
        sesion: '',
        opcionregistro: ''
      });
      setIsOpen(true);
    }
  }, [student]);

  const handleDropdownChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value.toString() });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStudent({ ...formValues });
      handleModalClose();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleModalClose = () => {
    setIsOpen(false);
    onClose();
  };

  const renderDropdownItems = (items = [], name) => {
    if (!Array.isArray(items)) {
      console.error(`Expected array but received: ${typeof items}`);
      return null;
    }

    return (
      <DropdownMenu aria-label="Dropdown menu" style={{ maxHeight: "200px", overflowY: "auto" }}>
        {items.map((item) => (
          <DropdownItem key={item.id} onClick={() => handleDropdownChange(name, item.id)}>
            {item.nombre}
          </DropdownItem>
        ))}
      </DropdownMenu>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} isDismissable={false} isKeyboardDismissDisabled={false}>
      <ModalContent>
        <ModalHeader>Editar Información del Estudiante</ModalHeader>
        <ModalBody>
          {(loadingPaises || loadingProvincias || loadingCantones || loadingParroquias || loadingPaos || loadingSesiones || loadingOpciones) ? (
            <p>Cargando...</p>
          ) : (errorPaises || errorProvincias || errorCantones || errorParroquias || errorPaos || errorSesiones || errorOpciones) ? (
            <p>{errorPaises?.message || errorProvincias?.message || errorCantones?.message || errorParroquias?.message || errorPaos?.message || errorSesiones?.message || errorOpciones?.message}</p>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">País de Residencia</label>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button className="bg-[#F4F4F5]">
                        {formValues.paisresidencia === '' ? 'Cambiar' : paises.find(pais => pais.id.toString() === formValues.paisresidencia)?.nombre || 'Cambiar'}
                      </Button>
                    </DropdownTrigger>
                    {renderDropdownItems(paises, 'paisresidencia')}
                  </Dropdown>
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">Provincia de Residencia</label>
                  <Dropdown isDisabled={formValues.paisresidencia !== '66'}>
                    <DropdownTrigger>
                      <Button className="bg-[#F4F4F5]" isDisabled={formValues.paisresidencia !== '66'}>
                        {formValues.provinciaresidencia === '' ? 'Cambiar' : provincias.find(provincia => provincia.id.toString() === formValues.provinciaresidencia)?.nombre || 'Cambiar'}
                      </Button>
                    </DropdownTrigger>
                    {renderDropdownItems(provincias, 'provinciaresidencia')}
                  </Dropdown>
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">Cantón de Residencia</label>
                  <Dropdown isDisabled={formValues.paisresidencia !== '66' || formValues.provinciaresidencia === ''}>
                    <DropdownTrigger>
                      <Button className="bg-[#F4F4F5]" isDisabled={formValues.paisresidencia !== '66' || formValues.provinciaresidencia === ''}>
                        {formValues.cantonresidencia === '' ? 'Cambiar' : cantones.find(canton => canton.id.toString() === formValues.cantonresidencia)?.nombre || 'Cambiar'}
                      </Button>
                    </DropdownTrigger>
                    {renderDropdownItems(cantones, 'cantonresidencia')}
                  </Dropdown>
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">Parroquia de Residencia</label>
                  <Dropdown isDisabled={formValues.paisresidencia !== '66' || formValues.cantonresidencia === ''}>
                    <DropdownTrigger>
                      <Button className="bg-[#F4F4F5]" isDisabled={formValues.paisresidencia !== '66' || formValues.cantonresidencia === ''}>
                        {formValues.parroquiaresidencia === '' ? 'Cambiar' : parroquias.find(parroquia => parroquia.id.toString() === formValues.parroquiaresidencia)?.nombre || 'Cambiar'}
                      </Button>
                    </DropdownTrigger>
                    {renderDropdownItems(parroquias, 'parroquiaresidencia')}
                  </Dropdown>
                </div>
              </div>
              <Divider />
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">Periodo</label>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button className="bg-[#F4F4F5]">
                        {formValues.periodo === '' ? 'Cambiar' : paos.find(pao => pao.id.toString() === formValues.periodo)?.nombre || 'Cambiar'}
                      </Button>
                    </DropdownTrigger>
                    {renderDropdownItems(paos, 'periodo')}
                  </Dropdown>
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">Sesión</label>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button className="bg-[#F4F4F5]">
                        {formValues.sesion === '' ? 'Cambiar' : sesiones.find(sesion => sesion.id.toString() === formValues.sesion)?.nombre || 'Cambiar'}
                      </Button>
                    </DropdownTrigger>
                    {renderDropdownItems(sesiones, 'sesion')}
                  </Dropdown>
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">Registro</label>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button className="bg-[#F4F4F5]">
                        {formValues.opcionregistro === '' ? 'Cambiar' : opciones.find(opcion => opcion.id.toString() === formValues.opcionregistro)?.nombre || 'Cambiar'}
                      </Button>
                    </DropdownTrigger>
                    {renderDropdownItems(opciones, 'opcionregistro')}
                  </Dropdown>
                </div>
              </div>
              <Divider />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">Teléfono Móvil</label>
                  <Input
                    type="text"
                    name="telefonomovil"
                    value={formValues.telefonomovil}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Cambiar"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Cambiar"
                    required
                  />
                </div>
              </div>
              <Divider />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">Calle Principal</label>
                  <Input
                    type="text"
                    name="calleprincipal"
                    value={formValues.calleprincipal}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Cambiar"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">Calle Secundaria</label>
                  <Input
                    type="text"
                    name="callesecuendaria"
                    value={formValues.callesecuendaria}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Cambiar"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">Número de Residencia</label>
                  <Input
                    type="text"
                    name="numeroresidencia"
                    value={formValues.numeroresidencia}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Cambiar"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">Identificador</label>
                  <Input
                    type="text"
                    name="identificador"
                    value={formValues.identificador}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Cambiar"
                    required
                  />
                </div>
              </div>
            </form>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" auto flat onPress={handleModalClose}>Cerrar</Button>
          <Button color="primary" auto type="submit" className="col-span-1" onClick={handleSubmit}>Actualizar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
