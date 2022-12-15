package com.insurance.zimnat.config;

/**
 * @author :: codemaster
 * created on :: 13/12/2022
 * Package Name :: com.insurance.zimnat.config
 */

import com.insurance.zimnat.models.Message;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Queue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
@Slf4j
public class RabbitMQSender {
    @Autowired
    private AmqpTemplate rabbitTemplate;
    @Autowired
    private Queue queue;

    /**
     * The send method which converts and sends the message to the broker.
     * @param message - the message that is to be sent
     */
    public void send(Message message) {
        rabbitTemplate.convertAndSend(queue.getName(), message);
        log.info("Sending Message to the Queue : " + message.toString());
    }
}