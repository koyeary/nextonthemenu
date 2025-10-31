"use client";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getCurrentUser, login, logout } from "lib/login/login.ts";

const queryClient = new QueryClient();

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// --- Hooks ---

export function useAuth() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const user = data?.user || null;

  const loginMutation = useMutation({
    mutationFn: (pin: string) => login(pin),
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
      router.push("/orders");
    },
  });

  const router = useRouter();
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], { user: null });
      router.push("/login");
    },
  });

  return {
    user,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoading: loginMutation.isPending,
  };
}
