import { createContext } from "react";
export const initialStore = {
  contacts: [],
  selectedContact: null
};


const StoreContext = createContext();

export default StoreContext;