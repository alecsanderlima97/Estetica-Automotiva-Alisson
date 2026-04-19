# Plano de Implementação: Automação WhatsApp 🚀

Para garantir a segurança e não alterar o sistema que já está funcionando perfeitamente, seguiremos uma estratégia de **Módulo Isolado**.

## 🏗️ Arquitetura Proposta

Criaremos uma nova pasta chamada `/functions` na raiz do projeto. Esta pasta conterá o "cérebro" das automações, que rodará diretamente nos servidores do Firebase (Google Cloud), sem interferir no código do seu site atual.

### 1. Novo Módulo de Backend (Firebase Functions)
- **Localização**: `/functions` (independente de `/src`)
- **Tecnologia**: Node.js
- **Segurança**: Roda em ambiente isolado, acessando o Firestore de forma privada.

### 2. Fluxo de Trabalho (Não Destrutivo)
1. **Instalação do Módulo**: Apenas adicionaremos arquivos de configuração do Firebase (`firebase.json`, `.firebaserc`).
2. **Desenvolvimento das Funções**:
    - `checkAppointments`: Verifica agendamentos para o dia seguinte a cada hora.
    - `checkBirthdays`: Verifica aniversários uma vez por dia às 09:00.
3. **Integração com API de WhatsApp**: Usaremos uma variável de ambiente (Secret) para guardar a chave da API, sem expor no frontend.

## 🛡️ Garantia de Segurança
- O site atual continuará funcionando exatamente como está.
- Não alteraremos arquivos existentes em `/src/pages` ou `/src/components` nesta fase inicial.
- O backup completo foi realizado em `backups/backup_whatsapp_safe_190426.zip`.

---
📅 **Data**: 19/04/2026
⏰ **Hora**: 14:05
✍️ **Responsável**: Antigravity (Orquestracs)
