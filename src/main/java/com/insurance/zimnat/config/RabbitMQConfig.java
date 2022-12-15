package com.insurance.zimnat.config;

/**
 * @author :: codemaster
 * created on :: 13/12/2022
 * Package Name :: com.insurance.zimnat.config
 */

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.ConditionalRejectingErrorHandler;
import org.springframework.amqp.rabbit.support.ListenerExecutionFailedException;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.util.ErrorHandler;
@EnableRabbit
@Configuration
public class RabbitMQConfig {

    /**
     * define varibale to hold values defined in the properties file
     */
    @Value("${rabbitmq.queue}")
    private String queueName;
    @Value("${rabbitmq.exchange}")
    private String exchange;
    @Value("${rabbitmq.routingkey}")
    private String routingkey;
    @Value("${rabbitmq.username}")
    private String username;
    @Value("${rabbitmq.password}")
    private String password;
    @Value("${rabbitmq.host}")
    private String host;
    @Value("${rabbitmq.virtualhost}")
    private String virtualHost;
    @Value("${rabbitmq.reply.timeout}")
    private Integer replyTimeout;
    @Value("${rabbitmq.concurrent.consumers}")
    private Integer concurrentConsumers;
    @Value("${rabbitmq.max.concurrent.consumers}")
    private Integer maxConcurrentConsumers;

    /**
     * create a transient queue
     * @return
     */
    @Bean
    public Queue queue() {
        return new Queue(queueName, false);
    }

    /**
     * define a Direct exchange for direct routing to message queue
     * @return
     */
    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(exchange);
    }

    /**
     *
     * @param queue - the queue to bind to the exchange using a routing key
     * @param exchange - the exchange to which the queue is bound
     * @return - Binding object
     */
    @Bean
    public Binding binding(Queue queue, DirectExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(routingkey);
    }

    /**
     * The converter to ensure conversion of messages to json and back to object
     * @return MessageConverter
     */
    @Bean
    public MessageConverter jsonMessageConverter() {
        ObjectMapper objectMapper = new ObjectMapper();
        return new Jackson2JsonMessageConverter(objectMapper);
    }

    /**
     * the connection factory to facilitate connection and authentication to the broker
     * @return ConnectionFactory
     */
    @Bean
    public ConnectionFactory connectionFactory() {
        CachingConnectionFactory connectionFactory = new CachingConnectionFactory();
        connectionFactory.setVirtualHost(virtualHost);
        connectionFactory.setHost(host);
        connectionFactory.setUsername(username);
        connectionFactory.setPassword(password);
        return connectionFactory;
    }

    /**
     *
     * @param connectionFactory - the
     * @return Advanced message queue protocol Template
     */
    @Bean
    public AmqpTemplate rabbitTemplating(ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setDefaultReceiveQueue(queueName);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        rabbitTemplate.setReplyAddress(queue().getName());
        rabbitTemplate.setReplyTimeout(replyTimeout);
        rabbitTemplate.setUseDirectReplyToContainer(false);
        return rabbitTemplate;
    }

    /**
     * Create the rabbitAdmin bean using the connectionFactory
     * @return
     */
    @Bean
    public AmqpAdmin amqpAdmin() {
        return new RabbitAdmin(connectionFactory());
    }

    /**
     * set configuration for rabbitMQ consumer(s) and decouple it using beans
     * @return
     */
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory() {
        final SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory());
        factory.setMessageConverter(jsonMessageConverter());
        factory.setConcurrentConsumers(concurrentConsumers);
        factory.setMaxConcurrentConsumers(maxConcurrentConsumers);
        factory.setErrorHandler(errorHandler());
        return factory;
    }

    /**
     * Define the error handler for the AMQP as a bean
     * @return
     */
    @Bean
    public ErrorHandler errorHandler() {
        return new ConditionalRejectingErrorHandler(new MyFatalExceptionStrategy());
    }

    /**
     * Define the DefaultExceptionStrategy class through inheritance
     */
    @Slf4j
    public static class MyFatalExceptionStrategy extends ConditionalRejectingErrorHandler.DefaultExceptionStrategy {

        @Override
        public boolean isFatal(Throwable t) {
            if (t instanceof ListenerExecutionFailedException) {
                ListenerExecutionFailedException lef = (ListenerExecutionFailedException) t;
                log.error("Failed to process inbound message from queue "
                        + lef.getFailedMessage().getMessageProperties().getConsumerQueue()
                        + "; failed message: " + lef.getFailedMessage(), t);
            }
            return super.isFatal(t);
        }
    }
}