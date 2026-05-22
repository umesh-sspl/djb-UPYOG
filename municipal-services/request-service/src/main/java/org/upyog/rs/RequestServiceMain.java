package org.upyog.rs;


import org.egov.tracer.config.TracerConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableScheduling;

@Import({ TracerConfiguration.class })
@SpringBootApplication
@ComponentScan(basePackages = { "org.upyog.rs", "org.upyog.rs.web.controllers" , "org.upyog.rs.config"})
@EnableScheduling
public class RequestServiceMain {


    public static void main(String[] args) throws Exception {
        SpringApplication.run(RequestServiceMain.class, args);
    }

}
