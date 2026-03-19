package com.walkerviani.projetolojaroupas.services;

import java.io.IOException;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.walkerviani.projetolojaroupas.entities.ImageData;
import com.walkerviani.projetolojaroupas.repositories.StorageRepository;
import com.walkerviani.projetolojaroupas.services.exceptions.ImageNotFoundException;
import com.walkerviani.projetolojaroupas.services.exceptions.ValidationException;
import com.walkerviani.projetolojaroupas.util.ImageUtils;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class StorageService {

    private final StorageRepository storageRepository;

    public String uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ValidationException("File cannot be empty");
        }

        if (!"image/png".equals(file.getContentType())) {
            throw new ValidationException("Only PNG images are allowed");
        }
        if(file.getOriginalFilename() == null) {
            throw new ValidationException("Invalid file name");
        }
        try {
            String randomId = UUID.randomUUID().toString();
            String fileName = randomId + "_" + file.getOriginalFilename();

            storageRepository.save(ImageData.builder()
                    .name(fileName)
                    .type(file.getContentType())
                    .imageData(ImageUtils.compressImage(file.getBytes())).build());

            return fileName;
        } catch (IOException e) {
            throw new ValidationException("Error processing image file");
        }

    }

    public byte[] downloadImage(String fileName) {
        ImageData imageData = storageRepository.findByName(fileName)
                .orElseThrow(() -> new ImageNotFoundException("Image not found"));

        byte[] images = ImageUtils.decompressImage(imageData.getImageData());

        return images;
    }
}
