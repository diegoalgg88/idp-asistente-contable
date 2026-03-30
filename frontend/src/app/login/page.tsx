'use client';

import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/validators/auth.schema';
import { useAuth } from '@/contexts/auth-context';
import { apiRequest } from '@/lib/api-client';
import { TokenResponse, User } from '@/types/auth';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

function LoginPage() {
  const { login } = useAuth();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginInput) => {
    try {
      // 1. Get Token - USAR fetch DIRECTAMENTE PARA EVITAR PROBLEMAS DE URL
      const formData = new URLSearchParams();
      formData.append('username', values.email);
      formData.append('password', values.password);

      const tokenResponse = await fetch('http://localhost:8000/v1/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.detail || 'Error al obtener token');
      }

      const tokenData: TokenResponse = await tokenResponse.json();

      // 2. Get User Info
      const userResponse = await fetch('http://localhost:8000/v1/auth/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.detail || 'Error al obtener usuario');
      }

      const userData: User = await userResponse.json();

      // 3. Set Auth State
      login(tokenData, userData);
    } catch (error: any) {
      alert(`Error de autenticación: ${error.message}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al asistente contable.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="nombre@empresa.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Iniciando sesión...' : 'Entrar'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground italic">
            IDP Asistente Contable v1.0
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPageWrapper() {
  return <Suspense fallback={<div>Loading...</div>}><LoginPage /></Suspense>;
}
