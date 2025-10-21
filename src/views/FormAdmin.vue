<template>
  <div id="app">
    <header class="header">
      <div class="header-left">
        <img src="../assets/LogoFinal.png" alt="Logo" class="logo" width="40" height="40">
        <h2 class="header-title">VisionWeb</h2>
      </div>
    </header>

    <main class="container">

      <section v-if="currentScreen === 'access'" class="access-page-content">
        
        <div class="header-titles">
          <h1 class="hero-vision-title large-title">VisionWeb</h1>
          <p class="hero-vision-subtitle large-subtitle">Sistema de Pesquisas de Clima Organizacional</p>
        </div>

        <div class="access-system-box">
          <h2>Acesso ao Sistema</h2>
          <p>Selecione seu tipo de acesso</p>
          
          <div class="profile-selector">
            <button 
              :class="['profile-btn', { 'active': profile === 'admin' }]" 
              @click="selectProfile('admin')"
            >
              <i class="fas fa-user-shield"></i> Administrador
            </button>
            
            <button 
              :class="['profile-btn', { 'active': profile === 'collaborator' }]" 
              @click="selectProfile('collaborator')"
            >
              <i class="fas fa-users"></i> Colaborador
            </button>
          </div>
        </div>
        
        <transition name="fade-slide" mode="out-in">
            <section v-if="profile === 'admin'" key="admin" class="dashboard">
              <div class="dashboard-header">
                <div class="header-content-left">
                  <h2>Gerenciar Pesquisas</h2>
                  <p>Crie e gerencie pesquisas de clima organizacional</p>
                </div>
                <button class="action-btn primary" @click="openCreateSurveyModal">
                  <i class="fas fa-plus"></i> Nova Pesquisa
                </button>
              </div>

              <div class="stacked-survey-card">
                <div class="survey-list">
                  <p v-if="surveys.length === 0" class="no-data">
                    Nenhuma pesquisa cadastrada ainda. Clique em "Nova Pesquisa" para começar.
                  </p>
                  
                  <div 
                      v-for="survey in surveys" 
                      :key="survey.id" 
                      class="survey-item" 
                      @click.self="openSurveyDetails(survey)"
                  >
                    <div class="survey-info" @click.self="openSurveyDetails(survey)">
                      <h3>{{ survey.title }}</h3>
                      <span :class="['status-tag', survey.status.toLowerCase()]">{{ survey.status }}</span>
                      <p class="subtitle">Total de {{ survey.questions.length }} perguntas.</p>
                      <div class="meta">
                        <span><i class="fas fa-calendar-alt"></i> Criada em {{ survey.createdDate }}</span>
                        <span><i class="fas fa-chart-bar"></i> {{ survey.responses }} respostas</span>
                        <span><i class="fas fa-question-circle"></i> {{ survey.questions.length }} perguntas</span>
                      </div>
                    </div>
                    <div class="survey-actions">
                      <button 
                          class="icon-btn" 
                          title="Publicar" 
                          v-if="survey.status === 'Rascunho'" 
                          @click="publishExistingSurvey(survey.id)"
                      >
                          <img src="../assets/publicar.png" alt="Publicar">
                      </button>
                      
                      <button 
                          class="icon-btn" 
                          title="Editar" 
                          @click="openEditSurveyModal(survey)"
                      >
                          <img src="../assets/editar.png" alt="Editar">
                      </button>
                      
                      <button 
                          class="icon-btn" 
                          title="Deletar" 
                          @click="deleteSurvey(survey.id)"
                      >
                          <img src="../assets/deletar.png" alt="Deletar">
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              </section>

            <section v-else-if="profile === 'collaborator'" key="collaborator" class="dashboard">
              <div class="dashboard-header">
                <div class="header-content-left">
                  <h2>Pesquisas Disponíveis</h2>
                  <p>Responda às pesquisas disponíveis para colaborar com o clima organizacional.</p>
                </div>
              </div>
              
              <div class="stacked-survey-card">
                <div class="survey-list">
                  <p v-if="activeSurveys.length === 0" class="no-data">
                    Não há pesquisas ativas no momento.
                </p>
                
                <div v-for="survey in activeSurveys" :key="survey.id" class="survey-item">
                  <div class="survey-info">
                    <h3>{{ survey.title }}</h3>
                    <span :class="['status-tag', survey.status.toLowerCase()]">{{ survey.status }}</span>
                    <p class="subtitle">Avaliação trimestral do ambiente organizacional.</p>
                    <div class="meta">
                      <span><i class="fas fa-question-circle"></i> {{ survey.questions.length }} perguntas</span>
                    </div>
                  </div>
                  <div class="survey-actions">
                    <button class="action-btn primary small-btn" @click="openResponseModal(survey)">
                      <i class="fas fa-comment-dots"></i> Responder
                    </button>
                  </div>
                </div>
              </div>
              </div>
              </section>
        </transition>

      </section>
      <transition name="modal">
        <div v-if="isCreatingSurvey" class="modal-overlay">
          <div class="card create-survey-card modal-content">
            <button class="close-modal-btn" @click="closeCreateSurveyModal"><i class="fas fa-times"></i></button>

            <div class="modal-title-group">
                <h2 v-if="editingSurveyId">Editar Pesquisa: {{ newSurvey.title }}</h2>
                <h2 v-else>Criar Pesquisa de Clima</h2>
                <p>Configure sua pesquisa de clima organizacional</p>
            </div>

            <div class="form-group">
              <label for="title">Título da Pesquisa</label>
              <input type="text" id="title" placeholder="Ex: Pesquisa de Clima Organizacional Q1 2024" v-model="newSurvey.title">
            </div>

            <div class="form-group questions-section">
                <div class="questions-header-row">
                    <label>Perguntas</label>
                    <div class="question-type-buttons">
                      <button class="type-btn" @click="addQuestion('text')"><i class="fas fa-keyboard"></i> Texto</button>
                      <button class="type-btn" @click="addQuestion('multiple')"><i class="fas fa-list-ul"></i> Múltipla Escolha</button>
                      <button class="type-btn" @click="addQuestion('scale')"><i class="fas fa-sliders-h"></i> Escala</button>
                    </div>
                </div>

              <div v-if="newSurvey.questions.length === 0" class="no-data">Adicione suas perguntas acima.</div>
              
              <div v-for="(question, index) in newSurvey.questions" :key="index" class="question-item">
                <div class="question-header">
                  <span class="q-type-tag">{{ question.typeDisplay }}</span>
                  <button class="delete-q-btn" @click="removeQuestion(index)"><i class="fas fa-times"></i></button>
                </div>
                
                <label :for="'q-text-' + index">Pergunta {{ index + 1 }}</label>
                <input 
                  type="text" 
                  :id="'q-text-' + index" 
                  placeholder="Digite o texto da pergunta" 
                  v-model="question.text"
                  required
                >
                
                <div v-if="question.type === 'multiple'" class="options-group">
                  <label>Opções de Resposta</label>
                  <div v-for="(option, oIndex) in question.options" :key="oIndex" class="option-item">
                    <input type="text" v-model="question.options[oIndex]" :placeholder="'Opção ' + (oIndex + 1)">
                    <button class="icon-btn remove-option-btn" @click="removeOption(index, oIndex)">
                      <img src="../assets/deletar.png" alt="Deletar Opção">
                    </button>
                  </div>
                  <button class="add-option-btn" @click="addOption(index)">+ Adicionar Opção</button>
                </div>

                <div v-if="question.type === 'scale'" class="scale-info">
                  <p>Escala Padrão: 1 (Discordo Totalmente) a 5 (Concordo Totalmente)</p>
                  <div style="display: flex; justify-content: space-between; margin-top: 10px; color: #a8a8a8;">
                      <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="action-buttons-footer">
              <button class="action-btn secondary" @click="closeCreateSurveyModal">
                <i class="fas fa-arrow-left"></i> Cancelar
              </button>
              
              <button class="action-btn purple-gradient" @click="saveSurvey('Rascunho')">
                <i class="fas fa-save"></i> 
                Salvar {{ editingSurveyId ? 'como Rascunho' : 'Rascunho' }}
              </button>
              
              <button 
                  class="action-btn success" 
                  @click="publishSurvey" 
                  :disabled="!newSurvey.title || newSurvey.questions.length === 0"
              >
                  <i class="fas fa-paper-plane"></i> 
                  {{ editingSurveyId && newSurvey.status === 'Ativa' ? 'Salvar e Manter Ativa' : 'Publicar Pesquisa' }}
              </button>
            </div>
          </div>
        </div>
      </transition>
      
      <transition name="modal">
        <div v-if="isViewingReport" class="modal-overlay">
            <div class="card create-survey-card modal-content report-modal">
                <button class="close-modal-btn" @click="closeReportModal"><i class="fas fa-times"></i></button>

                <div class="modal-title-group" v-if="currentReportSurvey">
                    <h2>Relatório: {{ currentReportSurvey.title }}</h2>
                    <p>Análise consolidada de **{{ currentReportSurvey.responses }}** respostas</p>
                    <span :class="['status-tag large', currentReportSurvey.status.toLowerCase()]">{{ currentReportSurvey.status }}</span>
                </div>

                <div class="report-content" v-if="currentReportSurvey">
                    <div v-for="(question, index) in currentReportSurvey.questions" :key="index" class="report-question-item">
                        <h4>{{ index + 1 }}. {{ question.text }}</h4>
                        <span class="q-type-tag">{{ question.typeDisplay }}</span>
                        
                        <div class="response-display">
                            <p class="real-data-placeholder">
                                Dados reais de **{{ currentReportSurvey.responses }}** respostas seriam exibidos aqui.
                            </p>
                            
                            <p v-if="question.type === 'text'" class="text-insights">
                                Insights de Texto Livre (Exemplo): 45 menções à palavra "Melhoria".
                            </p>
                        </div>
                    </div>
                </div>

                <div class="action-buttons-footer report-footer">
                    <button class="action-btn purple-gradient" @click="closeReportModal">
                        Fechar Relatório
                    </button>
                </div>
            </div>
        </div>
      </transition>
      
      <transition name="modal">
        <div v-if="isResponding" class="modal-overlay">
            <div class="card create-survey-card modal-content response-modal">
                <button class="close-modal-btn" @click="closeResponseModal"><i class="fas fa-times"></i></button>

                <div class="modal-title-group" v-if="currentSurveyToRespond">
                    <h2>Responder: {{ currentSurveyToRespond.title }}</h2>
                    <p>Sua opinião é valiosa para o clima organizacional.</p>
                </div>

                <div class="survey-form-content" v-if="currentSurveyToRespond">
                    <div v-for="(question, index) in currentSurveyToRespond.questions" :key="index" class="question-item form-group">
                        <label :for="'q-' + (index + 1)">
                            {{ index + 1 }}. {{ question.text }} 
                            <span class="q-type-tag">{{ question.typeDisplay }}</span>
                        </label>
                        
                        <textarea 
                            v-if="question.type === 'text'"
                            :id="'q-' + (index + 1)" 
                            rows="3"
                            placeholder="Digite sua resposta aqui..."
                            v-model="collaboratorResponses[index + 1]"
                            class="text-input"
                        ></textarea>

                        <div v-else-if="question.type === 'multiple'" class="multiple-options-group">
                            <div v-for="(option, oIndex) in question.options" :key="oIndex" class="option-radio-item">
                                <input 
                                    type="radio" 
                                    :id="'q-' + (index + 1) + '-' + oIndex" 
                                    :name="'q-' + (index + 1)" 
                                    :value="option"
                                    v-model="collaboratorResponses[index + 1]"
                                >
                                <label :for="'q-' + (index + 1) + '-' + oIndex">{{ option }}</label>
                            </div>
                        </div>

                        <div v-else-if="question.type === 'scale'" class="scale-group radio-scale">
                            <div class="scale-radio-options">
                                <div v-for="n in 5" :key="n" class="scale-radio-item">
                                    <input 
                                        type="radio" 
                                        :id="'q-' + (index + 1) + '-scale-' + n" 
                                        :name="'q-' + (index + 1)" 
                                        :value="n"
                                        v-model.number="collaboratorResponses[index + 1]"
                                    >
                                    <label :for="'q-' + (index + 1) + '-scale-' + n">{{ n }}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="action-buttons-footer">
                    <button class="action-btn secondary" @click="closeResponseModal">
                        <i class="fas fa-arrow-left"></i> Cancelar
                    </button>
                    <button class="action-btn primary" @click="submitResponses">
                        <i class="fas fa-check-circle"></i> Enviar Respostas
                    </button>
                </div>
            </div>
        </div>
      </transition>
      
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';

