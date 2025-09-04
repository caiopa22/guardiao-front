'use client';

import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function AccessPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggle = () => setIsLogin(!isLogin);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary dark">
      <Card className="w-full max-w-md shadow-lg ">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-sans">
            {isLogin ? "Login" : "Registro"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isLogin && (
            <div className="flex flex-col gap-1">
              <Label className='ml-2' htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Seu nome" />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <Label className='ml-2' htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className='ml-2' htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="********" />
          </div>
          {!isLogin && (
            <div className="flex flex-col gap-1">
              <Label className='ml-2' htmlFor="name">Confirmar senha</Label>
              <Input id="name" placeholder="Seu nome" />
            </div>
          )}
          <Button size='lg' className="w-full mt-6">
            {isLogin ? "Entrar" : "Registrar"}
          </Button>
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
