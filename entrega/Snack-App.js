// Snack - Pense Bem Mickey Viagem no Tempo - 150 questões
import React,{useReducer,useState,useRef,useEffect,useCallback} from 'react';
import {View,Text,StyleSheet,ScrollView,Pressable,Image,Modal,StatusBar,Platform,Animated,Easing,AccessibilityInfo,useWindowDimensions} from 'react-native';

// ----- content.js -----
// Questões adaptadas das páginas do livro Disney - Viagem no Tempo (1991).
// IMPORTANTE: o gabarito NÃO é oficial. Verifique as 150 respostas antes de entregar.
const rows = [
  [1, 'Como se chama o período apresentado no livro entre aproximadamente 500.000 e 4.000 a.C.?', ['Idade Média','Anos Dourados','Pré-História','Pós-Moderno'], 'C'],
  [2, 'Complete a referência de tempo usada na página: 500.000 a 4.000 anos…', ['bissextos','lunares','depois da Chuva','antes de Cristo'], 'D'],
  [3, 'Em quais lugares podem ser encontrados vestígios da Pré-História?', ['laboratórios','camadas','mesas','cavernas'], 'D'],
  [4, 'Além de armas e desenhos, que vestígios ajudam a reconstruir a Pré-História?', ['disquetes','instrumentos','fotocópias','romances'], 'B'],
  [5, 'Qual é o primeiro dos dois grandes períodos da Pré-História citados no livro?', ['Paleolítico','Político','Paleocrítico','Posterior'], 'A'],
  [6, 'Qual é o segundo desses períodos?', ['Neolítico','Neologístico','Anterior','Neonovo'], 'A'],
  [7, 'Qual denominação completa a cruzada sobre os grandes animais da Pré-História?', ['Elefantes','Sequóias','Planárias','Dinossauros'], 'D'],
  [8, 'Qual dinossauro o livro apresenta como o maior que já existiu?', ['Ornitorrinco','Bisontossauro','Brontossauro','Lagartossauro'], 'C'],
  [9, 'Qual animal o livro apresenta como o maior carnívoro dessa época?', ['Mastodonte','Tiranossauro','Ditadorsauro','Orcassauro'], 'B'],
  [10, 'Qual é o réptil voador indicado na cruzada?', ['Ictiossauro','Hienodonte','Arquelônio','Pteranodonte'], 'D'],
  [11, 'Qual herbívoro completa a pista do livro sobre um dinossauro perigoso?', ['Tricerátops','Protozoário','Tetragunstops','Saladófobo'], 'A'],
  [12, 'Como se chamam os restos petrificados desses animais?', ['Fósseis','Tácteis','Vestígios','Vítreos'], 'A'],
  [13, 'Em qual período o livro situa o surgimento do Homo sapiens?', ['Mesolítico Superior','Patetolítico Médio','Neolítico Antigo','Paleolítico Inferior'], 'D'],
  [14, 'Como também é conhecido o Paleolítico?', ['Idade dos Metais Lisos','Idade da Pedra Quebrada','Idade da Pedra Lascada','Idade dos Metais Porosos'], 'C'],
  [15, 'Como também é conhecido o Neolítico?', ['Idade da Pedra Pintada','Idade da Pedra Polida','Idade da Pedra Quadrada','Idade da Pedra-Pomes'], 'B'],
  [16, 'Qual marco convencional separa a Pré-História da História?', ['A invenção da roda','A passagem do cometa Halley','O surgimento da escrita','A invenção do fogo'], 'C'],
  [17, 'Qual espécie corresponde à resposta esperada pela formulação antiga do livro sobre o “homem-macaco mais antigo”?', ['Borealpithecus germanicus','Australopithecus nordicus','Australopithecus africanus','Borealpithecus indicus'], 'C'],
  [18, 'Quais instituições se desenvolveram no Neolítico, segundo o exercício?', ['Artísticas, críticas e colegiais','Familiares, religiosas e políticas','Médicas, hospitalares e sociais','Esportivas, sindicais e paranormais'], 'B'],
  [19, 'Qual descoberta importante o livro situa no Paleolítico Inferior?', ['Rádio','Clipe','Carro','Fogo'], 'D'],
  [20, 'Ao perceber que o barro endurecia perto do fogo, o ser humano passou a produzir o quê?', ['Cerâmica','Jangadas','Cristais','Muros'], 'A'],
  [21, 'Que outro material foi descoberto na Pré-História?', ['Borracha','Metal','Papelão','Cola'], 'B'],
  [22, 'Qual metal aparece entre as alternativas desse exercício?', ['Bronze','Aço','Platina','Alumínio'], 'A'],
  [23, 'Qual outra descoberta importante desse período é citada?', ['Lâmpada','Roda','Bicicleta','Locomotiva'], 'B'],
  [24, 'Como eram chamados os grupos que não se fixavam em um lugar?', ['Sedentos','Andarilhos','Viajantes','Nômades'], 'D'],
  [25, 'Como se chama a pintura feita nas paredes das cavernas?', ['Pintura rupestre','Pintura abstrata','Pintura pós-moderna','Pintura pré-helênica'], 'A'],
  [26, 'O que era representado nessas pinturas, conforme o exercício?', ['Corridas de cavalos','Letras de músicas','Capturas de animais selvagens','Jogos infantis'], 'C'],
  [27, 'Onde ficam as pinturas rupestres destacadas pelo livro?', ['Altamira (Espanha) e Lascaux (França)','Ilhas Galápagos (Equador)','Museu de Arte Moderna (São Paulo)','Stonehenge (Inglaterra)'], 'A'],
  [28, 'Quais atividades surgem com a vida em grupo, segundo o exercício?', ['Técnicos e esportistas','Babás e professores','Caçadores, artistas e artesãos','Músicos, cozinheiros e poetas'], 'C'],
  [29, 'Que atividade começa com o conhecimento da reprodução dos vegetais?', ['Vida rural','Biologia','Agricultura','Quitanda'], 'C'],
  [30, 'Onde vivia o homem primitivo depois que saiu das cavernas, segundo o livro?', ['Apartamentos','Palafitas','Choupanas','Sobrados'], '?'],
  [31, 'Qual antigo nome da China aparece no exercício?', ['Formosa','Liu','Chiang','Catai'], 'D'],
  [32, 'Às margens de qual rio o livro situa o desenvolvimento da antiga civilização chinesa?', ['Ti-Etê','Mi-Souri','Da-Núbio','Azul'], '?'],
  [33, 'Em qual atividade os chineses já eram excelentes, segundo a página?', ['Pasteleiros','Ciclistas','Malabaristas','Agricultores'], 'D'],
  [34, 'Qual animal era criado para a tecelagem?', ['Pavão-real','Bicho-da-seda','Porco-espinho','Bicho-papão'], 'B'],
  [35, 'Qual conjunto reúne invenções chinesas?', ['Pólvora, canhão, jipe','Pastel, chá, bicicleta','Bússola, chiclete, pingue-pongue','Pólvora, bússola, seda, papel'], 'D'],
  [36, 'Segundo a afirmação do livro, o que teria sido usado contra a varíola em 1200 a.C.?', ['Vacina','Orações','Chás','Mágicas'], '?'],
  [37, 'Como o exercício denomina os habitantes daquela época?', ['Lapões','Mongóis','Francos','Sioux'], '?'],
  [38, 'Qual obra chinesa o livro associa ao século III a.C.?', ['A Grande Muralha','A Casa Amarela','O Canal de Suez','A Via Vêneto'], 'A'],
  [39, 'Para que foi erguida a Grande Muralha?', ['Promover o turismo','Impedir a invasão de nômades','Evitar a evasão de rendas','Conter a explosão populacional'], 'B'],
  [40, 'Qual extensão da Grande Muralha é esperada nesta edição do livro?', ['1,5 km','300 km','12.186 m','3.000 km'], '?'],
  [41, 'Com que nome ficou conhecido o guerreiro mongol Temugin?', ['Gengis Khan','João Chang','Mário Antônio','Josef Mao'], 'A'],
  [42, 'Qual significado de Gengis Khan corresponde ao exercício?', ['O Lindão','Muito temido','O mais poderoso dos soberanos','O imperador dos temidos'], 'C'],
  [43, 'Quais limites do império de Gengis Khan são indicados pelo livro?', ['Da China à Rússia','De Portugal à Itália','Do Polo Norte ao Polo Sul','Da Índia ao Paquistão'], 'A'],
  [44, 'Para que serve uma estação orbital?', ['Lazer e cultura','Fazer altos voos','Realizar pesquisas','Estudos paranormais'], 'C'],
  [45, 'Quais pesquisas são citadas para essas estações?', ['O efeito estufa nas estrelas fora do sistema solar','Novas fontes de água mineral nos planetas externos','Condições de vida no vácuo; novas fontes de energia','As rachaduras da camada de ozônio na Lua'], 'C'],
  [46, 'Qual alternativa apresenta estações orbitais reais citadas na edição?', ['Salyut (soviética) e Skylab (americana)','Guadalajara (mexicana) e Carnaval (brasileira)','Mirage (francesa) e Mir (soviética)','Challenger (americana) e Ferrari (italiana)'], 'A'],
  [47, 'Qual estação orbital planejada é mencionada pelo livro?', ['Freedom','Esperança','Esplanada','Vitória'], 'A'],
  [48, 'Quais participantes do projeto Freedom são listados no exercício?', ['URSS e EUA','EUA, Canadá, Japão e Comunidade Europeia (menos Inglaterra)','Argentina, Bolívia, Chile, México e Brasil','Gabão, Hong Kong, Filipinas, Liechtenstein e Kiribati'], 'B'],
  [49, 'Quais materiais o livro indica para a construção da Freedom?', ['Fibra de carbono e epóxi','Cristal e fibra de alumínio','Isopor e polipropileno','Fibra de vidro e boro'], '?'],
  [50, 'Além de pesquisas, que função o livro previa para a Freedom?', ['Melhorar as telecomunicações interestelares','Contato com extraterrestres do sétimo grau','Realizar novos lançamentos de discos e fitas','Reabastecer e auxiliar satélites e foguetes'], 'D'],
  [51, 'Marte é conhecido como o planeta de qual cor?', ['Amarelo','Vermelho','Azul','Prateado'], 'B'],
  [52, 'Quais povos a carta associa ao deus da guerra e do poder?', ['Gregos e troianos','Gregos e romanos','Egípcios e romanos','Egípcios e troianos'], 'B'],
  [53, 'Quais naves 1 e 2 enviaram informações sobre Marte a partir de 1976?', ['Drakkar','Viking','Caravela','Nautilus'], 'B'],
  [54, 'O que as naves teriam comprovado no solo de Marte, segundo a carta?', ['Lama','Cristais de vidro','Cristais de água','Hidrogênio'], '?'],
  [55, 'O que Marte tem em comum com a Terra na sequência primavera, verão, outono e inverno?', ['Estações solares','Polos centrais','Florestas tropicais','Estações do ano'], 'D'],
  [56, 'Qual sonho sobre Marte encerra a carta do livro?', ['Dividir','Destruir','Colonizar','Sujar'], 'C'],
  [57, 'Qual peça completa o espaço 57? Observe a ilustração.', ['Peça A','Peça B','Peça C','Peça D'], 'D', true],
  [58, 'Qual peça completa o espaço 58? Observe a ilustração.', ['Peça B','Peça A','Peça D','Peça C'], 'D', true],
  [59, 'Qual peça completa o espaço 59? Observe a ilustração.', ['Peça D','Peça C','Peça B','Peça A'], 'D', true],
  [60, 'Qual peça completa o espaço 60? Observe a ilustração.', ['Peça B','Peça D','Peça C','Peça A'], 'A', true],
  [61, 'Como ficou conhecido o desenvolvimento industrial inglês iniciado por volta de 1760?', ['Revolução Tecnológica','Revolução Eletrônica','Revolução Industrial','Revolução Mecânica'], 'C'],
  [62, 'Além das fábricas e da aplicação de energia, qual característica o exercício destaca?', ['O progresso tecnológico','O uso do computador','O movimento sindical','O relógio de ponto'], '?'],
  [63, 'Qual setor atingiu grande progresso primeiro, segundo o livro?', ['Tecelagem','Siderurgia','Computação','Imprensa'], 'A'],
  [64, 'O que contribuiu para escoar a produção inglesa, segundo o exercício?', ['O aeroporto de Londres','A supremacia marítima','O trem de carga','O ralo profundo'], '?'],
  [65, 'Qual trabalhador ganha destaque com a Revolução Industrial?', ['Filósofo','Milionário','Operário','Historiador'], 'C'],
  [66, 'Qual fonte de riqueza anterior à industrialização é destacada pelo livro?', ['Agricultura','Puericultura','Pecuária','Escultura'], 'A'],
  [67, 'Quem é associado à máquina de fiar de 1764?', ['James Hargreaves','James Dean','James Stewart','James Cagney'], 'A'],
  [68, 'Quem é associado à máquina a vapor na página?', ['Bob Watson','James Watt','Bob East','James Watson'], 'B'],
  [69, 'Quem é associado ao barco a vapor de 1803?', ['Robert Fulton','John Newton','Robert Redford','Mark Davis'], 'A'],
  [70, 'Quem é associado à locomotiva a vapor de 1814?', ['George Harrison','Harrison Ford','Hamilton John','George Stephenson'], 'D'],
  [71, 'Quem é associado ao tear hidráulico na página?', ['Richard Wagner','Richard Arkwright','Benjamin Franklin','Thomas Edison'], 'B'],
  [72, 'Quem o livro associa à fabricação do aço em 1784?', ['Jesse James','Henry Cort','Búfalo Bill','Jonny Yuma'], 'B'],
  [73, 'Quem o livro associa ao “tear mecânico (1722)”?', ['Clay McDonald','John Kay','Hudson River','Jambalaia Kid'], '?'],
  [74, 'Segundo a tradição citada, quais gêmeos fundaram Roma?', ['Rêmulo e Romo','Romo e Remo','Rômulo e Remo','Rêmulo e Rômulo'], 'C'],
  [75, 'Como se chamavam os combatentes das lutas citadas pelo livro?', ['Escravos','Operários','Jogadores','Gladiadores'], 'D'],
  [76, 'Como o livro descreve o desfecho dessas lutas?', ['Um caísse morto','Um jogasse a toalha','Um pedisse água','Um machucasse o ombro'], 'A'],
  [77, 'A quais corridas os romanos assistiam?', ['Charretes','Carruagens','Triciclos','Bigas'], 'D'],
  [78, 'O que as cidades do Império pagavam a Roma?', ['Duplicatas','Impostos','Contas','Faturas'], 'B'],
  [79, 'Qual deus romano, associado a Zeus, era o soberano dos deuses?', ['Júpiter','Minerva','Juno','Baco'], 'A'],
  [80, 'Identifique a frase verdadeira sobre a organização romana.', ['O Império Romano caracterizou-se somente pelas estradas.','Roma foi feita num dia.','Marco Antônio disse: “Veni, vidi, vinci”.','O Império Romano caracterizou-se pela eficiência de sua organização bélica e administrativa.'], 'D'],
  [81, 'Identifique a frase verdadeira sobre a engenharia romana.', ['Os romanos chamavam os gregos para construir seus edifícios.','Os romanos possuíam uma engenharia altamente desenvolvida.','A sociedade romana se dividia entre burgueses e nobreza.','A tradicional hotelaria romana incentivava o turismo.'], 'B'],
  [82, 'Qual afirmação sobre o Direito romano corresponde ao exercício?', ['Pregava a igualdade entre nobres e plebeus.','É a base do moderno sistema judiciário.','Criou o sistema de rodízio carcerário.','O maior juiz de Direito de Roma foi Nero.'], 'B'],
  [83, 'Identifique a frase esperada no exercício sobre arquitetura romana.', ['O maior filósofo romano foi Aristóteles.','A arquitetura romana não sofreu nenhuma influência.','Para construir edifícios eles usavam bate-estacas.','A arquitetura romana se destacou pela precisão, método e realismo.'], '?'],
  [84, 'Qual afirmação sobre a cultura romana corresponde ao exercício?', ['Manifestou-se sobretudo na filosofia.','Os romanos foram célebres cientistas.','A cultura romana era bastante desenvolvida.','O maior expoente da cultura romana foi Arquimedes.'], 'C'],
  [85, 'Qual afirmação sobre a pintura romana corresponde ao exercício?', ['Os afrescos nas paredes representavam a arte rupestre.','Começou nessa época a construção da Catedral de Milão.','A pintura mural predominava nas paredes das casas romanas.','O grande retrato da época foi a Mona Lisa, de Da Vinci.'], 'C'],
  [86, 'Como se chamavam as construções com arena central para lutas de gladiadores?', ['Arquibancadas','Ginásios','Anfiteatros','Estádios'], 'C'],
  [87, 'Como se chamavam os caminhos pavimentados construídos pelos romanos?', ['Vielas','Estradas','Becos','Calçadas'], 'B'],
  [88, 'Quais sistemas conduziam água por estruturas com arcos?', ['Aquedutos','Canos','Gasômetros','Oleodutos'], 'A'],
  [89, 'Em quais espaços se realizavam as corridas de bigas?', ['Cinemas','Praças','Lojas','Circos'], 'D'],
  [90, 'Complete: … do Triunfo, monumentos comemorativos de vitórias.', ['Flechas','Arcos','Sinos','Viadutos'], 'B'],
  [91, 'A cultura inca pertence a qual conjunto de culturas?', ['Andinas','Europeias','Nômades','Tropicais'], 'A'],
  [92, 'Qual região montanhosa era dominada pelos incas?', ['Serra Pelada','Pico do Himalaia','Maciço Central','Cordilheira dos Andes'], 'D'],
  [93, 'Segundo o texto, seus domínios iam do Pacífico até o interior de qual região?', ['Bahia','Amazônia','Patagônia','Caatinga'], 'B'],
  [94, 'Onde ficava o centro do Império do Sol?', ['Bertioga','Cuzco','Las Leñas','Manaus'], 'B'],
  [95, 'Como era chamada a autoridade suprema e chefe guerreiro?', ['Prefeito','General','Príncipe','Inca'], 'D'],
  [96, 'O governante inca era considerado filho de quem?', ['Chefe','Senador','Sol','Milionário'], 'C'],
  [97, 'Por qual conselho o governante era assistido?', ['De nobres','De amigos','De padres','Federal'], 'A'],
  [98, 'Como se chamavam os registros incas com fios coloridos e nós?', ['Quipos','Tricôs','Ábacos','Macramês'], 'A'],
  [99, 'Quem mantinha o serviço de comunicação permanente dos incas, segundo o exercício?', ['Porteiros','Estafetas','Motoqueiros','Mensageiros'], '?'],
  [100, 'Como eram chamados por acreditar em vários deuses?', ['Politeístas','Crentes','Pastores','Ímpios'], 'A'],
  [101, 'Como eram chamados os governadores de províncias no texto?', ['Espertos','Marajás','Patrões','Curacas'], 'D'],
  [102, 'Qual técnica os incas conheciam, segundo a página?', ['Decocção do café','Mumificação de cadáveres','Dissecação de insetos','Centrifugação de sementes'], 'B'],
  [103, 'Para que aproveitavam as encostas das montanhas com irrigação?', ['Plantio de alimentos','Construir açudes','Praticar esqui','Provas de mountain bike'], 'A'],
  [104, 'Quais funções o soberano asteca acumulava?', ['Motorista, professor, advogado','Juiz, contador, médico','Gerente, farmacêutico, capitão','Sacerdote, juiz, chefe militar'], 'D'],
  [105, 'Que tipo de sacrifícios é mencionado no exercício sobre os astecas?', ['Aquáticos','Humanos','Lunáticos','Braçais'], 'B'],
  [106, 'Qual sistema era utilizado na agricultura asteca?', ['Colheita automática','Irrigação dos mangues','Dessalinização dos lagos','Irrigação do solo'], 'D'],
  [107, 'O que os astecas usavam como moeda?', ['Cheque','Feijões','Sal','Grãos de cacau'], 'D'],
  [108, 'Como o livro descreve a escrita asteca?', ['Cuneiforme e cursiva','Gótica e pictográfica','Pictórica e hieroglífica','Arábica e romana'], 'C'],
  [109, 'O que o exercício indica como anestésico usado pelos astecas?', ['Amoníaco','Éter','Extratos de plantas','Bordoadas'], 'C'],
  [110, 'Qual era a base da sociedade asteca, segundo a página?', ['Os animais','Os deuses','O rei','A família'], 'D'],
  [111, 'Qual nome o livro dá à escola onde os filhos dos nobres astecas estudavam?', ['Olimpo','Parlamento','Partenon','Camenac'], 'D'],
  [112, 'Qual nome o livro dá ao lugar de aprendizagem dos filhos dos pobres?', ['Tepuchcalli','Maternal','Corumbá','Primário'], 'A'],
  [113, 'Qual imperador asteca é destacado no exercício?', ['Montezuma','Monterrey','Montemor','Montepio'], 'A'],
  [114, 'Qual cidade antecedeu a Cidade do México?', ['Atahualpa','Athenas','Tenochtitlán','Atlântida'], 'C'],
  [115, 'Além dos templos piramidais, o que os astecas construíam?', ['Quitinetes','Viadutos','Metrôs','Diques'], 'D'],
  [116, 'Qual conquistador o livro associa à chegada ao México em 1519?', ['Roberto Carlos','Fernão Cortez','Fernão de Magalhães','Julio Iglesias'], 'B'],
  [117, 'Qual origem o exercício atribui à construção de número 117?', ['Apache','Asteca','Xavante','Esquimó'], 'B', true],
  [118, 'Qual origem o exercício atribui ao desenho de número 118?', ['Africano','Japonês','Croata','Inca'], 'D', true],
  [119, 'Qual é a origem do desenho de número 119?', ['Maia','Tolteca','Hindu','Egípcio'], 'D', true],
  [120, 'Qual origem o livro atribui ao desenho de número 120?', ['Grego','Romano','Sírio','Chinês'], '?', true],
  [121, 'O que é a figura A? A figura não está visível no arquivo disponível.', ['Triângulo','Pirâmide','Castelo','Estátua'], '?', true],
  [122, 'O que é a figura B? A figura não está visível no arquivo disponível.', ['Câmara da princesa','Quarto de dormir','Sala de jantar','Câmara do faraó'], '?', true],
  [123, 'O que é a figura C? A figura não está visível no arquivo disponível.', ['Sarcófago','Fargósaco','Sarfágoco','Gorsáfaco'], '?', true],
  [124, 'O que é a figura identificada com a letra D?', ['Fantasma','Múmia','Defunto','Boneco'], 'B', true],
  [125, 'O que é a figura E? A figura não está visível no arquivo disponível.', ['Letras cuneiformes','Ideogramas','Desenhinhos','Hieroglifos'], '?', true],
  [126, 'O que é a figura F? A figura não está visível no arquivo disponível.', ['Esfinge','Estátua','Monumento','Mausoléu'], '?', true],
  [127, 'Quem governava o Egito Antigo?', ['Presidente','Faraó','Ditador','Ministro'], 'B'],
  [128, 'O que os faraós eram considerados?', ['Mestres da Lua','Primos da Chuva','Filhos do Sol','Juízes das Disputas'], 'C'],
  [129, 'Quais são os nomes das pirâmides destacadas no exercício?', ['Quepes, Quefrio, Minguelinos','Quéops, Quefrei, Miguerinos','Quéops, Quéfren, Miquerinos','Quérops, Quéfren, Miguelinos'], 'C'],
  [130, 'Qual ciência egípcia é destacada pelo exercício?', ['Astronomia','Dermatologia','Zootecnia','Botânica'], 'A'],
  [131, 'Qual objeto foi fundamental para decifrar os hieroglifos?', ['Pedra da Rocinha','Pedra da Roseta','Pedra da Rosácea','Pedra da Rosinha'], 'B'],
  [132, 'Quem é associado à decifração desses hieroglifos?', ['Chateaubriand','Chamberlain','Champollion','Chambertain'], 'C'],
  [133, 'Quais contribuições matemáticas dos egípcios são citadas?', ['Fundamentos da trigonometria','Fundamentos da geometria e eletricidade','Fundamentos da aritmética e geometria','Fundamentos da teoria quântica'], 'C'],
  [134, 'Escolha a sequência que forma a frase sobre os principais deuses egípcios.', ['1, 4, 2, 14, 3, 6, 9, 12','1, 11, 2, 14, 11, 8, 10','1, 4, 3, 13, 14, 11, 8, 10','1, 4, 11, 2, 14, 3, 12, 9, 6'], 'D'],
  [135, 'Escolha a sequência que forma a frase sobre o uso das pirâmides.', ['1, 7, 8, 13, 15, 4, 11','1, 4, 5, 14, 10','1, 11, 8, 7, 15, 2, 4','1, 2, 7, 8, 10, 13, 15, 5'], 'D'],
  [136, 'Escolha a sequência que forma a frase sobre o rio Nilo.', ['1, 10, 9, 6, 14, 8, 11','1, 5, 10, 9, 14, 11','1, 3, 6, 5, 7, 12, 9, 1, 10','1, 14, 3, 6, 9, 7, 12'], 'C'],
  [137, 'Escolha a sequência esperada no exercício sobre a classe social egípcia.', ['2, 13, 9, 3, 4, 7, 12','2, 3, 4, 8, 11, 13, 9, 2, 15, 14','2, 4, 8, 13, 9, 7, 10','1, 14, 9, 3, 6, 5, 11'], 'B'],
  [138, 'Escolha a sequência que forma a frase sobre os hicsos e o cavalo.', ['3, 1, 13, 15, 4','3, 1, 9, 2, 12, 7, 5','7, 5, 15, 8, 6, 13','3, 1, 4, 5, 9, 2, 12'], 'B'],
  [139, 'Escolha a sequência que forma a segunda frase sobre os hicsos.', ['13, 6, 4, 8, 9, 7, 15','13, 6, 4, 8, 9, 7, 14, 10, 11','13, 6, 4, 8, 14, 10, 1','3, 5, 8, 6, 1, 4, 7, 8'], 'B'],
  [140, 'O que foi desenvolvido pela observação de fenômenos astronômicos?', ['Calendário','Marcador','Agenda','Folhinha'], 'A'],
  [141, 'Qual povo é citado pelo livro como pioneiro no calendário lunar?', ['Hippies','Astronautas','Babilônios','Lunáticos'], 'C'],
  [142, 'Qual calendário o livro associa aos egípcios?', ['Solar','Brilhante','Radiante','Aceso'], 'A'],
  [143, 'Qual calendário pré-colombiano é destacado pelo exercício?', ['Suíço','Japonês','Inglês','Maia'], 'D'],
  [144, 'Quais eram as três estações do ano egípcio citadas?', ['Esperanças, colheitas e cheias','Cheias, colheitas e grãos','Secas, sementes e cortes','Cheias, semeaduras e colheitas'], 'D'],
  [145, 'Qual calendário a tradição atribui a Rômulo?', ['Cósmico','Sagrado','Helíaco','Romano'], 'D'],
  [146, 'Complete: os … e os romanos adotaram a … para o início do dia.', ['Japoneses / temperatura','Poloneses / meia hora','Chineses / meia-noite','Mandarins / cronologia'], 'C'],
  [147, 'Identifique o instrumento de número 147 na ilustração.', ['Funil','Vidrinho','Conta-gotas','Ampulheta'], 'D', true],
  [148, 'Identifique o instrumento de número 148 na ilustração.', ['Relógio de som','Relógio de chuva','Relógio de sol','Relógio de nuvem'], 'C', true],
  [149, 'Identifique o instrumento de número 149 na ilustração.', ['Relógio de pêndulo','Vela','Despertador','Relógio de pulso'], 'A', true],
  [150, 'Identifique o instrumento de número 150 na ilustração.', ['Cripta','Clepsidra','Cidra','Quartzo'], 'B', true],
];

