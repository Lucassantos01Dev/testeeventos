async function carregarEventosDaPlanilha() {
    const eventosDiv = document.getElementById("eventos");
    eventosDiv.innerHTML = "<p>Carregando eventos...</p>";

    try {
        const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vThJFYlU0KduwGTipk0Wk_CILMrQsziQXsznN6Fuk07cDV2lFpJ9LA1-0q3_OrV0QcjhreXNaXWROWN/pub?output=csv');

        if (!response.ok) {
            throw new Error(`Erro ao carregar a planilha: ${response.statusText}`);
        }

        const data = await response.text();
        const linhas = data.split("\n").slice(1); 
        eventosDiv.innerHTML = ""; 

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); 


        linhas.forEach(linha => {
            const colunas = linha.split(",");

            // Assegura que a linha tem colunas suficientes e evita linhas vazias
            if (colunas.length >= 8 && colunas[1].trim() !== '') {
                const nomeEvento = colunas[1].trim();
                const dataEventoStr = colunas[2].trim();
                const horario = colunas[3].trim();
                const local = colunas[4].trim();
                const descricao = colunas[5].trim();
                const contato = colunas[6].trim();
                const linkImagem = colunas[7].trim(); 

                let dataDoEvento = null;
                const partesData = dataEventoStr.split('/');
                if (partesData.length === 3) {
                    // Assume DD/MM/AAAA (dia/mês/ano)
                    dataDoEvento = new Date(parseInt(partesData[2]), parseInt(partesData[1]) - 1, parseInt(partesData[0]));
                } else {
                    // Tenta parsear diretamente (pode ser MM/DD/AAAA ou outro formato)
                    dataDoEvento = new Date(dataEventoStr);
                }

                // Verifica se a data é válida e se o evento é futuro ou no dia de hoje
                if (dataDoEvento instanceof Date && !isNaN(dataDoEvento) && dataDoEvento.getTime() >= hoje.getTime()) {
                    const el = document.createElement("div");
                    el.className = "event";
                    el.innerHTML = `
                        ${linkImagem ? `<img src="${linkImagem}" alt="Imagem do evento" class="event-image">` : ''}
                        <h3>${nomeEvento}</h3>
                        <p><strong>Data:</strong> ${dataEventoStr}</p>
                        <p><strong>Horário:</strong> ${horario}</p>
                        <p><strong>Local:</strong> ${local}</p>
                        <p><strong>Descrição:</strong> ${descricao}</p>
                        <p><strong>Contato:</strong> ${contato}</p>
                    `;
                    eventosDiv.appendChild(el);
                    eventosEncontrados = true;
                }
            }
        });

        if (!eventosEncontrados) {
            eventosDiv.innerHTML = "<p>Nenhum evento futuro encontrado no momento. Volte em breve!</p>";
        }

    } catch (error) {
        console.error("Erro ao carregar ou processar eventos:", error);
        eventosDiv.innerHTML = "<p>Ocorreu um erro ao carregar os eventos. Por favor, tente novamente mais tarde.</p>";
    }
}

carregarEventosDaPlanilha();