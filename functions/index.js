const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const dayjs = require('dayjs');
require('dayjs/locale/pt-br');

// Inicializa o Firebase Admin
admin.initializeApp();
dayjs.locale('pt-br');

const db = admin.firestore();

// CONFIGURAÇÃO DA Z-API
const Z_API_URL = 'https://api.z-api.io/instances/3F1E61365459D2C6327FBE4FDF68D33E/token/E145B91BDC084BEE32672150/send-text';

/**
 * Função para disparar a mensagem via Z-API
 */
async function sendWhatsApp(to, message) {
    try {
        const cleanNumber = to.replace(/\D/g, '');
        console.log(`Enviando mensagem para ${cleanNumber} via Z-API...`);

        const response = await axios.post(Z_API_URL, {
            phone: cleanNumber,
            message: message
        });

        console.log('Resposta da Z-API:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao enviar WhatsApp (Z-API):', error.response?.data || error.message);
        return null;
    }
}

/**
 * Automação 1: Lembrete de Agendamento (24h antes)
 * Roda todos os dias às 18:00
 */
exports.scheduledAppointmentReminders = functions
    .region('us-central1')
    .pubsub.schedule('0 18 * * *')
    .timeZone('America/Sao_Paulo')
    .onRun(async (context) => {
        const amanha = dayjs().add(1, 'day').format('DD/MM/YYYY');
        console.log(`Buscando agendamentos para: ${amanha}`);

        const snapshot = await db.collection('agendamentos')
            .where('dataStr', '==', amanha)
            .where('status', 'not-in', ['Cancelado', 'Concluído'])
            .get();

        if (snapshot.empty) {
            console.log('Nenhum agendamento encontrado para amanhã.');
            return null;
        }

        const promises = snapshot.docs.map(async (doc) => {
            const data = doc.data();
            if (data.lembreteAutomativoEnviado) return;

            const msg = `Olá, *${data.cliente}*! 🚗✨\n\nPassando para confirmar seu serviço de *${data.servico}* agendado para amanhã, dia *${data.dataStr}* às *${data.horario}*.\n\nPodemos confirmar? Aguardamos você!`;

            const success = await sendWhatsApp(data.telefone, msg);
            if (success) {
                await doc.ref.update({ lembreteAutomativoEnviado: true });
            }
        });

        await Promise.all(promises);
        console.log('Processamento de lembretes concluído.');
        return null;
    });

/**
 * Automação 2: Lembrete de Aniversário
 * Roda todos os dias às 09:00
 */
exports.scheduledBirthdayWishes = functions
    .region('us-central1')
    .pubsub.schedule('0 9 * * *')
    .timeZone('America/Sao_Paulo')
    .onRun(async (context) => {
        const hojeMesDia = dayjs().format('MM-DD');
        console.log(`Buscando aniversariantes do dia: ${hojeMesDia}`);

        const snapshot = await db.collection('clientes').get();

        const aniversariantes = snapshot.docs.filter(doc => {
            const data = doc.data();
            if (!data.dataAniversario) return false;
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
        console.log('Processamento de aniversários concluído.');
        return null;
    });