const wordTables = [
  ['os','egípcios','Osíris','principais','túmulos','Ra','usavam','as','e','grandes','deuses','Ísis','pirâmides','foram','como'],
  ['o','a','mais','alta','rio','importante','do','classe','é','Nilo','social','Egito','egípcia','sacerdotes','dos'],
  ['hicsos','no','os','também','cavalo','eles','o','que','introduziram','do','ferro','Egito','foram','uso','amarelo'],
];

// 18 hipóteses de correção, NENHUMA confirmada por gabarito oficial.
// Para a entrega, conferir no livro: especialmente 121-126 (figuras ausentes no scan).
const GABARITO_PROVISORIO = Object.freeze({
  30:'C',32:'D',36:'A',37:'B',40:'D',49:'A',54:'C',62:'A',64:'B',73:'B',83:'D',99:'B',120:'D',
  121:'B',122:'D',123:'A',125:'D',126:'A',
});
const QUESTOES_PROVISORIAS = Object.freeze(Object.keys(GABARITO_PROVISORIO).map(Number));

const CONTENT = Object.fromEntries(rows.map(([id, prompt, options, key, visual = false]) => [id, {
  id,
  prompt,
  options,
  answer: key === '?' ? GABARITO_PROVISORIO[id] : key,
  originalAnswer: key === '?' ? null : key,
  visual,
  context: id >= 134 && id <= 139 ? wordTables[Math.floor((id - 134) / 2)].map((word, index) => `${index + 1}: ${word}`).join(' · ') : null,
  answerStatus: key === '?' ? 'provisional' : 'interpreted',
  imageMissing: id >= 121 && id <= 126 && id !== 124,
}]));

