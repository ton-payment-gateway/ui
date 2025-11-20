import { create } from "zustand";

interface AuthStoreState {
  isLoading: boolean;
  isLoggedIn: boolean;
}

interface AuthStoreActions {
  setLoggedIn: (loggedIn: boolean) => void;
}

type AuthStore = AuthStoreState & AuthStoreActions;

const useAuth = create<AuthStore>((set) => ({
  isLoading: true,
  isLoggedIn: false,
  setLoggedIn: (loggedIn: boolean) => {
    if (!loggedIn) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }

    set({
      isLoading: false,
      isLoggedIn: loggedIn,
    });
  },
}));

export default useAuth;