// --- ESTADOS DE NAVEGAÇÃO E DADOS ---
const currentScreen = ref('access'); 
const profile = ref('admin'); // 'admin' ou 'collaborator'
const isCreatingSurvey = ref(false); 
const isViewingReport = ref(false); 
const currentReportSurvey = ref(null); 

const isResponding = ref(false); 
const currentSurveyToRespond = ref(null); 
const collaboratorResponses = ref({}); 

// ID da pesquisa sendo editada. null = criando nova.
const editingSurveyId = ref(null);

// Array PRINCIPAL de pesquisas (Vazio, mas será preenchido)
const surveys = ref([]); 

// Objeto para a pesquisa sendo CRIADA/EDITADA
const newSurvey = ref({
    title: '',
    questions: [],
    responses: 0,
});

// Pesquisas ATIVAS para o Colaborador
const activeSurveys = computed(() => {
    return surveys.value.filter(s => s.status === 'Ativa');
});

// =========================================================================
// LÓGICA DE PERSISTÊNCIA E INICIALIZAÇÃO DE DADOS (LOCAL STORAGE)
// =========================================================================
const loadSurveys = () => {
    const savedSurveys = localStorage.getItem('visionWebSurveys');
    if (savedSurveys) {
        surveys.value = JSON.parse(savedSurveys);
    } else {
        // Dados iniciais (mock) para testes, se não houver nada salvo
        const mockSurveys = [
            {
                id: 1,
                title: 'Clima Organizacional Q4 2025',
                status: 'Ativa',
                description: 'Pesquisa trimestral de clima.',
                createdDate: '01/10/2025',
                responses: 42,
                questions: [{text: 'A comunicação interna é eficaz?', type: 'scale', typeDisplay: 'Escala (1-5)'}, {text: 'Oportunidades de crescimento?', type: 'multiple', typeDisplay: 'Múltipla Escolha', options: ['Sim', 'Não', 'Talvez']}]
            },
            {
                id: 2,
                title: 'Ambiente de Trabalho Remoto (Rascunho)',
                status: 'Rascunho',
                description: 'Pesquisa em desenvolvimento.',
                createdDate: '05/10/2025',
                responses: 0,
                questions: [{text: 'Sugestões de melhoria?', type: 'text', typeDisplay: 'Texto Livre'}]
            }
        ];
        surveys.value = mockSurveys;
    }
};

