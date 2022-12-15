package com.insurance.zimnat.config;

/**
 * @author :: codemaster
 * created on :: 13/12/2022
 * Package Name :: com.insurance.zimnat.config
 */

import com.insurance.zimnat.models.Message;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
@Component
@Slf4j
@RabbitListener(queues = "rabbitmq.queue", id = "listener")
public class RabbitMQReceiver {

    /**
     * the receiver method
     * @param message - the message received from the broker
     */
    @RabbitHandler
    public void receiver(Message message) {
        log.info("Message listener invoked -: " + message.getMessage());
    }
}