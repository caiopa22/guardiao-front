'use client';

import { use, useEffect, useState } from 'react';
import { Input } from '../components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { BoldIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

export default function AccessPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', password2: '' });

  const handleToggle = () => {
    setIsLogin(!isLogin);

    setLoginData({ email: '', password: '' });
    setRegisterData({ name: '', email: '', password: '', password2: '' });
  };


  const { login, isAuthenticated } = useAuth();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLogin) {
      login(loginData.email, loginData.password);
      return
    }

  }

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Acesso realizado com sucesso!');
      navigate('/vault');
    }
  }, [isAuthenticated])

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <div className='absolute top-4 right-4'>
        <Toggle
          className='cursor-pointer'
          onClick={() => toggleTheme()}
          aria-label="Toggle italic">
          {theme === 'light' ? <SunIcon className="text-black" /> : <MoonIcon className="text-white" />}
        </Toggle>
      </div>
      <Card className="w-full max-w-md shadow-lg ">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-sans">
            {isLogin ? "Login" : "Registro"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="flex flex-col gap-1">
                <Label className='ml-2' htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Seu nome"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <Label className='ml-2' htmlFor="email">Email</Label>
              <Input
                id="email" placeholder="exemplo@gmail.com"
                value={isLogin ? loginData.email : undefined}
                onChange={(e) => isLogin ? setLoginData({ ...loginData, email: e.target.value }) : setRegisterData({ ...registerData, email: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className='ml-2' htmlFor="password">Senha</Label>
              <Input
                id="password"
                type='password'
                placeholder='Digite sua senha'
                value={isLogin ? loginData.password : registerData.password}
                onChange={(e) => isLogin ? setLoginData({ ...loginData, password: e.target.value }) : setRegisterData({ ...registerData, password: e.target.value })}
              />
            </div>
            {!isLogin && (
              <div className="flex flex-col gap-1">
                <Label className='ml-2' htmlFor="name">Confirmar senha</Label>
                <Input id="password2" placeholder="Confirme sua senha"
                  value={registerData.password2}
                  type='password'
                  onChange={(e) => setRegisterData({ ...registerData, password2: e.target.value })}
                />
              </div>
            )}
            <Button
              size='lg' className="w-full mt-6 text-white">
              {isLogin ? "Entrar" : "Registrar"}
            </Button>
            <Button
              variant="link"
              className="w-full mt-2 text-sm text-gray-500"
              onClick={handleToggle}
            >
              {isLogin ? "Não tem uma conta? Registre-se" : "Já tem uma conta? Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