// Carrega os dados na inicialização
loadSurveys();

// Sincroniza o estado "surveys" com o localStorage sempre que ele mudar
watchEffect(() => {
    localStorage.setItem('visionWebSurveys', JSON.stringify(surveys.value));
});
// =========================================================================


// --- LÓGICA DE NAVEGAÇÃO E PERFIS ---
const selectProfile = (p) => {
    profile.value = p;
};

// --- LÓGICA DO MODAL DE CRIAÇÃO/EDIÇÃO/RELATÓRIO ---
const resetNewSurvey = () => {
    newSurvey.value = {
        title: '',
        questions: [],
        responses: 0,
    };
};

const openCreateSurveyModal = () => {
    resetNewSurvey();
    editingSurveyId.value = null; // Garante modo de criação
    isCreatingSurvey.value = true;
};

const closeCreateSurveyModal = () => {
    isCreatingSurvey.value = false;
    editingSurveyId.value = null; 
};

const closeReportModal = () => {
    isViewingReport.value = false;
    currentReportSurvey.value = null;
};

// Abre modal para edição
const openEditSurveyModal = (survey) => {
    // Deep copy (cópia profunda) para não alterar o objeto original antes de salvar
    newSurvey.value = JSON.parse(JSON.stringify(survey));
    editingSurveyId.value = survey.id; 
    isCreatingSurvey.value = true; 
};

// Controla o que acontece ao clicar no card
const openSurveyDetails = (survey) => {
    if (survey.status === 'Rascunho') {
        // Se for rascunho, clica para editar
        openEditSurveyModal(survey);
    } else {
        // Se for Ativa ou Finalizada, abre o relatório
        currentReportSurvey.value = survey;
        isViewingReport.value = true;
    }
};

