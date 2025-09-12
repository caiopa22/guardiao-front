'use client';

import { useEffect, useState } from 'react';
import { Input } from '../components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { fileToBase64 } from '@/static/functions';

export default function AccessPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    image: null as File | null,
  });

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setLoginData({ email: '', password: '' });
    setRegisterData({ name: '', email: '', password: '', password2: '', image: null });
  };

  const { login, register, isAuthenticated } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isLogin) {
      login(loginData.email, loginData.password);
      return;
    }

    if (!registerData.name) {
      toast.error("Preencha o campo nome.");
      return;
    }

    if (!registerData.email) {
      toast.error("Preencha o campo email.");
      return;
    }

    if (!registerData.password || !registerData.password2) {
      toast.error("Digite a senha");
      return;
    }

    if (registerData.password !== registerData.password2) {
      toast.error("Senhas não são iguais");
      return;
    }

    if (!registerData.image) {
      toast.error("De upload em uma foto.");
      return;
    }

    let imageBase64: string | null = null;
    if (registerData.image) {
      imageBase64 = await fileToBase64(registerData.image);
    }

    register({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      img: imageBase64!
    });
  }

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Acesso realizado com sucesso!');
      navigate('/vault');
    }
  }, [isAuthenticated]);


  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <div className='absolute top-4 right-4'>
        <Toggle
          className='cursor-pointer'
          onClick={() => toggleTheme()}
          aria-label="Toggle theme">
          {theme === 'light' ? <SunIcon className="text-black" /> : <MoonIcon className="text-white" />}
        </Toggle>
      </div>
      <Card className="w-full max-w-md shadow-lg">
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
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <Label className='ml-2' htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="exemplo@gmail.com"
                value={isLogin ? loginData.email : registerData.email}
                onChange={(e) =>
                  isLogin
                    ? setLoginData({ ...loginData, email: e.target.value })
                    : setRegisterData({ ...registerData, email: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className='ml-2' htmlFor="password">Senha</Label>
              <Input
                id="password"
                type='password'
                placeholder='Digite sua senha'
                value={isLogin ? loginData.password : registerData.password}
                onChange={(e) =>
                  isLogin
                    ? setLoginData({ ...loginData, password: e.target.value })
                    : setRegisterData({ ...registerData, password: e.target.value })
                }
              />
            </div>
            {!isLogin && (
              <div className="flex flex-col gap-1">
                <Label className='ml-2' htmlFor="password2">Confirmar senha</Label>
                <Input
                  id="password2"
                  type='password'
                  placeholder="Confirme sua senha"
                  value={registerData.password2}
                  onChange={(e) => setRegisterData({ ...registerData, password2: e.target.value })}
                />
              </div>
            )}
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <Label className="ml-2" htmlFor="image">Foto de perfil</Label>

                <div className="flex justify-between">
                  <label
                    htmlFor="image"
                    className="flex justify-center items-center cursor-pointer px-3 text-sm bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
                  >
                    Escolher imagem
                  </label>


                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        image: e.target.files ? e.target.files[0] : null,
                      })
                    }
                  />
                  {registerData.image ? (
                    <img
                      src={URL.createObjectURL(registerData.image)}
                      alt="Preview"
                      className="size-12 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="size-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                      ?
                    </div>
                  )}
                </div>
              </div>
            )}
            <Button size='lg' className="w-full mt-6 text-white">
              {isLogin ? "Entrar" : "Registrar"}
            </Button>
          </form>
          <Button
            variant="link"
            className="w-full mt-2 text-sm text-gray-500"
            onClick={handleToggle}
          >
            {isLogin ? "Não tem uma conta? Registre-se" : "Já tem uma conta? Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
