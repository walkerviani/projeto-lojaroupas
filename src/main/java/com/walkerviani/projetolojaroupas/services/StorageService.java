package com.walkerviani.projetolojaroupas.services;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.walkerviani.projetolojaroupas.entities.ImageData;
import com.walkerviani.projetolojaroupas.repositories.StorageRepository;
import com.walkerviani.projetolojaroupas.util.ImageUtils;

@Service
public class StorageService {

    @Autowired
    private StorageRepository storageRepository;

    public String uploadFile(MultipartFile file) throws IOException {
        String randomId = UUID.randomUUID().toString();
        String fileName = randomId + "_" + file.getOriginalFilename();
        ImageData imageData = storageRepository.save(ImageData.builder()
                .name(fileName)
            .type(file.getContentType())
        .imageData(ImageUtils.compressImage(file.getBytes())).build());
        if(imageData != null){
            return fileName;
        }
        return null;
    }

    public byte[] downloadImage(String fileName){
        Optional<ImageData> dbImageData = storageRepository.findByName(fileName);
        byte[] images = ImageUtils.decompressImage(dbImageData.get().getImageData());
        return images;
    }
}