// Publica pesquisa Rascunho existente
const publishExistingSurvey = (surveyId) => {
    const surveyIndex = surveys.value.findIndex(s => s.id === surveyId);
    if (surveyIndex !== -1) {
        surveys.value[surveyIndex].status = 'Ativa';
        alert(`Pesquisa "${surveys.value[surveyIndex].title}" publicada com sucesso!`);
    }
};

// Deleta pesquisa
const deleteSurvey = (surveyId) => {
    if (confirm("Tem certeza que deseja deletar esta pesquisa? Esta ação é irreversível.")) {
        const initialLength = surveys.value.length;
        surveys.value = surveys.value.filter(s => s.id !== surveyId);
        if (surveys.value.length < initialLength) {
            alert("Pesquisa deletada com sucesso.");
        }
    }
};


// --- LÓGICA DE FORMULÁRIO DE PERGUNTAS ---
const addQuestion = (type) => {
    let question = {
        text: '',
        type: type,
        typeDisplay: type.charAt(0).toUpperCase() + type.slice(1)
    };

    if (type === 'multiple') {
        question.typeDisplay = 'Múltipla Escolha';
        question.options = ['', '']; 
    } else if (type === 'scale') {
        question.typeDisplay = 'Escala (1-5)';
        question.scaleMin = 1; 
        question.scaleMax = 5; 
    } else if (type === 'text') {
        question.typeDisplay = 'Texto Livre';
    }
    
    newSurvey.value.questions.push(question);
};

const removeQuestion = (index) => {
    newSurvey.value.questions.splice(index, 1);
};

const addOption = (qIndex) => {
    newSurvey.value.questions[qIndex].options.push('');
};

const removeOption = (qIndex, oIndex) => {
    newSurvey.value.questions[qIndex].options.splice(oIndex, 1);
};

// --- LÓGICA DE SALVAR E PUBLICAR (UNIFICADA) ---
const saveSurvey = (status) => {
    if (!newSurvey.value.title) {
        alert("O Título da Pesquisa é obrigatório para salvar!");
        return;
    }
    
    // Validação de perguntas e opções
    const questionsToSave = newSurvey.value.questions.filter(q => {
        if (q.text.trim() === '') return false;
        if (q.type === 'multiple') {
            return q.options.filter(o => o.trim() !== '').length >= 2;
        }
        return true;
    });

    if (questionsToSave.length === 0) {
        alert("Adicione pelo menos uma pergunta válida (Múltipla Escolha requer no mínimo 2 opções).");
        return;
    }

    // LÓGICA DE EDIÇÃO vs CRIAÇÃO
    if (editingSurveyId.value) {
        // Modo de Edição
        const surveyIndex = surveys.value.findIndex(s => s.id === editingSurveyId.value);
        if (surveyIndex !== -1) {
            // Mantém ID e data de criação, atualiza o resto
            surveys.value[surveyIndex].title = newSurvey.value.title;
            surveys.value[surveyIndex].questions = questionsToSave;
            surveys.value[surveyIndex].status = status; // Pode ser 'Rascunho' ou 'Ativa'
            alert(`Pesquisa "${newSurvey.value.title}" atualizada com sucesso como ${status}.`);
        }
    } else {
        // Modo de Criação
        const now = new Date();
        const dateString = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

        const finalSurvey = {
            id: Date.now(),
            title: newSurvey.value.title,
            status: status,
            description: status === 'Ativa' ? 'Pesquisa de clima recém-publicada.' : 'Pesquisa em desenvolvimento.',
            createdDate: dateString,
            responses: 0,
            questions: questionsToSave
        };

        surveys.value.push(finalSurvey);
        alert(`Pesquisa "${finalSurvey.title}" salva como ${status}.`);
    }
    
    closeCreateSurveyModal(); 
};

const publishSurvey = () => {
    saveSurvey('Ativa');
};

// --- LÓGICA DE RESPOSTA DO COLABORADOR (Estrutura) ---
const openResponseModal = (survey) => {
    // 1. Define a pesquisa a ser respondida
    currentSurveyToRespond.value = survey;
    
    // 2. Inicializa as respostas
    const initialResponses = {};
    survey.questions.forEach((q, index) => {
        const qId = index + 1; 
        if (q.type === 'scale') {
            // Alterado para iniciar com null (desmarcado)
            initialResponses[qId] = null; 
        } else {
            initialResponses[qId] = ''; // Vazio para múltipla e texto
        }
    });
    collaboratorResponses.value = initialResponses;
    
    // 3. Abre o Modal
    isResponding.value = true;
};

// CORREÇÃO: Implementação da função para fechar o modal de resposta
const closeResponseModal = () => {
    isResponding.value = false;
    currentSurveyToRespond.value = null;
    collaboratorResponses.value = {}; // Limpa as respostas
};

