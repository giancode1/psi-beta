import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, useDisclosure } from "@nextui-org/react";
import useFetchAnalistas from "../../hooks/useAnalistasList";
import useUpdateAnalista from "../../hooks/setAnalista";
import Swal from "sweetalert2";
import { FiUserPlus } from "react-icons/fi";

export default function AnalistaDropdown({ studentIds }) { // Recibe los IDs de estudiantes seleccionados como props
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { analista, isLoading: isLoadingAnalistas } = useFetchAnalistas();
  const { updateAnalista, isLoading: isUpdating } = useUpdateAnalista(); // Usa el hook
  const [selectedAnalista, setSelectedAnalista] = useState();

  const handleSelectAnalista = (key) => {
    const analistaSeleccionado = analista.find(a => a.id.toString() === key);
    setSelectedAnalista(analistaSeleccionado);
    console.log("Analista seleccionado ID:", analistaSeleccionado.id); // Muestra por consola el ID del analista seleccionado
  };

  const handleConfirm = async () => {
    if (!selectedAnalista || studentIds.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar un analista y al menos un estudiante.',
      });
      return;
    }

    const result = await Swal.fire({
      title: '¿Está seguro?',
      text: `Está a punto de asignar el analista: ${selectedAnalista.nombreCompleto} a ${studentIds.length} estudiantes.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, asignar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      await updateAnalista(studentIds, selectedAnalista.id); // Llama al hook con los datos seleccionados
      onClose(); // Cierra el modal después de confirmar
    }
  };

  return (
    <>
      <Button flat onPress={onOpen} startContent={<FiUserPlus />} className="bg-[#0D4488] text-white font-semibold">
        Analista
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isDismissable={false}>
        <ModalContent>
          <ModalHeader>Asignar Analista</ModalHeader>
          <ModalBody>
            <Dropdown>
              <DropdownTrigger>
                <Button className="bg-[#F4F4F5]">
                  {selectedAnalista ? selectedAnalista.nombreCompleto : "Seleccione un analista"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Analistas"
                selectionMode="single"
                selectedKeys={selectedAnalista ? [selectedAnalista.id.toString()] : []}
                onSelectionChange={(keys) => {
                  const key = keys.values().next().value;
                  handleSelectAnalista(key);
                }}
              >
                {analista.map((item) => (
                  <DropdownItem key={item.id.toString()}>{item.nombreCompleto}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={onClose}>
              Cerrar
            </Button>
            <Button color="primary" onPress={handleConfirm} disabled={isUpdating || !selectedAnalista}>
              {isUpdating ? 'Asignando...' : 'Confirmar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
