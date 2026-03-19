package com.walkerviani.projetolojaroupas.controllers.exceptions;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.walkerviani.projetolojaroupas.services.exceptions.CategoryNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.ClothesNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.DatabaseException;
import com.walkerviani.projetolojaroupas.services.exceptions.ImageNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.OrderNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.UserNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.ValidationException;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class ResourceExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<StandardError> handleGeneric(Exception e, HttpServletRequest request) {
        
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        return ResponseEntity.status(status)
        .body(buildError(status, "Unexpected error", e.getMessage(), request));
    }

    @ExceptionHandler({ OrderNotFoundException.class, CategoryNotFoundException.class, ClothesNotFoundException.class,
            UserNotFoundException.class, ImageNotFoundException.class })
    public ResponseEntity<StandardError> resourceNotFound(RuntimeException e, HttpServletRequest request) {

        HttpStatus status = HttpStatus.NOT_FOUND;
        return ResponseEntity.status(status)
                .body(buildError(status, "Resource not found", e.getMessage(), request));
    }

    @ExceptionHandler(DatabaseException.class)
    public ResponseEntity<StandardError> databaseError(DatabaseException e, HttpServletRequest request) {

        HttpStatus status = HttpStatus.CONFLICT;
        return ResponseEntity.status(status)
                .body(buildError(status, "Database error", e.getMessage(), request));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<StandardError> validationError(ValidationException e, HttpServletRequest request) {

        HttpStatus status = HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status)
                .body(buildError(status, "Validation error", e.getMessage(), request));
    }

    private StandardError buildError(HttpStatus status, String error, String message, HttpServletRequest request) {
        return new StandardError(
                Instant.now(),
                status.value(),
                error,
                message,
                request.getRequestURI());
    }
}