// CORREÇÃO: Implementação do fechamento automático do modal após submissão.
const submitResponses = () => {
    if (!currentSurveyToRespond.value) return;

    // Lógica básica de validação (Garantir que todas as perguntas foram respondidas)
    const totalQuestions = currentSurveyToRespond.value.questions.length;
    
    const answeredCount = Object.values(collaboratorResponses.value).filter(val => {
        // Checa se é string e está vazia (texto, múltipla)
        if (typeof val === 'string' && val.trim() === '') return false;
        // Checa se é nulo ou indefinido
        if (val === null || val === undefined) return false;
        
        // Se for um número (escala), é válido.
        return true;
    }).length;

    if (answeredCount < totalQuestions) {
        alert("Por favor, responda a todas as perguntas antes de enviar.");
        return;
    }

    // SIMULAÇÃO DE GRAVAÇÃO (Backend)
    const surveyIndex = surveys.value.findIndex(s => s.id === currentSurveyToRespond.value.id);
    if (surveyIndex !== -1) {
        // Incrementa o contador de respostas
        surveys.value[surveyIndex].responses++; 
    }
    
    alert(`Obrigado! Sua resposta para "${currentSurveyToRespond.value.title}" foi enviada com sucesso!`);
    
    // CORREÇÃO: Fecha o modal após o envio
    closeResponseModal();
};
</script>

<style>
/* ========================================================= */
/* VARIÁVEIS DE CORES */
/* ========================================================= */
:root {
  --color-bg-dark: #0d0d0d; 
  --color-bg-card: rgba(31, 31, 31, 0.8); 
  --color-text-light: #ffffff;
  --color-text-secondary: #d0d0d0; 
  --color-primary-gradient: linear-gradient(90deg, #313ef8, #7049fa); 
  --color-primary-shadow: rgba(112, 73, 250, 0.4); 
  --color-success: #3cb371; 
  --color-secondary-btn: #2d2d2d; 
}

/* Reset, Body, App, Container */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--color-bg-dark);
  color: var(--color-text-light);
  font-family: 'Segoe UI', Arial, sans-serif; 
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  padding-top: 100px; 
}