// ----- data.js -----
const SECTIONS = [
  { code: '151', title: 'O elo perdido', pages: [[5,1,6,'O elo perdido'],[6,7,12,'Cruzadas de peso'],[7,13,18,'Você sabia?'],[8,19,24,'Descobertas'],[9,25,30,'Descobertas']] },
  { code: '152', title: 'Viagem pela história', pages: [[11,31,37,'Extremo Oriente'],[12,38,43,'Os maiores'],[13,44,50,'Voando alto'],[14,51,56,'Carta enigmática'],[15,57,60,'Quebra-cabeça']] },
  { code: '153', title: 'Inventos e civilizações', pages: [[17,61,66,'Revolução Industrial'],[18,67,73,'Inventos e inventores'],[19,74,79,'Roma antiga'],[20,80,85,'Técnica e cultura'],[21,86,90,'Mais cruzadas']] },
  { code: '154', title: 'Povos das Américas', pages: [[23,91,97,'Erro de cálculo'],[24,98,103,'Império Inca'],[25,104,110,'México'],[26,111,116,'Curiosidades'],[27,117,120,'Identifique']] },
  { code: '155', title: 'Civilização egípcia', pages: [[29,121,126,'Civilização egípcia'],[30,127,133,'Às margens do Nilo'],[31,134,139,'Forme as frases'],[32,140,146,'Mais informações'],[33,147,150,'O que é?']] },
];

