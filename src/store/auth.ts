import { create } from "zustand";

interface AuthStoreState {
  isLoading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
}

interface AuthStoreActions {
  setLoggedIn: (loggedIn: boolean, isAdmin?: boolean) => void;
}

type AuthStore = AuthStoreState & AuthStoreActions;

const useAuth = create<AuthStore>((set) => ({
  isLoading: true,
  isLoggedIn: false,
  isAdmin: false,
  setLoggedIn: (loggedIn: boolean, isAdmin?: boolean) => {
    if (!loggedIn) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }

    set({
      isLoading: false,
      isLoggedIn: loggedIn,
      isAdmin: isAdmin ?? false,
    });
  },
}));

export default useAuth;
