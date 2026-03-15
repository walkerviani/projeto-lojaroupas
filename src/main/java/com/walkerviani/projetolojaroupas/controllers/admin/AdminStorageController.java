package com.walkerviani.projetolojaroupas.controllers.admin;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.walkerviani.projetolojaroupas.services.StorageService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/api/admin/image")
public class AdminStorageController {

    private final StorageService storageService;

    @PostMapping
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) throws IOException{
       String uploadImage = storageService.uploadFile(file);
       return ResponseEntity.status(HttpStatus.OK).body(uploadImage);
    }
}
