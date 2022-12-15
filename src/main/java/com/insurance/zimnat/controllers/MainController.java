package com.insurance.zimnat.controllers;

import com.insurance.zimnat.config.RabbitMQSender;
import com.insurance.zimnat.models.Message;
import com.insurance.zimnat.models.PostMessage;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 13/12/2022
 * Package Name :: com.insurance.zimnat
 */

@RestController
@CrossOrigin
@RequestMapping("/api")
public class MainController {

    @Autowired
    RabbitMQSender rabbitMQSender;

    /**
     * the test method to see if the application is up and running.
     * @return a string just to test
     */
    @GetMapping("/test")
    public ResponseEntity<String> test(){
        return ResponseEntity.ok("1-2 testing");
    }

    /**
     * the send method accessed via http path
     * @param postMessage
     * @return - returns either a string message or http error 500
     */
    @RequestMapping(value = "/send", method = RequestMethod.POST)
    public ResponseEntity<String> sendMessage(@RequestBody PostMessage postMessage){
        Message message=new Message();
        message.setMessage(postMessage.getMessage());
        try{
            rabbitMQSender.send(message);
        }catch (Exception e){
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return  ResponseEntity.ok("Message sent to the broker successfully!");
    }


}
