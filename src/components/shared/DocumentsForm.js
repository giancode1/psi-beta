import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import useUploadDoc from '../../hooks/setDocs';
import useGetDocList from '../../hooks/useDocList';

export default function DocumentsForm({ studentId, identificador, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const { uploadDocument, loading } = useUploadDoc();
  const { docs, isLoading: docsLoading } = useGetDocList(isOpen);
  const [formValues, setFormValues] = useState({
    nombre: '',
    tipodocumento: '',
    observaciones: '',
    archivador: identificador || ''
  });
  const [file, setFile] = useState(null);

  const resetFormValues = () => {
    setFormValues({
      nombre: '',
      tipodocumento: '',
      observaciones: '',
      archivador: identificador || ''
    });
    setFile(null);
  };

  useEffect(() => {
    if (studentId) {
      resetFormValues();
      setIsOpen(true);
    }
  }, [studentId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'archivo' && files && files.length > 0) {
      setFile(files[0]);
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleDropdownChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await uploadDocument({ ...formValues, id: studentId }, file);
    handleModalClose();
  };

  const renderDropdownItems = (items, name) => {
    return (
      <DropdownMenu
        aria-label="Dropdown menu"
        style={{ maxHeight: "200px", overflowY: "auto" }}
      >
        {items.map((item) => (
          <DropdownItem key={item.id || item} onClick={() => handleDropdownChange(name, item.id || item)}>
            {item.nombre || (item === '1' ? 'Sí' : 'No')}
          </DropdownItem>
        ))}
      </DropdownMenu>
    );
  };

  const handleModalClose = () => {
    resetFormValues();
    setIsOpen(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} isDismissable={false} isKeyboardDismissDisabled={false}>
      <ModalContent>
        <ModalHeader>Añadir Documentos</ModalHeader>
        <ModalBody>
          <form id="upload-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4 col-span-1">
              <Input
                type="text"
                name="nombre"
                label="Nombre"
                labelPlacement="outside"
                placeholder="Nombre"
                value={formValues.nombre}
                onChange={handleChange}
                fullWidth
                required
              />
              <Input
                type="text"
                name="archivador"
                label="Expediente"
                labelPlacement="outside"
                placeholder="Número de Expediente"
                value={formValues.archivador}
                onChange={handleChange}
                fullWidth
                disabled={!!identificador}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Tipo de Documento</label>
              {docsLoading ? (
                <Button className="bg-[#F4F4F5]">Cargando...</Button>
              ) : (
                <Dropdown>
                  <DropdownTrigger>
                    <Button className="bg-[#F4F4F5]">
                      {formValues.tipodocumento === '' ? 'Seleccione Tipo de Documento' : docs.find(doc => doc.id === formValues.tipodocumento)?.nombre || 'Seleccione Tipo de Documento'}
                    </Button>
                  </DropdownTrigger>
                  {renderDropdownItems(docs, 'tipodocumento')}
                </Dropdown>
              )}
            </div>
            <div className="col-span-1">
              <Input
                type="text"
                name="observaciones"
                label="Observaciones"
                labelPlacement="outside"
                placeholder="Observaciones"
                value={formValues.observaciones}
                onChange={handleChange}
                fullWidth
              />
            </div>
            <div className="col-span-1">
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Archivo</label>
                {file ? (
                  <>
                    <p className="text-sm text-gray-600">Archivo seleccionado: {file.name}</p>
                    <Button color="error" auto onClick={handleRemoveFile}>Eliminar Archivo</Button>
                  </>
                ) : (
                  <input
                    type="file"
                    name="archivo"
                    className="border border-gray-300 rounded-md p-2"
                    onChange={handleChange}
                    accept="*/*"
                    required
                  />
                )}
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" auto flat onPress={handleModalClose}>Cerrar</Button>
          <Button color="primary" auto form="upload-form" type="submit" disabled={loading}>
            Subir Documento
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
