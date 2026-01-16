package com.walkerviani.projetolojaroupas.entities.enums;

public enum Size {
    SMALL(1),
    MEDIUM(2),
    LARGE(3);

    private int code;

    private Size(int code){
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public static Size valueOf(int code) {
        for (Size value : Size.values()) {
            if (value.getCode() == code) {
                return value;
            }
        }
        throw new IllegalArgumentException("Invalid Size code");
    }
}
