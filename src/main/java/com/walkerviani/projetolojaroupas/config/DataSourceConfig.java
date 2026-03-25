package com.walkerviani.projetolojaroupas.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Value("${DATABASE_URL}")
    private String dbUrl;

    @Value("${DATABASE_USERNAME}")
    private String dbUser;

    @Value("${DATABASE_PASSWORD}")
    private String dbPass;

    @Bean
    public DataSource getDataSource() {
        return DataSourceBuilder.create()
                .driverClassName("com.mysql.cj.jdbc.Driver")
                .url(dbUrl)
                .username(dbUser)
                .password(dbPass)
                .build();
    }
}