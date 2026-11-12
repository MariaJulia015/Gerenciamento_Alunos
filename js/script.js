class Aluno {
    constructor(nome, idade, curso, notaFinal) {
        this.nome = nome;
        this.idade = idade;
        this.curso = curso;
        this.notaFinal = notaFinal;
    }

    //true se a nota final for >= 7
    isAprovado() {
        return this.notaFinal >= 7;
    }

    // Retorna dados do aluno formatados
    toString() {
        return `Nome: ${this.nome} | Idade: ${this.idade} | Curso: ${this.curso} | Nota Final: ${this.notaFinal} | ${this.isAprovado() ? "Aprovado" : "Reprovado"}`;
    }
}


class AlunoController {
    constructor() {
        this.alunos = [];
        this.indiceEdicao = null; 
        this.init();
    }

    init() {
        document.getElementById("formAluno").addEventListener("submit", function (event) {
            controller.salvar(event);
        });

        document.getElementById("btnCancelar").addEventListener("click", () => this.limparFormulario());

        document.getElementById("btnAprovados").addEventListener("click", () => this.relatorioAprovados());
        document.getElementById("btnMediaNotas").addEventListener("click", () => this.relatorioMediaNotas());
        document.getElementById("btnMediaIdades").addEventListener("click", () => this.relatorioMediaIdades());
        document.getElementById("btnOrdemAlfabetica").addEventListener("click", () => this.relatorioOrdemAlfabetica());
        document.getElementById("btnPorCurso").addEventListener("click", () => this.relatorioPorCurso());
    }

    
    salvar(event) {
        event.preventDefault(); 

        let nome = document.getElementById("nome").value.trim();
        let idade = Number(document.getElementById("idade").value);
        let curso = document.getElementById("curso").value;
        let notaFinal = Number(document.getElementById("notaFinal").value);

        if (this.indiceEdicao === null) {
            const aluno = new Aluno(nome, idade, curso, notaFinal);
            this.alunos.push(aluno);
            alert("Aluno cadastrado com sucesso!");
            console.log("Aluno salvo:", aluno.toString());
        } else {
            const aluno = this.alunos[this.indiceEdicao];
            aluno.nome = nome;
            aluno.idade = idade;
            aluno.curso = curso;
            aluno.notaFinal = notaFinal;
            alert("Aluno editado com sucesso!");
            console.log("Aluno editado:", aluno.toString());
        }

        this.atualizarTabela();
        this.limparFormulario();
    }

    editar(index) {
        const aluno = this.alunos[index];
        document.getElementById("nome").value = aluno.nome;
        document.getElementById("idade").value = aluno.idade;
        document.getElementById("curso").value = aluno.curso;
        document.getElementById("notaFinal").value = aluno.notaFinal;

        this.indiceEdicao = index;
        document.getElementById("btnCadastrar").value = "Salvar alteração";
        console.log("Editando aluno:", aluno.toString());
    }

    excluir(index) {
        const aluno = this.alunos[index];
        if (confirm(`Deseja excluir o aluno ${aluno.nome}?`)) {
            this.alunos = this.alunos.filter((a, i) => i !== index); 
            alert("Aluno excluído com sucesso!");
            console.log("Aluno excluído:", aluno.toString());
            this.limparFormulario();
            this.atualizarTabela();
        }
    }

    atualizarTabela() {
        const tabela = document.getElementById("tabelaAlunos");
        tabela.innerHTML = ""; // limpa a tabela

        this.alunos.forEach((aluno, index) => {
            const linha = tabela.insertRow();

            linha.insertCell(0).innerText = index + 1;
            linha.insertCell(1).innerText = aluno.nome;
            linha.insertCell(2).innerText = aluno.idade;
            linha.insertCell(3).innerText = aluno.curso;
            linha.insertCell(4).innerText = aluno.notaFinal;
            linha.insertCell(5).innerText = aluno.isAprovado() ? "Aprovado" : "Reprovado";

            
            const btnEditar = document.createElement("button");
            btnEditar.innerText = "Editar";
            btnEditar.type = "button";
            btnEditar.className = "btn btn-sm btn-primary me-1";

            const btnExcluir = document.createElement("button");
            btnExcluir.innerText = "Excluir";
            btnExcluir.type = "button";
            btnExcluir.className = "btn btn-sm btn-danger";

            const actionCell = linha.insertCell(6);
            actionCell.appendChild(btnEditar);
            actionCell.appendChild(btnExcluir);

            btnEditar.addEventListener("click", (event) => this.editar(index));
            btnExcluir.addEventListener("click", (event) => this.excluir(index));
        });
    }

    limparFormulario() {
        document.getElementById("formAluno").reset();
        this.indiceEdicao = null;
        document.getElementById("btnCadastrar").value = "Cadastrar";
    }

    exibirRelatorio(titulo, conteudo) {
        document.getElementById("resultadoRelatorio").innerHTML = `<b>${titulo}</b><br>${conteudo}`;
    }

    relatorioAprovados() {
        const aprovados = this.alunos
            .filter(aluno => aluno.isAprovado())
            .map(aluno => `${aluno.nome} (nota ${aluno.notaFinal})`);

        this.exibirRelatorio("Alunos aprovados (nota final >= 7):",
            aprovados.length ? aprovados.join("<br>") : "Nenhum aluno aprovado.");
    }

    relatorioMediaNotas() {
        if (this.alunos.length === 0) return this.exibirRelatorio("Média das notas finais:", "Nenhum aluno cadastrado.");
        const soma = this.alunos.reduce((total, aluno) => total + aluno.notaFinal, 0);
        const media = soma / this.alunos.length;
        this.exibirRelatorio("Média das notas finais:", media.toFixed(2));
    }

    relatorioMediaIdades() {
        if (this.alunos.length === 0) return this.exibirRelatorio("Média das idades:", "Nenhum aluno cadastrado.");
        const soma = this.alunos.reduce((total, aluno) => total + aluno.idade, 0);
        const media = soma / this.alunos.length;
        this.exibirRelatorio("Média das idades:", media.toFixed(1) + " anos");
    }

    relatorioOrdemAlfabetica() {
        const nomes = this.alunos
            .map(aluno => aluno.nome)
            .sort((a, b) => a.localeCompare(b));

        this.exibirRelatorio("Nomes em ordem alfabética:",
            nomes.length ? nomes.join("<br>") : "Nenhum aluno cadastrado.");
    }

    relatorioPorCurso() {
        const quantidade = {};
        this.alunos.forEach(aluno => {
            quantidade[aluno.curso] = (quantidade[aluno.curso] || 0) + 1;
        });

        const linhas = Object.keys(quantidade).map(curso => `${curso}: ${quantidade[curso]} aluno(s)`);
        this.exibirRelatorio("Quantidade de alunos por curso:",
            linhas.length ? linhas.join("<br>") : "Nenhum aluno cadastrado.");
    }
}
const controller = new AlunoController();
