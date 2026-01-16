package com.walkerviani.projetolojaroupas.entities.enums;

public enum Color {
    RED(1),
    YELLOW(2),
    BLUE(3),
    GREEN(4),
    ORANGE(5),
    PURPLE(6),
    WHITE(7),
    BLACK(8),
    GREY(9),
    BEIGE(10),
    BROWN(11);

    private int code;

    private Color(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public static Color valueOf(int code) {
        for (Color value : Color.values()) {
            if (value.getCode() == code) {
                return value;
            }
        }
        throw new IllegalArgumentException("Invalid Color code");
    }
}