const PROGRAMS = SECTIONS.map(({code,title,pages}) => ({
  code, title,
  questions: pages.flatMap(([page,first,last,topic]) =>
    Array.from({length:last-first+1},(_,i) => ({...CONTENT[first+i],page,printedPage:page-2,topic})))
}));
const TOTAL_QUESTOES = PROGRAMS.reduce((sum,p) => sum+p.questions.length,0);

// ----- engine.js -----
// Núcleo puro: independente de React Native. Máximo por programa: 90 pontos.
const LETTERS = Object.freeze(['A','B','C','D']);
const MAX_ATTEMPTS = 3;
const POINTS = Object.freeze({1:3, 2:2, 3:1});

function initialGame(program) {
  if (!program || !Array.isArray(program.questions) || program.questions.length !== 30) {
    throw new Error('Cada programa precisa ter exatamente 30 perguntas.');
  }
  return {
    program, index:0, attempts:[], score:0, provisionalScore:0,
    resolved:false, finished:false, history:[], feedback:'',
  };
}

function gameReducer(state, action) {
  if (action.type === 'START') return initialGame(action.program);
  if (!state || state.finished) return state;

  if (action.type === 'ANSWER') {
    const question = state.program.questions[state.index];
    if (state.resolved || !LETTERS.includes(action.choice) || state.attempts.includes(action.choice)) return state;
    if (!LETTERS.includes(question.answer)) return state;
    const attempts = [...state.attempts, action.choice];
    const correct = action.choice === question.answer;
    const resolved = correct || attempts.length === MAX_ATTEMPTS;
    const points = correct ? POINTS[attempts.length] : 0;
    const isProvisional = question.answerStatus === 'provisional';
    const entry = resolved ? {
      id:question.id,answer:question.answer,attempts,correct,points,
      answerStatus:question.answerStatus,
    } : null;
    return {
      ...state, attempts, resolved,
      score: state.score + points,
      provisionalScore:state.provisionalScore + (isProvisional ? points : 0),
      history:entry ? [...state.history,entry] : state.history,
      feedback:correct ? `Resposta registrada! +${points} ${points===1?'ponto':'pontos'}.`
        : resolved ? 'Três tentativas utilizadas. Nenhum ponto nesta pergunta.'
        : `Não foi essa. Restam ${MAX_ATTEMPTS - attempts.length} tentativas.`,
    };
  }

  if (action.type === 'NEXT' && state.resolved) {
    if (state.index === state.program.questions.length-1) return {...state,finished:true};
    return {...state,index:state.index+1,attempts:[],resolved:false,feedback:''};
  }
  return state;
}

