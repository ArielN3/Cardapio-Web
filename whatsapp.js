// Integração com WhatsApp
class WhatsAppService {
    constructor() {
        this.businessPhone = '5511999999999'; // Substitua pelo número da hamburgueria
    }

    // Formatar número de telefone para WhatsApp
    formatPhoneNumber(phone) {
        // Remove caracteres especiais e adiciona código do país se necessário
        let cleanPhone = phone.replace(/\D/g, '');
        
        // Se não tem código do país, adiciona 55 (Brasil)
        if (cleanPhone.length === 11 && cleanPhone.startsWith('11')) {
            cleanPhone = '55' + cleanPhone;
        } else if (cleanPhone.length === 10) {
            cleanPhone = '5511' + cleanPhone;
        }
        
        return cleanPhone;
    }

    // Gerar mensagem baseada no status do pedido
    generateMessage(order, status) {
        const orderNumber = order.id.slice(-8).toUpperCase();
        const customerName = order.customer_name;
        const total = parseFloat(order.total).toFixed(2);
        
        const messages = {
            pending: `🍔 *Casa do Hambúrguer*

Olá ${customerName}! 

Seu pedido #${orderNumber} foi recebido com sucesso! 

📋 *Resumo do pedido:*
${this.formatOrderItems(order.items)}

💰 *Total:* R$ ${total}

⏰ Tempo estimado: 25-35 minutos
📍 Você será notificado quando estiver pronto!

Obrigado pela preferência! 🙏`,

            preparing: `👨‍🍳 *Casa do Hambúrguer*

Oi ${customerName}! 

Seu pedido #${orderNumber} está sendo preparado! 

🔥 Nossos chefs estão caprichando no seu hambúrguer...

⏰ Tempo estimado: 15-20 minutos
📱 Te avisamos quando estiver prontinho!`,

            ready: `✅ *Casa do Hambúrguer*

${customerName}, seu pedido está PRONTO! 🎉

📦 Pedido #${orderNumber} 
💰 Total: R$ ${total}

🏃‍♂️ Pode vir buscar ou aguarde nosso entregador!

📍 Endereço: Rua dos Sabores, 123
📞 Dúvidas: (11) 99999-9999`,

            delivered: `🚚 *Casa do Hambúrguer*

Pedido entregue com sucesso! 

Obrigado ${customerName}! 

⭐ Que tal avaliar nosso atendimento?
🔄 Esperamos você novamente em breve!

Casa do Hambúrguer - Os melhores da cidade! 🍔❤️`
        };

        return messages[status] || '';
    }

    // Formatar itens do pedido
    formatOrderItems(items) {
        return items.map(item => 
            `• ${item.name} x${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');
    }

    // Enviar mensagem via WhatsApp Web
    sendMessage(phone, message) {
        const formattedPhone = this.formatPhoneNumber(phone);
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
        
        // Abrir WhatsApp Web em nova aba
        window.open(whatsappUrl, '_blank');
        
        return whatsappUrl;
    }

    // Enviar notificação de novo pedido para o dono
    notifyNewOrder(order) {
        const orderNumber = order.id.slice(-8).toUpperCase();
        const customerName = order.customer_name;
        const customerPhone = order.customer_phone;
        const total = parseFloat(order.total).toFixed(2);
        
        const message = `🔔 *NOVO PEDIDO RECEBIDO!*

📋 *Pedido:* #${orderNumber}
👤 *Cliente:* ${customerName}
📞 *Telefone:* ${customerPhone}
💰 *Total:* R$ ${total}

📝 *Itens:*
${this.formatOrderItems(order.items)}

⏰ *Recebido:* ${new Date().toLocaleString('pt-BR')}

🍔 Casa do Hambúrguer`;

        return this.sendMessage(this.businessPhone, message);
    }

    // Enviar atualização de status para o cliente
    sendStatusUpdate(order, newStatus) {
        const message = this.generateMessage(order, newStatus);
        if (message) {
            return this.sendMessage(order.customer_phone, message);
        }
        return null;
    }
}

// Instância global do serviço
const whatsappService = new WhatsAppService();