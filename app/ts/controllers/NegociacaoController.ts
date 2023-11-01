import { NegociacoesView, MensagemView } from "../views/index"
import { Negociacao, NegociacaoParcial, Negociacoes } from "../models/index"
import { domInject, logarTempoDeExecucao, throttle } from "../helpers/decorators/index"
import { NegociacaoService } from "../service/index"
import { imprime } from "../helpers/index"

export class NegociacaoController {

    @domInject('#data')
    private _inputData: JQuery

    @domInject('#quantidade')
    private _inputQuantidade: JQuery

    @domInject('#valor')
    private _inputValor: JQuery

    private _negociacoes = new Negociacoes()
    private _negociacoesView = new NegociacoesView('#negociacoesView')
    private _mensagemView = new MensagemView('#mensagemView')

    private _service = new NegociacaoService()

    constructor() {
        this._negociacoesView.update(this._negociacoes)
    }

    private _ehDiaUtil(data: Date){
        enum diaDaSemana {
            domingo,
            segunda,
            terca,
            quarta,
            quinta,
            sexta,
            sabado
        }
        return data.getDay() == diaDaSemana.domingo || data.getDay() == diaDaSemana.sabado
    }

    @throttle()
    adiciona(event: Event){

        let data = new Date((this._inputData.val() as string).replace(/-/g, ','))
        if(this._ehDiaUtil(data)){
            this._mensagemView.update('Somente negociações em dia úteis, por favor')
            return
        }

        const negociacao = new Negociacao(
            new Date((this._inputData.val() as string).replace(/-/g, ',')),
            parseInt((this._inputQuantidade.val() as string)),
            parseFloat((this._inputValor.val() as string))
        )

        imprime(negociacao)

        this._negociacoes.adiciona(negociacao)

        this._negociacoes.paraArray().length = 0

        this._negociacoes.paraArray().forEach(negociacao => {
            this._negociacoesView.update(this._negociacoes)
            this._mensagemView.update('Negociação adicionada com sucesso!')
        })
    }

    @throttle()
    async importaDados() {
        try {
            const negociacoesParaImportar = await this._service
            .obterNegociacoes(res => {
                if(res.ok){
                    return res
                } else {
                    throw new Error(res.statusText)
                }
            })

            const negociacoesJaImportadas = this._negociacoes.paraArray()

            negociacoesParaImportar.filter(negociacao => !negociacoesJaImportadas.some(jaImportada => negociacao.ehIgual(jaImportada)))
            .forEach(Negociacao => 
                this._negociacoes.adiciona(Negociacao))
            
            this._negociacoesView.update(this._negociacoes)    
        } catch (error) {
            this._mensagemView.update(error.message)
        }
    }
}