function scoreSummary(game) {
  if (!game) return null;
  return {
    score:game.score,
    maxScore: game.program.questions.length*3,
    confirmedByOriginal:0, // Nunca declarar gabarito oficial sem a fonte original.
    provisionalPoints:game.provisionalScore,
    correct:game.history.filter(h=>h.correct).length,
    answered:game.history.length,
    reviewed:game.program.questions.filter(q=>q.answerStatus==='provisional').length,
  };
}

// ----- themes.js -----
// Imagens do próprio repositório original, mantidas por referência.
// `npm run recuperar:imagens` cria uma cópia local para preservar o acervo.
const ROOT='https://raw.githubusercontent.com/Guijasf/Trabalho_G2_Mickey_Viagem_no_tempo_Completo.github.io/main/pense-bem-mickey-viagem-no-tempo/assets/';
const DEFAULT_THEME={
  name:'Viagem no Tempo',mode:'Homem das cavernas',image:{uri:ROOT+'journey.png'},
  background:'#F8F6EE',surface:'#FFFFFF',ink:'#132C2A',muted:'#4D6762',accent:'#147D62',soft:'#E5F3E9',border:'#C9DCD4',portal:'#20CA88',
};
const THEMES={
  '151':{...DEFAULT_THEME,name:'Pré-história',mode:'Homem das cavernas',image:{uri:ROOT+'era-151.png'},accent:'#86623B',soft:'#F1E8D4',portal:'#3AE28F'},
  '152':{...DEFAULT_THEME,name:'Extremo Oriente',mode:'Guardião da Muralha',image:{uri:ROOT+'era-152.png'},accent:'#AB4F3C',soft:'#F7E7DF',portal:'#4BE9B4'},
  '153':{...DEFAULT_THEME,name:'Era das invenções',mode:'Inventor',image:{uri:ROOT+'era-153.png'},accent:'#7150AB',soft:'#EEE9FA',portal:'#40EDC6'},
  '154':{...DEFAULT_THEME,name:'Povos das Américas',mode:'Explorador dos Andes',image:{uri:ROOT+'era-154.png'},accent:'#B96829',soft:'#F9EBDD',portal:'#29C989'},
  '155':{...DEFAULT_THEME,name:'Egito Antigo',mode:'Faraó',image:{uri:ROOT+'era-155.png'},accent:'#96781E',soft:'#F9F1CE',portal:'#5CEDB5'},
};

// ----- pages.js -----
const BOOK_IMAGE_ROOT='https://raw.githubusercontent.com/Guijasf/Trabalho_G2_Mickey_Viagem_no_tempo_Completo.github.io/main/pense-bem-mickey-viagem-no-tempo/assets/';
const PAGE_NUMBERS=[5,6,7,8,9,11,12,13,14,15,17,18,19,20,21,23,24,25,26,27,29,30,31,32,33];
const PAGES=Object.fromEntries(PAGE_NUMBERS.map(page=>[page,{uri:BOOK_IMAGE_ROOT+`page-${String(page).padStart(2,'0')}.jpg`} ]));

// ----- secret-codes.js -----
const SECRET_CODES=Object.freeze({ELO:'151',HISTORIA:'152',INVENTOS:'153',AMERICAS:'154',EGITO:'155',ORIGINAL:null});
const emptySecret=()=>({armed:false,buffer:'',lastKey:0});
function readSecret(state,event,now){
  if(event.editable||event.ctrlKey||event.altKey||event.metaKey)return {state:emptySecret()};
  if(event.repeat)return {state};
  if(event.key==='Shift')return {state:{armed:true,buffer:'',lastKey:now}};
  if(!state.armed||now-state.lastKey>6000||!/^[a-z]$/i.test(event.key))return {state:emptySecret()};
  const buffer=state.buffer+event.key.toUpperCase();
  if(Object.prototype.hasOwnProperty.call(SECRET_CODES,buffer))return {state:emptySecret(),matched:true,themeCode:SECRET_CODES[buffer]};
  return {state:Object.keys(SECRET_CODES).some(code=>code.startsWith(buffer))?{armed:true,buffer,lastKey:now}:emptySecret()};
}

// ----- App.js -----





const BUTTONS=[
  {key:'A',name:'Vermelho',color:'#ED272A'},
  {key:'B',name:'Amarelo',color:'#F3CF25'},
  {key:'C',name:'Azul',color:'#254BE7'},
  {key:'D',name:'Verde',color:'#178641'},
];
const ALL=PROGRAMS.flatMap(p=>p.questions);
const PROVISIONAL_COUNT=ALL.filter(q=>q.answerStatus==='provisional').length;

