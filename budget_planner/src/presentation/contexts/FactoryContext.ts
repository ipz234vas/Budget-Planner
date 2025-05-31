import { createContext } from "react";
import { RepositoryFactory } from "../../data/repositories/RepositoryFactory";

export const FactoryContext = createContext<RepositoryFactory | null>(null);
