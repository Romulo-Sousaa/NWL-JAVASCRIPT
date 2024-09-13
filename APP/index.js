const { select, input, checkbox, filter } = require('@inquirer/prompts') //isso devolverá um objeto

let mensagem = "Bem vindo ao app de Metas";

let meta = {
    value: 'Tomar 3L de água por dia',
    checked: false,

}

let metas = [meta];

const cadastrarMeta = async () => {
    const meta = await input({message: "Digite a meta:"});

    if(meta.length == 0) {
        mensagem = "A meta não pode ser vazia";
        return;
    }

    metas.push( //o método push adiciona valores ao array metas
        {value: meta, checked: false}
    )

    mensagem = "Meta cadastrada com sucesso!"
}

const listarMetas = async () => {
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o enter para finalizar essa etapa",
        choices: [...metas], //fazendo uma cópia de metas para armazenar na variável respostas - spread operator
        instructions: false
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0) {
        mensagem = "Nenhuma meta selecionada!";
        return;
    }

    respostas.forEach((resposta) => { //forEach = para cada meta
        const meta = metas.find(m => {
            return m.value == resposta;
        })

        meta.checked = true;
    })

    mensagem = 'Meta(s) marcada(s) como concluída(s)';
}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked;
    })

    if(realizadas.length == 0) {
        mensagem = 'Não existem metas realizadas! :(';
        return;
    }

    await select({
        message: "Metas Realizadas: " + realizadas.length,
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => {
        return meta.checked != true;  //água [] - cantar [] - correr [x] | águe e cantar não estam marcadas, são diferente de true, condição correspondida, entra em abertas; correr está marcada, igual a true, condição não correspondida, não entra em abertas
    })

    if(abertas.length == 0) {
        mensagem = "Não existe metas abertas! :)"
        return;
    }

    await select({
        message: "Metas abertas: " + abertas.length,
        choices: [...abertas]
    })
}

const removerMetas = async () => {
    const metasDesmarcadas = metas.map((meta) => {
        return {value: meta.value, checked: false}
    })
    const itensADeletar = await checkbox({
        message: "Selecione item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false
    }) 

    if(itensADeletar.length == 0) {
        mensagem = "Nenhum item para deletar!";
        return;
    }

    itensADeletar.forEach((item) => {
        metas = metas.filter(() => {
            return meta.value != item;
        })
    })

    mensagem = "Meta(s) deleta(s) com sucesso!";

}

const mostrarMensagem = () => {
    console.clear();

    if(mensagem != "") {
        console.log(mensagem);
        console.log("");
        mensagem = "";
    }
}

const start = async () => {
   
    while(true) {
        mostrarMensagem();

        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Remover metas",
                    value: "remover"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })

        switch(opcao) {
            case "cadastrar":
                await cadastrarMeta();
                break
            case "listar":
                await listarMetas();
                break
            case "realizadas":
                await metasRealizadas();
                break
            case "abertas":
                await metasAbertas();
                break
            case "remover":
                await removerMetas();
                break
            case "sair":
                console.log("Até a próxima");
                return;
        }
    }
}

start()