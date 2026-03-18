package com.parking.parkingbackend.dto;

import com.parking.parkingbackend.enums.Role;
import lombok.Data;

@Data
public class RegisterRequest {

    private String name;
    private String email;
    private String password;
    private Role role;

}