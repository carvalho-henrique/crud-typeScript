import { Ingualavel } from "./Igualavel";
import { Imprimivel } from "./Imprimivel";

export interface MeuObjeto<T> extends Imprimivel, Ingualavel<T> {

}