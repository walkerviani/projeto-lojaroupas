package com.walkerviani.projetolojaroupas.services.exceptions;

public class StockNotAvailableException extends RuntimeException{

    public StockNotAvailableException(String message){
        super(message);
    }
}
