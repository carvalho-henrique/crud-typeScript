import { Negociacao, NegociacaoParcial } from "../models/index"

export class NegociacaoService {

    async obterNegociacoes(handler: HandleFunction): Promise<Negociacao[]> {

        return await <Promise<Negociacao[]>>fetch('http://localhost:8080/dados')
        .then(res => handler(res))
        .then(res => res.json())
        .then((data: NegociacaoParcial[]) => 
            data
                .map(val => new Negociacao(new Date(), val.vezes, val.montante))
        )
        .catch(err => {
            console.log(err)
            throw new Error('Não foi possível importar as negociações')
        })  
    }
}

export interface HandleFunction {
    (res: Response): Response
}