function Action({title,onPress,theme,secondary=false,disabled=false,testID}) {
  return <Pressable testID={testID} accessibilityRole="button" accessibilityState={{disabled}} disabled={disabled} onPress={onPress}
    style={({pressed})=>[styles.action,{backgroundColor:secondary?'transparent':theme.accent,borderColor:theme.accent,opacity:disabled?.45:pressed?.72:1}]}>
    <Text style={[styles.actionText,{color:secondary?theme.accent:'#FFFFFF'}]}>{title}</Text>
  </Pressable>;
}
function StatusNote({children,theme,warning=false}){
  return <View style={[styles.note,{backgroundColor:warning?'#FFF1D7':theme.soft,borderColor:warning?'#EBC77D':theme.border}]}>
    <Text style={[styles.noteText,{color:warning?'#6E4A11':theme.ink}]}>{children}</Text>
  </View>;
}
function Portal({destination,onDone}){
  const motion=useRef(new Animated.Value(0)).current;
  const onDoneRef=useRef(onDone);
  const completed=useRef(false);
  onDoneRef.current=onDone;
  const {width,height}=useWindowDimensions();
  const finish=useCallback(()=>{
    if(completed.current)return;
    completed.current=true;
    onDoneRef.current?.();
  },[]);
  useEffect(()=>{
    let cancelled=false;
    let animation;
    const start=(reduce)=>{
      if(cancelled||completed.current)return;
      if(reduce){finish();return;}
      animation=Animated.timing(motion,{toValue:1,duration:1800,easing:Easing.inOut(Easing.cubic),useNativeDriver:Platform.OS!=='web'});
      animation.start(({finished})=>{if(finished&&!cancelled)finish();});
    };
    const sub=AccessibilityInfo.addEventListener('reduceMotionChanged',(enabled)=>{if(enabled)finish();});
    AccessibilityInfo.isReduceMotionEnabled().then(start,()=>start(true));
    return ()=>{cancelled=true;animation?.stop();sub?.remove?.();};
  },[finish,motion]);
  const size=Math.min(width*.68,height*.37,280);
  const spin=motion.interpolate({inputRange:[0,1],outputRange:['0deg','420deg']});
  const reverse=motion.interpolate({inputRange:[0,1],outputRange:['0deg','-590deg']});
  const pulse=motion.interpolate({inputRange:[0,.4,.8,1],outputRange:[.75,1,.82,.12]});
  return <View style={styles.portalOverlay}>
    <Text style={styles.portalEyebrow}>PORTAL TEMPORAL ATIVADO</Text>
    <View style={{width:size,height:size,alignItems:'center',justifyContent:'center',marginVertical:35}}>
      <Animated.View style={[styles.portalOuter,{width:size,height:size,borderRadius:size/2,transform:[{rotate:spin},{scale:pulse}]}]}/>
      <Animated.View style={[styles.portalMiddle,{width:size*.8,height:size*.8,borderRadius:size*.4,transform:[{rotate:reverse}]}]}/>
      <Animated.View style={[styles.portalInner,{width:size*.57,height:size*.57,borderRadius:size*.285,transform:[{rotate:spin}]}]}/>
      <View style={[styles.portalCore,{width:size*.36,height:size*.36,borderRadius:size*.18}]}/>
    </View>
    <Text style={styles.portalTitle}>Próxima parada:{'\n'}{destination}</Text>
    <Pressable accessibilityRole="button" style={styles.portalSkip} onPress={finish}><Text style={styles.portalSkipText}>Pular viagem →</Text></Pressable>
  </View>;
}

