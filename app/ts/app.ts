import { NegociacaoController } from "./controllers/NegociacaoController"

const controller = new NegociacaoController()

$('.form').submit(controller.adiciona.bind(controller))
$('#botaoImporta').click(controller.importaDados.bind(controller))