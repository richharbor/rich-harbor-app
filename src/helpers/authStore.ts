import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

export interface Role {
  id: number;
  name: string;
  isPrimary: boolean;
  permissions: string[];
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isSuperAdmin: boolean;
  isActive: boolean;
}

interface OnboardingStatus {
  required: boolean;
  applicationId?: number;
  currentStep?: number;
  completedSteps?: number[];
  status?: string;
  message?: string;
}

interface AuthState {
  // User data
  user: User | null;
  token: string | null;

  // Roles
  allRoles: Role[];
  currentRole: Role | null;

  // Onboarding
  onboardingStatus: OnboardingStatus | null;

  // Actions
  setAuth: (user: User, token: string, roles: Role[]) => void;
  setCurrentRole: (roleId: number) => void;
  setOnboardingStatus: (status: OnboardingStatus) => void;
  clearAuth: () => void;
  updateUser: (userData: Partial<User>) => void;
  hasRole: (roleName: string) => boolean;
  getPrimaryRole: () => Role | null;
  isAuthenticated: () => boolean;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      allRoles: [],
      currentRole: null,
      onboardingStatus: null,

      // Set authentication data
      setAuth: (user, token, roles) => {
        // Save token to cookie
        // Cookies.set("token", token, { expires: 7 });

        // Find primary role or first role
        const primaryRole = roles.find((r) => r.isPrimary) || roles[0] || null;

        set({
          user,
          token,
          allRoles: roles,
          currentRole: primaryRole,
        });
      },

      // Switch current role
      setCurrentRole: (roleId) => {
        const { allRoles } = get();
        const role = allRoles.find((r) => r.id === roleId);

        if (role) {
          set({ currentRole: role });
          // Optionally save to cookie for persistence
          Cookies.set("currentRole", role.name);
        }
      },

      // Set onboarding status
      setOnboardingStatus: (status) => {
        set({ onboardingStatus: status });
      },

      // Clear all auth data (logout)
      clearAuth: () => {
        Cookies.remove("token");
        Cookies.remove("currentRole");

        set({
          user: null,
          token: null,
          allRoles: [],
          currentRole: null,
          onboardingStatus: null,
        });
      },

      // Update user data
      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },

      // Check if user has a specific role
      hasRole: (roleName) => {
        const { allRoles } = get();
        return allRoles.some((role) => role.name === roleName);
      },

      // Get primary role
      getPrimaryRole: () => {
        const { allRoles } = get();
        return allRoles.find((role) => role.isPrimary) || null;
      },

      // Check if authenticated
      isAuthenticated: () => {
        const { user, token } = get();
        return !!(user && token);
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        allRoles: state.allRoles,
        currentRole: state.currentRole,
        // Don't persist token in localStorage, keep it in cookies only
      }),
    }
  )
);

export default useAuthStore;