export default function App(){
  const [game,dispatch]=useReducer(gameReducer,null);
  const [screen,setScreen]=useState('home');
  const [mode,setMode]=useState('book');
  const [themeCode,setThemeCode]=useState(null);
  const [showHelp,setShowHelp]=useState(false);
  const [showZoom,setShowZoom]=useState(false);
  const [zoomScale,setZoomScale]=useState(1);
  const [trip,setTrip]=useState(null);
  const [announcement,setAnnouncement]=useState('');
  const tripAction=useRef(null);
  const scroll=useRef(null);
  const secret=useRef(emptySecret());
  const {width}=useWindowDimensions();
  const theme=THEMES[themeCode]||DEFAULT_THEME;
  const question=game?.program.questions[game.index];
  const stats=game?scoreSummary(game):null;
  const bookModeName=(THEMES[themeCode||game?.program?.code]||DEFAULT_THEME).mode;
  const ink={color:theme.ink};
  const muted={color:theme.muted};
  const scrollTop=()=>scroll.current?.scrollTo({y:0,animated:false});

  const completeTrip=useCallback(()=>{
    const fn=tripAction.current;
    tripAction.current=null;
    setTrip(null);
    fn?.();
  },[]);
  const travel=(title,fn)=>{
    if(tripAction.current)return;
    tripAction.current=fn;
    setShowZoom(false);setShowHelp(false);setTrip(title);
  };
  const begin=(program)=>travel(THEMES[program.code].name,()=>{
    dispatch({type:'START',program});setScreen('play');setThemeCode(program.code);scrollTop();
  });
  const setEra=(code)=>travel((THEMES[code]||DEFAULT_THEME).name,()=>{
    setThemeCode(code);setAnnouncement(code?`Ambientação: ${THEMES[code].name}`:'Visual original restaurado');scrollTop();
  });
  const next=()=>{dispatch({type:'NEXT'});scrollTop();};
  const swapMode=()=>{setMode(m=>m==='book'?'quiz':'book');setAnnouncement('Modo alterado sem perder os pontos.');};
  const openPage=()=>{setZoomScale(1);setShowZoom(true);};

  useEffect(()=>{
    if(Platform.OS!=='web')return;
    const listener=(event)=>{
      const result=readSecret(secret.current,{key:event.key,repeat:event.repeat,ctrlKey:event.ctrlKey,altKey:event.altKey,metaKey:event.metaKey,editable:!!event.target?.closest?.('input,textarea,[contenteditable="true"]')},Date.now());
      secret.current=result.state;
      if(result.matched){
        // Teclas de atalho não alteram o jogo; apenas trocam os cenários.
        if(!tripAction.current){tripAction.current=()=>{setThemeCode(result.themeCode);setAnnouncement('Época secreta ativada.');};setTrip((THEMES[result.themeCode]||DEFAULT_THEME).name);}
      }
    };
    globalThis.addEventListener('keydown',listener);
    return ()=>globalThis.removeEventListener('keydown',listener);
  },[]);
  useEffect(()=>{if(game?.finished){setScreen('result');scrollTop();}},[game?.finished]);

  const pageImage=question&&PAGES[question.page]&&<Pressable accessibilityRole="button" accessibilityLabel="Ampliar página original do livro" onPress={openPage}
    style={[styles.pageFrame,{borderColor:theme.border}]}>
    <Image source={PAGES[question.page]} style={styles.pageImage} resizeMode="contain" accessibilityLabel={`Página impressa ${question.printedPage}`} />
    <Text style={[styles.pageHint,{color:theme.accent}]}>Toque para ampliar a página do livro ↗</Text>
  </Pressable>;

  return <View style={[styles.root,{backgroundColor:theme.background}]}>
    <StatusBar barStyle="dark-content" backgroundColor={theme.background}/>
    <ScrollView ref={scroll} contentContainerStyle={[styles.container,{maxWidth:970,paddingHorizontal:width>720?35:17}]}>
      <View style={[styles.header,{borderBottomColor:theme.border}]}>
        <Pressable onPress={()=>setEra(null)} accessibilityLabel="Retornar à ambientação padrão">
          <Text style={[styles.brand,ink]}>PENSE BEM<Text style={{color:theme.accent}}> · </Text>DISNEY</Text>
          <Text style={[styles.tiny,muted]}>VIAGEM NO TEMPO · AV2 MOBILE</Text>
        </Pressable>
        <Action title="Épocas e ajuda" onPress={()=>setShowHelp(true)} theme={theme} secondary/>
      </View>
      {announcement?<Text accessibilityLiveRegion="polite" style={[styles.small,muted,{marginTop:10}]}>{announcement}</Text>:null}

      {screen==='home' ? <>
        <View style={[styles.hero,{backgroundColor:theme.soft}]}>
          <Image source={theme.image} resizeMode="contain" style={styles.heroArt} accessibilityLabel="Arte do Mickey em viagem no tempo"/>
          <View style={styles.heroCopy}>
            <Text style={[styles.eyebrow,{color:theme.accent}]}>PENSE BEM · UMA AVENTURA INTERATIVA</Text>
            <Text style={[styles.title,ink]}>Cinco épocas.{ '\n' }150 desafios.</Text>
            <Text style={[styles.body,muted]}>Use as páginas do livro como no brinquedo original, ou escolha o quiz moderno. Em cada questão, você tem três tentativas.</Text>
          </View>
        </View>
        <StatusNote theme={theme} warning>{`Revisão obrigatória: ${PROVISIONAL_COUNT} respostas são hipóteses, não gabarito oficial. Todas as 150 questões são jogáveis; a pontuação continua provisória até a conferência.`}</StatusNote>
        <View style={styles.sectionTop}>
          <Text style={[styles.sectionTitle,ink]}>Escolha seu modo</Text>
          <Action title={mode==='book'?'Ir para o modo quiz':'Ir para o modo livro'} secondary theme={theme} onPress={swapMode}/>
        </View>
        <Text style={[styles.small,muted]}>{mode==='book'?`Modo ${bookModeName} · páginas originais`:'Modo quiz · enunciados e alternativas na tela'}</Text>
        {game&&!game.finished&&<Action title={`Continuar programa ${game.program.code} · pergunta ${game.index+1}`} onPress={()=>{setScreen('play');scrollTop();}} theme={theme}/>}
        <View style={styles.sectionTop}><Text style={[styles.sectionTitle,ink]}>Escolha seu destino</Text><Text style={[styles.small,muted]}>5 programas · 30 questões cada</Text></View>
        <View style={styles.cards}>{PROGRAMS.map((p,i)=><Pressable key={p.code} accessibilityRole="button" accessibilityLabel={`Iniciar programa ${p.code}`} onPress={()=>begin(p)}
          style={({pressed})=>[styles.card,{borderColor:theme.border,width:width>=730?'48%':'100%',opacity:pressed?.72:1}]}>
          <Image source={THEMES[p.code].image} resizeMode="contain" style={styles.cardArt}/>
          <View style={styles.cardCopy}>
            <Text style={[styles.eyebrow,{color:theme.accent}]}>DESTINO 0{i+1} · CÓDIGO {p.code}</Text>
            <Text style={[styles.cardTitle,ink]}>{p.title}</Text>
            <Text style={[styles.small,muted]}>30 perguntas · até 90 pontos →</Text>
          </View>
        </Pressable>)}</View>
        <Text style={[styles.footer,muted]}>Projeto acadêmico baseado em Pense Bem — Disney: Viagem no Tempo (Tectoy / Nova Cultural, 1991). Sem vínculo oficial com os titulares das marcas. Questões adaptadas para estudo.</Text>
      </> : game ? <>
        <View style={[styles.sectionTop,{marginTop:20}]}>
          <Action title="‹ Destinos" theme={theme} secondary onPress={()=>{setScreen('home');scrollTop();}}/>
          <Text style={[styles.eyebrow,{color:theme.accent}]}>PROGRAMA {game.program.code}</Text>
        </View>
        <View style={[styles.miniBanner,{backgroundColor:theme.soft}]}>
          <Image source={THEMES[game.program.code].image} resizeMode="contain" style={styles.bannerArt}/>
          <View style={{flex:1,padding:12}}><Text style={[styles.sectionTitle,ink]}>{game.program.title}</Text><Text style={[styles.small,muted]}>{(THEMES[game.program.code]).name}</Text></View>
        </View>
        {screen==='play' ? <>
          <View style={styles.sectionTop}><Text style={[styles.small,ink]}>QUESTÃO {game.index+1} / 30</Text><Text testID="score" style={[styles.sectionTitle,ink]}>{game.score} / 90</Text></View>
          <View style={[styles.progress,{backgroundColor:theme.border}]}><View style={{height:'100%',backgroundColor:theme.accent,width:`${(game.index+1)/30*100}%`}}/></View>
          <View style={[styles.sectionTop,{marginBottom:6}]}><Text style={[styles.eyebrow,{color:theme.accent}]}>{mode==='book'?`MODO ${bookModeName.toUpperCase()}`:'MODO QUIZ'}</Text><Action title={mode==='book'?'Abrir quiz':'Abrir livro'} secondary onPress={swapMode} theme={theme}/></View>
          <View style={[styles.questionCard,{borderColor:theme.border}]}>
            <Text style={[styles.eyebrow,{color:theme.accent}]}>{question.topic.toUpperCase()} · Nº {question.id}</Text>
            {mode==='quiz'?<>
              <Text style={[styles.question,ink]}>{question.prompt}</Text>
              {question.context?<StatusNote theme={theme}>{question.context}</StatusNote>:null}
              {question.visual? pageImage : <Pressable onPress={openPage}><Text style={[styles.link,{color:theme.accent}]}>Ver página original do livro ↗</Text></Pressable>}
            </>:<>
              <Text style={[styles.question,ink]}>Procure a questão {question.id} na página do livro.</Text>
              {pageImage}
            </>}
            {question.answerStatus==='provisional'&&<StatusNote warning theme={theme}>Atenção: esta resposta é uma hipótese ainda não conferida com o gabarito oficial. A pontuação é experimental.</StatusNote>}
            {question.imageMissing&&<StatusNote warning theme={theme}>A figura original desta questão não aparece completa na digitalização. Compare com o livro físico antes de usar o gabarito para avaliação.</StatusNote>}
            <Text style={[styles.small,muted,{marginTop:16}]}>TENTATIVA {game.resolved?Math.max(1,game.attempts.length):game.attempts.length+1} DE 3</Text>
            <View style={styles.answerList}>{BUTTONS.map((opt,i)=>{
              const attempted=game.attempts.includes(opt.key);
              const correct=game.resolved&&question.answer===opt.key;
              const wrong=attempted&&!correct;
              const disabled=game.resolved||attempted;
              return <Pressable key={opt.key} testID={`answer-${opt.key}`} accessibilityRole="button" accessibilityLabel={`Alternativa ${opt.key}: ${mode==='book'?opt.name:question.options[i]}`} accessibilityState={{disabled}}
                onPress={()=>dispatch({type:'ANSWER',choice:opt.key})} disabled={disabled}
                style={({pressed})=>[styles.answer,{borderColor:correct?'#248653':wrong?'#C95142':theme.border,backgroundColor:correct?'#E8F8EE':wrong?'#FFEDEA':'#FFFFFF',opacity:pressed?.74:1}]}>
                  <View style={[styles.colorBadge,{backgroundColor:opt.color}]}><Text style={[styles.badgeText,{color:opt.key==='B'?'#151515':'#FFFFFF'}]}>{opt.key}</Text></View>
                  <Text style={[styles.answerLabel,ink]}>{mode==='book'?opt.name:question.options[i]}</Text>
                  <Text style={[styles.resultMark,{color:correct?'#178641':'#BE473A'}]}>{correct?'✓':wrong?'×':''}</Text>
                </Pressable>;
            })}</View>
            {game.feedback?<StatusNote theme={theme}>{game.feedback}{game.resolved?` Resposta cadastrada: ${question.answer}.`:''}</StatusNote>:<Text style={[styles.small,muted]}>Cada erro consome uma tentativa. Acertos valem 3, 2 ou 1 ponto.</Text>}
            {game.resolved&&<Action testID="next" title={game.index===29?'Concluir e ver resultado →':'Próxima questão →'} onPress={next} theme={theme}/>}
          </View>
        </> : <View style={[styles.questionCard,{borderColor:theme.border}]}>
          <Text style={[styles.eyebrow,{color:theme.accent}]}>PROGRAMA CONCLUÍDO</Text>
          <Text style={[styles.title,ink]}>Viagem finalizada!</Text>
          <Text style={[styles.bigScore,ink]}>{stats.score}<Text style={[styles.body,muted]}> / 90 pontos</Text></Text>
          <Text style={[styles.body,ink]}>{stats.correct} acertos em 30 questões · {stats.provisionalPoints} pontos dependem de respostas provisórias.</Text>
          <StatusNote warning theme={theme}>Este resultado ainda não é homologado: as 150 respostas do projeto são adaptações editoriais, e {stats.reviewed} questões deste programa usam hipóteses adicionais.</StatusNote>
          <View style={styles.toolbar}><Action title="Reiniciar programa" theme={theme} onPress={()=>begin(game.program)}/><Action title="Outros destinos" theme={theme} secondary onPress={()=>{setScreen('home');scrollTop();}}/></View>
          <Text style={[styles.sectionTitle,ink,{marginTop:26}]}>Seu histórico</Text>
          {game.history.map((h,i)=><View key={h.id} style={[styles.historyItem,{borderColor:theme.border}]}>
            <Text style={[styles.small,ink]}>Questão {h.id} · {h.correct?'Acertou':'Não acertou'} · +{h.points} ponto(s)</Text>
            <Text style={[styles.small,muted]}>Respostas: {h.attempts.join(' → ')} · Gabarito cadastrado: {h.answer} {h.answerStatus==='provisional'?'(hipótese)':''}</Text>
          </View>)}
        </View>}
      </> : null}
    </ScrollView>
    <Modal visible={showHelp} animationType="fade" transparent onRequestClose={()=>setShowHelp(false)}>
      <View style={styles.modalBackdrop}><ScrollView contentContainerStyle={styles.modalScroll}>
        <View style={[styles.dialog,{backgroundColor:theme.surface}]}>
          <Text style={[styles.sectionTitle,ink]}>Manual do viajante</Text>
          <Text style={[styles.body,muted]}>Cada programa tem 30 perguntas. Você tem três tentativas por pergunta: acertar na primeira vale 3 pontos, na segunda vale 2, na terceira vale 1; errar as três vale 0.</Text>
          <Text style={[styles.body,muted]}>Trocar de época e de modo mantém a questão e os pontos. Ao escolher outro destino, começa uma nova partida.</Text>
          <Text style={[styles.sectionTitle,ink,{marginTop:18}]}>Códigos secretos</Text>
          <Text style={[styles.small,muted]}>Na web, pressione Shift e digite um código. No celular, use os botões abaixo:</Text>
          {Object.entries(SECRET_CODES).map(([secretCode,programCode])=><Action key={secretCode} theme={theme} secondary title={`${secretCode} · ${(THEMES[programCode]||DEFAULT_THEME).name}`} onPress={()=>setEra(programCode)}/>)}
          <StatusNote warning theme={theme}>Gabarito de referência, ainda não oficial. Verifique especialmente as questões 30, 32, 36, 37, 40, 49, 54, 62, 64, 73, 83, 99, 120, 121–123, 125 e 126.</StatusNote>
          <Action title="Fechar" theme={theme} onPress={()=>setShowHelp(false)}/>
        </View>
      </ScrollView></View>
    </Modal>
    <Modal visible={showZoom} animationType="slide" onRequestClose={()=>setShowZoom(false)}>
      <View style={[styles.zoomRoot,{backgroundColor:theme.background}]}>
        <View style={styles.toolbar}><Text style={[styles.small,ink]}>Página {question?.printedPage} · questão {question?.id}</Text><Action title="Fechar" onPress={()=>setShowZoom(false)} theme={theme}/></View>
        <View style={styles.toolbar}><Action title="− Zoom" onPress={()=>setZoomScale(v=>Math.max(1,v-.5))} disabled={zoomScale<=1} secondary theme={theme}/><Text style={ink}>{Math.round(zoomScale*100)}%</Text><Action title="+ Zoom" onPress={()=>setZoomScale(v=>Math.min(3,v+.5))} disabled={zoomScale>=3} secondary theme={theme}/></View>
        <ScrollView><ScrollView horizontal>{question&&<Image source={PAGES[question.page]} resizeMode="contain" style={{width:width*zoomScale,height:width*1.32*zoomScale}}/>}</ScrollView></ScrollView>
      </View>
    </Modal>
    {trip&&<Portal destination={trip} onDone={completeTrip}/>}
  </View>;
}

