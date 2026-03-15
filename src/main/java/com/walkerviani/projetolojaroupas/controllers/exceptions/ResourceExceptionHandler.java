package com.walkerviani.projetolojaroupas.controllers.exceptions;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.walkerviani.projetolojaroupas.services.exceptions.CategoryNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.ClothesNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.DatabaseException;
import com.walkerviani.projetolojaroupas.services.exceptions.OrderNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.UserNotFoundException;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class ResourceExceptionHandler {

    @ExceptionHandler({OrderNotFoundException.class, CategoryNotFoundException.class, ClothesNotFoundException.class, UserNotFoundException.class})
    public ResponseEntity <StandardError> resourceNotFound(RuntimeException e, HttpServletRequest request) {
        String string = "Resource not found";
        HttpStatus status = HttpStatus.NOT_FOUND;

        StandardError error = new StandardError(
            Instant.now(), 
            status.value(), 
            string, 
            e.getMessage(), 
            request.getRequestURI());
        
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(DatabaseException.class)
    public ResponseEntity <StandardError> databaseError(DatabaseException e, HttpServletRequest request) {
        String string = "Database error";
        HttpStatus status = HttpStatus.BAD_REQUEST;

        StandardError error = new StandardError(
            Instant.now(), 
            status.value(), 
            string, 
            e.getMessage(), 
            request.getRequestURI());
        
        return ResponseEntity.status(status).body(error);
    }
}
