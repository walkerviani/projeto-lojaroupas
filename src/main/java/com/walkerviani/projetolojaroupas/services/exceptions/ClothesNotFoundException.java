package com.walkerviani.projetolojaroupas.services.exceptions;

public class ClothesNotFoundException extends RuntimeException{

    public ClothesNotFoundException(Object id){
        super("Clothes not found. Id " + id);
    }
}