const styles=StyleSheet.create({
  root:{flex:1},container:{width:'100%',alignSelf:'center',paddingTop:20,paddingBottom:55},
  header:{borderBottomWidth:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8,paddingBottom:12},
  brand:{fontSize:21,fontWeight:'900'},tiny:{fontSize:10,letterSpacing:1.1,marginTop:2},
  action:{borderWidth:1,borderRadius:11,minHeight:43,paddingVertical:10,paddingHorizontal:15,alignItems:'center',justifyContent:'center',marginVertical:5},
  actionText:{fontSize:13,fontWeight:'800',textAlign:'center'},
  hero:{borderRadius:20,overflow:'hidden',marginTop:21},heroArt:{width:'100%',height:270},heroCopy:{padding:24},
  eyebrow:{fontSize:11,fontWeight:'900',letterSpacing:1.2,marginBottom:9},title:{fontSize:34,lineHeight:42,fontWeight:'900',marginBottom:8},
  body:{fontSize:15,lineHeight:23},small:{fontSize:12,lineHeight:19},note:{borderWidth:1,padding:13,borderRadius:11,marginVertical:10},noteText:{fontSize:12,lineHeight:19},
  sectionTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap',marginTop:17,marginBottom:13},
  sectionTitle:{fontSize:20,lineHeight:26,fontWeight:'800'},cards:{flexDirection:'row',flexWrap:'wrap',gap:15,justifyContent:'space-between'},
  card:{borderWidth:1,borderRadius:16,overflow:'hidden',backgroundColor:'#FFFFFF'},cardArt:{width:'100%',height:190},cardCopy:{padding:19},cardTitle:{fontSize:20,fontWeight:'800',marginBottom:8},
  footer:{fontSize:10,lineHeight:17,marginTop:24},miniBanner:{flexDirection:'row',alignItems:'center',borderRadius:14,overflow:'hidden',marginTop:2},bannerArt:{width:130,height:115},
  progress:{height:7,borderRadius:4,overflow:'hidden',marginBottom:9},questionCard:{backgroundColor:'#FFFFFF',borderWidth:1,borderRadius:18,padding:20,marginVertical:10},
  question:{fontSize:23,lineHeight:31,fontWeight:'800',marginBottom:15},link:{fontSize:13,fontWeight:'800',marginVertical:12},
  pageFrame:{borderWidth:1,borderRadius:10,overflow:'hidden',marginVertical:8},pageImage:{width:'100%',height:460},pageHint:{fontSize:12,fontWeight:'700',textAlign:'center',padding:9},
  answerList:{gap:10,marginVertical:13},answer:{minHeight:60,borderWidth:1.5,borderRadius:12,flexDirection:'row',alignItems:'center',gap:12,padding:11},
  colorBadge:{width:40,height:40,borderRadius:8,alignItems:'center',justifyContent:'center'},badgeText:{fontSize:20,fontWeight:'900'},
  answerLabel:{fontSize:15,lineHeight:22,flex:1},resultMark:{fontSize:22,fontWeight:'900'},
  bigScore:{fontSize:64,fontWeight:'900',marginVertical:17},toolbar:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:9,padding:9},
  historyItem:{borderBottomWidth:1,paddingVertical:11,gap:3},modalBackdrop:{flex:1,backgroundColor:'#061D1BCC'},modalScroll:{flexGrow:1,justifyContent:'center',padding:18},
  dialog:{width:'100%',maxWidth:580,alignSelf:'center',borderRadius:19,padding:21,gap:9},zoomRoot:{flex:1,paddingTop:Platform.OS==='ios'?44:20},
  portalOverlay:{position:'absolute',left:0,right:0,top:0,bottom:0,zIndex:1000,backgroundColor:'#061F20FA',alignItems:'center',justifyContent:'center',padding:25},
  portalEyebrow:{fontSize:13,letterSpacing:3,color:'#83EEC7',fontWeight:'900',textAlign:'center'},
  portalOuter:{position:'absolute',borderWidth:13,borderColor:'#2CE89B',borderStyle:'dashed',shadowColor:'#69FFC8',shadowOpacity:.55,shadowRadius:30},
  portalMiddle:{position:'absolute',borderWidth:18,borderColor:'#A5F5B9',borderStyle:'dotted'},
  portalInner:{position:'absolute',borderWidth:16,borderColor:'#0B946A',borderStyle:'dashed'},portalCore:{backgroundColor:'#A2FFD7',shadowColor:'#60FFAF',shadowOpacity:1,shadowRadius:35},
  portalTitle:{fontSize:25,lineHeight:34,color:'#FFFFFF',fontWeight:'900',textAlign:'center'},portalSkip:{marginTop:40,padding:16},portalSkipText:{color:'#A3FFE0',fontWeight:'900',fontSize:16},
});
