const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const dayjs = require('dayjs');
require('dayjs/locale/pt-br');

admin.initializeApp();
dayjs.locale('pt-br');

const db = admin.firestore();

// CONFIGURAÇÃO DA API DE WHATSAPP (Substituir pelos dados reais)
// Recomenda-se usar Firebase Secrets: firebase functions:secrets:set WHATSAPP_API_KEY
const WHATSAPP_API_URL = 'https://api.sua-instancia.com'; // Ex: Evolution API ou Z-API
const WHATSAPP_API_KEY = 'SUA_CHAVE_API_AQUI';
const WHATSAPP_INSTANCE = 'nome_instancia';

/**
 * Função para disparar a mensagem via Gateway
 */
async function sendWhatsApp(to, message) {
    try {
        const cleanNumber = to.replace(/\D/g, '');
        // Ajuste o endpoint e body conforme a sua API (Evolution, Z-API, etc)
        const response = await axios.post(`${WHATSAPP_API_URL}/message/sendText/${WHATSAPP_INSTANCE}`, {
            number: cleanNumber,
            text: message,
            linkPreview: true
        }, {
            headers: { 'apikey': WHATSAPP_API_KEY }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao enviar WhatsApp:', error.response?.data || error.message);
        return null;
    }
}

/**
 * Automação 1: Lembrete de Agendamento (24h antes)
 * Roda todos os dias às 18:00 para avisar sobre amanhã
 */
exports.scheduledAppointmentReminders = functions.pubsub
    .schedule('0 18 * * *') // Todo dia às 18:00
    .timeZone('America/Sao_Paulo')
    .onRun(async (context) => {
        const amanhã = dayjs().add(1, 'day').format('DD/MM/YYYY');
        console.log(`Buscando agendamentos para: ${amanhã}`);

        const snapshot = await db.collection('agendamentos')
            .where('dataStr', '==', amanhã)
            .where('status', 'not-in', ['Cancelado', 'Concluído'])
            .get();

        if (snapshot.empty) {
            console.log('Nenhum agendamento encontrado para amanhã.');
            return null;
        }

        const promises = snapshot.docs.map(async (doc) => {
            const data = doc.data();
            if (data.lembreteAutomativoEnviado) return; // Evita duplicidade

            const msg = `Olá, *${data.cliente}*! 🚗✨\n\nPassando para confirmar seu serviço de *${data.servico}* agendado para amanhã, dia *${data.dataStr}* às *${data.horario}*.\n\nPodemos confirmar? Aguardamos você!`;

            const success = await sendWhatsApp(data.telefone, msg);
            if (success) {
                await doc.ref.update({ lembreteAutomativoEnviado: true });
            }
        });

        await Promise.all(promises);
        return console.log('Lembretes de agendamento enviados.');
    });

/**
 * Automação 2: Lembrete de Aniversário
 * Roda todos os dias às 09:00
 */
exports.scheduledBirthdayWishes = functions.pubsub
    .schedule('0 9 * * *') // Todo dia às 09:00
    .timeZone('America/Sao_Paulo')
    .onRun(async (context) => {
        const hojeMesDia = dayjs().format('MM-DD');
        console.log(`Buscando aniversariantes do dia: ${hojeMesDia}`);

        const snapshot = await db.collection('clientes').get();

        const aniversariantes = snapshot.docs.filter(doc => {
            const data = doc.data();
            if (!data.dataAniversario) return false;
            // dataAniversario vem como YYYY-MM-DD do input type="date"
            return data.dataAniversario.endsWith(hojeMesDia);
        });

        if (aniversariantes.length === 0) {
            console.log('Nenhum aniversariante hoje.');
            return null;
        }

        const promises = aniversariantes.map(async (doc) => {
            const data = doc.data();
            const msg = `Parabéns, *${data.nome}*! 🎂🎊\n\nA equipe da *Estética Automotiva Alisson* te deseja um dia incrível e cheio de realizações!\n\nComo presente, você tem um desconto especial na sua próxima lavagem técnica este mês. Esperamos você! 🚗💦`;

            await sendWhatsApp(data.telefone, msg);
        });

        await Promise.all(promises);
        return console.log('Mensagens de aniversário enviadas.');
    });
