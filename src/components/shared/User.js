import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User } from '@nextui-org/react';
import { AiOutlineBug } from 'react-icons/ai';
import { PiSignOutBold } from 'react-icons/pi';
import { useUser } from '../../context/UserContext';

const UserOptions = () => {
  const router = useRouter();
  const { userRole, userEmail, setUserRole, setUserEmail } = useUser();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Define el ancho de pantalla que consideras "pequeño"
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Verifica el tamaño de la pantalla al cargar

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/getLogOut');
      setUserRole('');
      setUserEmail('');
      router.push('/'); // Asegúrate de que la ruta sea correcta para tu login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const UserOptionsMobile = () => (
    <DropdownMenu aria-label='User Actions' variant='flat'>
      <DropdownItem key='user_role' className='uppercase'>
        <p className='font-bold' >{userRole ? userRole.toUpperCase() : 'ROL DESCONOCIDO' }</p>
      </DropdownItem>
      <DropdownItem key='user_email'>
        <p className='font-semibold' >{userEmail ? userEmail : 'Correo desconocido'}</p>
      </DropdownItem>
      <DropdownItem endContent={<AiOutlineBug />} key='report_problem'>
        Reportar problema
      </DropdownItem>
      <DropdownItem endContent={<PiSignOutBold />} key='logout' color='error' onClick={handleLogout}>
        Log Out
      </DropdownItem>
    </DropdownMenu>
  );

  const UserOptionsDesktop = () => (
    <DropdownMenu aria-label='User Actions' variant='flat'>
      <DropdownItem endContent={<AiOutlineBug />} key='report_problem'>
        Reportar problema
      </DropdownItem>
      <DropdownItem endContent={<PiSignOutBold />} key='logout' color='error' onClick={handleLogout}>
        Log Out
      </DropdownItem>
    </DropdownMenu>
  );

  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <User
          name={!isSmallScreen ? (userRole ? userRole.toUpperCase() : 'ROL DESCONOCIDO') : ''}
          description={!isSmallScreen ? (userEmail ? userEmail : 'Correo desconocido') : ''}
          avatarProps={{
            color: 'primary',
            as: 'button',
            src: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
          }}
        />
      </DropdownTrigger>
      {isSmallScreen ? <UserOptionsMobile /> : <UserOptionsDesktop />}
    </Dropdown>
  );
};

export default UserOptions;
