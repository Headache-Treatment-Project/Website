package com.migraine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * 偏頭痛個案照護系統 - 主應用程式
 */
@SpringBootApplication
@EnableJpaAuditing
public class MigraineCareApplication {

    public static void main(String[] args) {
        SpringApplication.run(MigraineCareApplication.class, args);
        System.out.println("===========================================");
        System.out.println("偏頭痛個案照護系統已啟動");
        System.out.println("API 端點: http://localhost:8080/api");
        System.out.println("===========================================");
    }
}
