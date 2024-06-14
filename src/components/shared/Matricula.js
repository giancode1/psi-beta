import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu } from "@nextui-org/react";
import Swal from 'sweetalert2';
import useSetMatricula from "../../hooks/setMatricula";
import { HiOutlineDocumentCheck } from "react-icons/hi2";


export default function MatriculaStatusDropdown({ studentIds = [] }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStatus, setSelectedStatus] = useState("");
  const { updateHabilitarMatricula, isLoading } = useSetMatricula();  // Removed 'error' and 'result' as they are handled in hook

  const handleSelectStatus = (status) => {
    setSelectedStatus(status);
  };

  const handleUpdateStatus = async () => {
    // Confirmation dialog
    const confirmResult = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a actualizar el estado de matrícula para ${studentIds.length} estudiantes a ${selectedStatus === "1" ? "habilitado" : "deshabilitado"}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar!'
    });

    if (confirmResult.isConfirmed) {
      onOpen();
      await updateHabilitarMatricula(studentIds, selectedStatus);
      onClose();  // Modal is closed here regardless of the result, error handling is inside the hook
    }
  };

  return (
    <>
      <Button flat onPress={onOpen} startContent={<HiOutlineDocumentCheck />} disabled={studentIds.length === 0 || isLoading} className="bg-[#0D4488] text-white font-semibold">
        Matrícula
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isDismissable={false}>
        <ModalContent>
          <ModalHeader>Actualizar Estado de Matrícula</ModalHeader>
          <ModalBody>
            <Dropdown>
              <DropdownTrigger>
                <Button className="bg-[#F4F4F5]" filled light disabled={selectedStatus === ""}>
                  {selectedStatus === "1" ? "Habilitar" : selectedStatus === "0" ? "Deshabilitar" : "Seleccione Estado"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="1" onClick={() => handleSelectStatus("1")}>Habilitar</DropdownItem>
                <DropdownItem key="0" onClick={() => handleSelectStatus("0")}>Deshabilitar</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" auto flat onPress={onClose}>Cerrar</Button>
            <Button color="primary" auto onPress={handleUpdateStatus} disabled={selectedStatus === "" || isLoading}>Confirmar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