/* ============== HEADER FIXO (mantido) ============== */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: rgba(13, 13, 13, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.logo {
  flex-shrink: 0;
  filter: drop-shadow(0 0 5px rgba(49, 62, 248, 0.5));
}

.header-title {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
  background: var(--color-primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(112, 73, 250, 0.3);
}

/* ============== HERO ACCESS SECTION (Containers principais) ============== */
/* NOVO: ANIMAÇÃO DE BRILHO PULSANTE (Hero Card) */
@keyframes neon-pulse {
    0% { box-shadow: 0 10px 60px rgba(0,0,0,0.6), 0 0 30px rgba(49, 62, 248, 0.2); }
    50% { box-shadow: 0 10px 60px rgba(0,0,0,0.8), 0 0 50px rgba(49, 62, 248, 0.4); }
    100% { box-shadow: 0 10px 60px rgba(0,0,0,0.6), 0 0 30px rgba(49, 62, 248, 0.2); }
}

.access-page-content {
    width: 100%;
    max-width: 900px;
    text-align: center;
    padding-bottom: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.header-titles {
    margin-bottom: 50px; /* Espaço entre o título e a caixa de acesso */
}

/* Estilos para o novo Hero Banner */
.hero-vision-title.large-title {
    font-size: 3.5em; /* Aumenta consideravelmente */
    font-weight: 800;
    margin: 0;
    background: var(--color-primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 40px rgba(112, 73, 250, 0.5);
}

.hero-vision-subtitle.large-subtitle {
    color: var(--color-text-secondary);
    font-size: 1.3em; /* Aumenta o subtítulo */
    margin-top: 10px;
}
/* FIM DA NOVA ESTRUTURA DE ACESSO */


.hero-card {
  display: none; /* Hero Card antigo removido */
}

.access-system-box {
    background-color: var(--color-bg-card); 
    border-radius: 12px;
    padding: 25px;
    width: 100%;
    max-width: 400px; 
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    border: 1px solid #333;
    transition: all 0.3s ease; /* Transição para o novo efeito */
}

/* NOVO: Efeito de Borda Acendendo na Caixa de Acesso */
.access-system-box:hover,
.access-system-box:focus-within { 
    border: 1px solid #7049fa; 
    box-shadow: 0 0 15px rgba(112, 73, 250, 0.5); /* Brilho sutil */
}

.access-system-box h2 {
    font-size: 1.5em;
    color: var(--color-text-light);
    margin-top: 0;
    margin-bottom: 15px;
}

.access-system-box p {
    color: var(--color-text-secondary);
    margin-bottom: 20px;
}

.profile-selector {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 0;
}

.profile-btn {
  background: var(--color-secondary-btn); 
  color: var(--color-text-light);
  border: 1px solid #444; 
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1em;
  font-weight: 500;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.profile-btn i {
    margin-right: 8px;
}

/* NOVO: BRILHO INTENSO NOS BOTÕES DE PERFIL */
.profile-btn.active, .profile-btn:hover:not(:disabled) {
  background: var(--color-primary-gradient);
  border-color: #7049fa;
  box-shadow: 0 0 25px var(--color-primary-shadow), 0 0 5px rgba(255, 255, 255, 0.5); /* Sombra mais forte */
  transform: translateY(-2px);
}

.profile-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #1a1a1a;
    border-color: #333;
    box-shadow: none;
    transform: none;
}


/* ============== ESTILOS DASHBOARD (Gestor e Colaborador) ============== */
.dashboard {
  width: 100%;
  max-width: 900px;
  padding-top: 20px; 
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; 
  margin-bottom: 30px;
  padding: 0 5px;
}

.dashboard-header .header-content-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.dashboard-header h2 {
    background: var(--color-primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 10px rgba(112, 73, 250, 0.3);
}
.dashboard-header p {
  font-size: 1em;
  color: var(--color-text-secondary);
  margin-bottom: 0; 
  margin-top: 5px; 
}

.action-btn {
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1em;
  transition: all 0.3s;
}

.action-btn.primary {
  background: var(--color-primary-gradient);
  color: var(--color-text-light);
  box-shadow: 0 5px 15px rgba(112, 73, 250, 0.4);
}

/* Botão pequeno para responder (Colaborador) */
.action-btn.small-btn {
    padding: 8px 15px;
    font-size: 0.9em;
}

.action-btn.secondary {
  background-color: var(--color-secondary-btn);
  color: var(--color-text-light);
  border: 1px solid #444;
}

.action-btn.success {
  background-color: var(--color-success);
  color: var(--color-bg-dark);
}

/* Novo estilo para o botão 'Salvar Rascunho' da referência (roxo/azul) */
.action-btn.purple-gradient {
    background: linear-gradient(90deg, #4f46e5, #8a2be2);
    color: var(--color-text-light);
    box-shadow: 0 5px 15px rgba(112, 73, 250, 0.4);
}


.action-btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
}

/* LISTA DE PESQUISAS EMPILHADAS */
.stacked-survey-card {
    /* Estilo de Card: Fundo escuro, bordas arredondadas e sombra */
    background-color: rgba(31, 31, 31, 0.95);
    border-radius: 12px;
    padding: 10px; /* Padding interno para visualização */
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.survey-list {
    /* Define a altura máxima para mostrar apenas 4 itens + rolagem */
    max-height: 500px; /* Altura ajustada para mostrar ~4 itens visíveis */
    overflow-y: auto; /* A CHAVE: Permite a rolagem interna */
    padding: 10px 0; /* Padding sutil para a lista de rolagem */
    
    /* Estilizando a barra de rolagem para Dark Mode */
    scrollbar-color: #7049fa #1a1a1a;
    scrollbar-width: thin;
    transition: all 0.2s;
}

/* Estilo para o CARD DA PESQUISA ser clicável */
.survey-item {
  background-color: var(--color-bg-card);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* NOVO: Borda lateral transparente para o efeito de destaque */
  border-left: 5px solid transparent; 
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  margin-bottom: 10px; /* Reduz espaçamento entre itens na lista rolante */
  /* Remove a borda superior do survey-item para dar a sensação de itens "empilhados" */
  border-top: 1px solid rgba(255, 255, 255, 0.05); 
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer; /* Indica que o card é clicável */
  transition: all 0.3s;
}

/* NOVO: Efeito de borda lateral neon no hover */
.survey-item:hover {
    background-color: rgba(31, 31, 31, 0.95); 
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.8), 0 0 10px rgba(112, 73, 250, 0.3);
    border-left-color: #7049fa; /* Destaca a borda esquerda com a cor primária */
}

/* NOVO: Garante que o conteúdo de informação ocupe o espaço e se alinhe à esquerda */
.survey-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* **CHAVE**: Alinha todo o conteúdo de informação à esquerda */
    flex-grow: 1; /* Permite que o bloco de informações ocupe a maior parte do espaço */
    padding-right: 20px; /* Adiciona um espaço antes das ações */
}

.survey-info h3 {
    margin-bottom: 5px; /* Adiciona espaço abaixo do título */
}

.survey-info .subtitle {
    margin-top: 5px; /* Adiciona espaço abaixo do subtítulo */
}

.survey-info h3, 
.survey-info .subtitle {
    text-align: left; /* Garante que o texto dentro se alinhe à esquerda */
}

.survey-actions {
    display: flex;
    gap: 10px;
    flex-shrink: 0; /* Garante que os botões não encolham */
}

.status-tag {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.75em;
  font-weight: bold;
  margin-left: 10px;
  color: var(--color-bg-dark);
}

.status-tag.ativa { background-color: #22c55e; } 
.status-tag.finalizada { background-color: #6a6a6a; color: var(--color-text-light); }
.status-tag.rascunho { background-color: #ffb400; } 

.meta {
  display: flex;
  gap: 20px;
  font-size: 0.9em;
  color: #a8a8a8;
  margin-top: 10px;
}

/* Estilo para os botões de ação nos cards de pesquisa */
.icon-btn {
  background: var(--color-secondary-btn); /* Cor de fundo mais escura para aumentar a área clicável */
  border: 1px solid #333;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 8px; /* Reduzir o padding para acomodar a imagem menor */
  border-radius: 6px;
  font-size: 1em;
  transition: all 0.2s;
  
  /* Flexbox para centralizar o conteúdo (a imagem) */
  display: flex;
  justify-content: center;
  align-items: center;
  
  /* Definir um tamanho fixo para o botão */
  width: 40px; 
  height: 40px;
}

/* NOVO ESTILO: Dimensiona as imagens dentro dos botões de ícone */
.icon-btn img {
    width: 24px; /* Tamanho de ícone adequado */
    height: 24px;
    filter: invert(70%) saturate(200%); /* Cor cinza/clara suave */
    transition: filter 0.2s;
    vertical-align: middle; 
}

.icon-btn:hover {
  border-color: #7049fa; /* Borda primária no hover */
  background-color: #1a1a1a; /* Fundo um pouco mais escuro */
  
  /* Efeito Neon no hover */
  box-shadow: 0 0 15px var(--color-primary-shadow); 
}

.icon-btn:hover img {
    filter: invert(100%) saturate(100%); /* Deixa o ícone branco puro no hover */
}


/* ============== ESTILOS DO MODAL/BOX (TELA 9) ============== */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Overlay menos escuro */
    backdrop-filter: blur(5px); /* Efeito Embaçado AQUI */
    -webkit-backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000; 
}

.modal-content {
    position: relative;
    max-width: 750px;
    width: 90%;
    max-height: 90vh; 
    overflow-y: auto; 
    transform: scale(1);
    animation: fadeIn 0.3s ease;
    padding: 30px; 
}

/* Estilos específicos para o Modal de Relatório */
.report-modal {
    max-width: 850px;
}

.report-modal .status-tag.large {
    font-size: 0.9em;
    margin-top: 10px;
    display: inline-block;
    margin-left: 0; /* Remove margem extra */
}

.report-question-item {
    background-color: rgba(31, 31, 31, 0.5);
    border-radius: 8px;
    padding: 15px;
    margin-top: 20px;
    border: 1px solid #444;
}

.report-question-item h4 {
    margin-bottom: 5px;
    color: var(--color-text-light);
}

.report-question-item .q-type-tag {
    margin-bottom: 15px;
    display: inline-block;
}

/* NOVO ESTILO PARA O PLACEHOLDER DE DADOS REAIS */
.real-data-placeholder, .no-data-report {
    padding: 10px;
    border: 1px dashed #7049fa;
    border-radius: 4px;
    background-color: rgba(112, 73, 250, 0.1);
    color: #a855f7;
    font-style: italic;
    font-size: 0.9em;
    margin-top: 10px;
}

.text-insights {
    font-style: italic;
    color: #7049fa;
    margin-top: 15px;
    padding-top: 10px;
    border-top: 1px dashed #333;
    font-size: 0.9em;
}

.report-footer {
    justify-content: center;
}
/* FIM DOS ESTILOS DO RELATÓRIO */


.close-modal-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    color: var(--color-text-secondary);
    font-size: 1.5em;
    cursor: pointer;
    z-index: 2;
    transition: color 0.2s;
}

.close-modal-btn:hover {
    color: #ff4d4d;
}

/* Estilos de Transição (Opcional, mas melhora a experiência) */
.modal-enter-active, .modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
    opacity: 0;
}

/* Transição para a troca de Dashboards (Admin/Collaborator) */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

/* Títulos do Modal - Estilo mais sóbrio */
.modal-title-group h2 {
    font-size: 1.8rem;
    color: var(--color-text-light); 
    background: none; 
    -webkit-background-clip: initial;
    -webkit-text-fill-color: initial;
    text-shadow: none;
    margin-bottom: 5px;
}
.modal-title-group p {
    color: var(--color-text-secondary);
    margin-bottom: 20px;
}

/* FORMULÁRIO DE PERGUNTAS (Estilos da Tela 9) */
.questions-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.questions-header-row label {
    font-size: 1.2em; 
    font-weight: bold;
    color: var(--color-text-light);
    flex-shrink: 0;
}

.question-type-buttons {
    display: flex;
    gap: 8px;
}

/* Estilização isolada para os botões de tipo de pergunta */
.question-type-buttons .type-btn {
    padding: 8px 15px;
    font-size: 0.9em;
    background-color: var(--color-secondary-btn); 
    color: var(--color-text-light);
    border: 1px solid #444;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
}

.question-type-buttons .type-btn:hover {
    background: var(--color-primary-gradient); 
    border-color: #7049fa;
    box-shadow: 0 0 10px var(--color-primary-shadow);
    transform: translateY(-1px);
    opacity: 1; 
}


.form-group input[type="text"] {
    width: 100%; 
    padding: 12px;
    background-color: #222222;
    border: 1px solid #444444;
    color: var(--color-text-light);
    border-radius: 6px;
    box-sizing: border-box;
}

.question-item {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 15px;
    margin-top: 15px;
    border: 1px solid #444;
}

/* Botões de Ação no Rodapé */
.action-buttons-footer {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    padding-top: 20px;
    border-top: 1px solid #333;
    margin-top: 30px;
}

.q-type-tag {
    background: linear-gradient(90deg, #4f46e5, #8a2be2); 
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.8em;
    font-weight: bold;
    -webkit-background-clip: initial;
    -webkit-text-fill-color: initial;
    color: var(--color-text-light); 
}

.question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.delete-q-btn {
    background: none;
    border: none;
    color: #ff4d4d; 
    font-size: 1.2em;
    cursor: pointer;
    transition: color 0.2s, transform 0.2s;
}

.delete-q-btn:hover {
    color: #ff0000;
    transform: scale(1.1);
}

.options-group input {
    margin-bottom: 8px;
}

.option-item {
    display: flex;
    gap: 5px;
    align-items: center;
}

/* Ajustes no botão de remover opção (que agora é um icon-btn) */
.remove-option-btn {
    /* Agora é um botão de ícone completo */
    width: 30px;
    height: 30px;
    padding: 5px;
    background-color: #333; /* Fundo escuro sutil */
    border-color: #ff4d4d;
    transition: all 0.2s;
}

.remove-option-btn img {
    width: 14px; /* Imagem menor para o contexto de opção */
    height: 14px;
    /* Faz o ícone de deletar ficar Vermelho */
    filter: invert(40%) sepia(90%) saturate(1000%) hue-rotate(330deg); 
    transition: filter 0.2s;
}

.remove-option-btn:hover {
    background-color: #ff4d4d; /* Fundo vermelho no hover */
    box-shadow: 0 0 10px rgba(255, 77, 77, 0.4);
    border-color: #ff4d4d;
}

.remove-option-btn:hover img {
    filter: invert(100%); /* Deixa o ícone branco no hover */
}


.add-option-btn {
    background-color: #333;
    color: #7049fa;
    border: 1px dashed #7049fa;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9em;
    margin-top: 5px;
    transition: background-color 0.2s;
}

.add-option-btn:hover {
    background-color: #444;
}


.scale-info p {
    color: var(--color-text-secondary);
    font-size: 0.9em;
    margin-top: 5px;
}

.no-data {
    color: #6a6a6a;
    text-align: center;
    padding: 20px 0;
}

/* ========================================================= */
/* ESTILOS DE RESPOSTA DO COLABORADOR */
/* ========================================================= */

.response-modal {
    max-width: 700px;
}

.survey-form-content {
    padding-bottom: 20px;
}

.question-item {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    border: 1px solid #444;
}

.question-item label {
    display: block;
    font-weight: bold;
    margin-bottom: 10px;
    color: var(--color-text-light);
    font-size: 1.1em;
}

/* Estilo para Textarea */
.text-input {
    width: 100%;
    padding: 10px;
    background-color: #1a1a1a;
    border: 1px solid #444;
    color: var(--color-text-light);
    border-radius: 6px;
    resize: vertical;
}

/* Estilos para Múltipla Escolha */
.multiple-options-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.option-radio-item {
    display: flex;
    align-items: center;
    background-color: #1a1a1a;
    border: 1px solid #333;
    padding: 10px;
    border-radius: 6px;
    transition: all 0.2s;
}

.option-radio-item:hover {
    border-color: #7049fa;
}

.option-radio-item input[type="radio"] {
    margin-right: 10px;
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #7049fa;
    border-radius: 50%;
    position: relative;
    cursor: pointer;
    background-color: transparent;
}

.option-radio-item input[type="radio"]:checked::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #7049fa;
    transform: translate(-50%, -50%);
}

.option-radio-item label {
    margin-bottom: 0;
    cursor: pointer;
    font-weight: normal;
}

/* ========================================================= */
/* ESTILOS PARA ESCALA (NOVO DESIGN: RADIO BUTTONS EM LINHA) */
/* ========================================================= */
.scale-group.radio-scale {
    padding-top: 10px;
    margin-bottom: 0;
}

.scale-radio-options {
    display: flex;
    justify-content: space-between; 
    align-items: center;
    width: 100%;
    margin-top: 10px;
    /* Adiciona um fundo sutil para a área de seleção */
    background-color: #1a1a1a;
    border-radius: 6px;
    padding: 10px 20px;
    border: 1px solid #333;
}

.scale-radio-item {
    display: flex;
    flex-direction: column; 
    align-items: center;
    position: relative;
    padding: 5px 0;
    cursor: pointer;
    transition: all 0.2s; /* Transição para o efeito de destaque */
}

/* NOVO: Efeito de destaque na caixa quando o rádio está selecionado */
.scale-radio-item:has(input[type="radio"]:checked) {
    background: rgba(112, 73, 250, 0.15); /* Fundo roxo suave */
    border-radius: 6px;
    box-shadow: 0 0 10px rgba(112, 73, 250, 0.3); /* Brilho sutil */
    transform: scale(1.05); /* Pequeno zoom no item selecionado */
}

/* Estiliza a bolinha de radio para a escala (maior e roxo no checked) */
.scale-radio-item input[type="radio"] {
    appearance: none;
    width: 25px;
    height: 25px;
    border: 2px solid #7049fa; 
    border-radius: 50%;
    position: relative;
    cursor: pointer;
    background-color: transparent;
    transition: all 0.2s;
    margin: 0; 
    margin-bottom: 8px; 
}

/* Efeito de preenchimento ao selecionar (ponto interno) */
.scale-radio-item input[type="radio"]:checked {
    border-color: #7049fa; /* Borda roxa/azul no círculo */
}

.scale-radio-item input[type="radio"]:checked::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #7049fa; /* Cor de preenchimento (roxo/azul) */
    transform: translate(-50%, -50%);
}

/* Estilo do número (label) */
.scale-radio-item label {
    margin-bottom: 0;
    cursor: pointer;
    font-weight: bold;
    font-size: 1.1em;
    color: var(--color-text-light); 
}

/* Garante que o número dentro do item selecionado fique branco (por causa do fundo) */
.scale-radio-item:has(input[type="radio"]:checked) label {
    color: var(--color-text-light) !important; 
}


/* Remove todos os elementos de slider que não são mais usados */
.scale-labels.bottom-labels,
.scale-markers,
.scale-slider,
.scale-thumb-value,
.scale-info p,
.scale-info div {
    display: none !important;
}
/* FIM DOS ESTILOS DE ESCALA CORRIGIDOS */
/* ========================================================= */


.report-modal {
    max-width: 850px;
}

.report-modal .status-tag.large {
    font-size: 0.9em;
    margin-top: 10px;
    display: inline-block;
    margin-left: 0; /* Remove margem extra */
}

.report-question-item {
    background-color: rgba(31, 31, 31, 0.5);
    border-radius: 8px;
    padding: 15px;
    margin-top: 20px;
    border: 1px solid #444;
}

.report-question-item h4 {
    margin-bottom: 5px;
    color: var(--color-text-light);
}

.report-question-item .q-type-tag {
    margin-bottom: 15px;
    display: inline-block;
}

/* NOVO ESTILO PARA O PLACEHOLDER DE DADOS REAIS */
.real-data-placeholder {
    padding: 10px;
    border: 1px dashed #7049fa;
    border-radius: 4px;
    background-color: rgba(112, 73, 250, 0.1);
    color: #a855f7;
    font-style: italic;
    font-size: 0.9em;
    margin-top: 10px;
}

.text-insights {
    font-style: italic;
    color: #7049fa;
    margin-top: 15px;
    padding-top: 10px;
    border-top: 1px dashed #333;
    font-size: 0.9em;
}

.report-footer {
    justify-content: center;
}
</style>