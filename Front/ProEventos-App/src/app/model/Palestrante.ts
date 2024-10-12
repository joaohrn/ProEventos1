import { UserUpdate } from './Identity/UserUpdate';
import { PalestranteEvento } from './PalestranteEvento';
import { RedeSocial } from './RedeSocial';

export interface Palestrante {
	id: number;
	miniCurriculo: string;
	user: UserUpdate;
	redesSociais: RedeSocial[];
	palestrantesEventos: PalestranteEvento[];
}
