import React from 'react';
import Image from 'next/image';
import { Card, CardBody, Input, Button, Divider } from "@nextui-org/react";
import { EyeIcon, EyeOffIcon, MailIcon } from 'lucide-react';
import LOGOPSI02 from '../../../public/images/LOGOPSI02.png';
import { redirectToDashboard } from '../../utils/auth';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const { setUser, setPass, handleSubmit, isLoading } = useAuth();
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Card className="bg-[#104082] rounded-2xl shadow-2xl fixed overflow-hidden w-full max-w-full min-h-[480px] sm:w-[768px] flex flex-col sm:flex-row justify-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-8">
      <div className="hidden sm:block w-full absolute top-0 left-0 sm:w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out rounded-r-[140px]">
        <div className="relative h-full w-full bg-white text-[#104082] transition-all duration-700 ease-in-out">
          <div className="absolute w-full h-full flex flex-col items-center justify-center p-8 text-center">
            <Image src={LOGOPSI02} width={280} alt='PSI LOGO' />
          </div>
        </div>
      </div>
      <div className="w-full sm:absolute top-0 left-1/2 sm:w-1/2 h-full p-8 transition-all duration-700 ease-in-out">
        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center h-full space-y-5">
          <h2 className='text-3xl font-bold text-white text-center'>Bienvenido</h2>
          <Divider className='bg-white border-2 w-10 border-white inline-block mb-2'></Divider>
          <p className='text-gray-300 my-2.5 mb-10 text-center'>Recuerde utilizar su correo institucional</p>
          <Input
            type="email"
            label="Email"
            placeholder='Ingrese su correo institucional'
            onChange={(e) => setUser(e.target.value)}
            className="w-full max-w-xs"
            endContent={<MailIcon className='text-2xl text-default-400 pointer-events-none'></MailIcon>}
          />
          <Input
            label='Password'
            placeholder="Ingrese su contraseña"
            onChange={(e) => setPass(e.target.value)}
            className="w-full max-w-xs"
            endContent={
              <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeOffIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />
          <Button type="submit" variant='ghost' className="bg-white text-[#104082] text-sm py-2 px-10 border-transparent rounded-2xl font-semibold uppercase mt-2.5 cursor-pointer" isLoading={isLoading}>
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
      </div>
    </Card>
  );
}

export async function getServerSideProps(context) {
  const result = redirectToDashboard(context);
  if (result) return result;

  return { props: {} }; // Continúa con la carga normal de la página si no hay redirección necesaria
}
