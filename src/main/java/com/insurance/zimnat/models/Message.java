package com.insurance.zimnat.models;

/**
 * @author :: codemaster
 * created on :: 13/12/2022
 * Package Name :: com.insurance.zimnat.models
 */

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message implements Serializable {

    private static final long serialVersionUID = -1138446817700416884L;
    @JsonProperty
    private Date dateCreated;
    @JsonProperty
    private List<String> message;
    @JsonProperty
    private String description;


}