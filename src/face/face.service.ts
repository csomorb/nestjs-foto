import { Injectable } from '@nestjs/common';
// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
import '@tensorflow/tfjs-node';

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';
import * as Sharp from 'sharp';
import path = require('path');
import { InjectRepository } from '@nestjs/typeorm';
import { Face } from './face.entity';
import { Repository } from 'typeorm';
import { FaceDto } from './face.dto';
import { PhotoService } from 'src/photo/photo.service';
import { PeopleService } from 'src/people/people.service';
import { Photo } from 'src/photo/photo.entity';
import { People } from 'src/people/people.entity';
import fs = require('fs');


// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement, additionally an implementation
// of ImageData is required, in case you want to use the MTCNN

const { Canvas, Image, ImageData } = canvas;

@Injectable()
export class FaceService {
    constructor(
        @InjectRepository(Face)
        private facesTagedRepository: Repository<Face>,
        private photoService: PhotoService,
        private peopleService: PeopleService,
        ){
        
        faceapi.env.monkeyPatch({ Canvas, Image, ImageData } as any);
        faceapi.nets.ssdMobilenetv1.loadFromDisk('./src/models').then( () => { console.log("ssdLoaded");});
        faceapi.nets.ageGenderNet.loadFromDisk('./src/models').then( () => {console.log("agegenderloaded")});
        faceapi.nets.faceRecognitionNet.loadFromDisk('./src/models').then( () => console.log("facerecognition loaded"));
        faceapi.nets.faceLandmark68Net.loadFromDisk('./src/models').then( () => console.log("facelandmark loaded"));
    }

    async detectFaces(srcOrig){
        const referenceImage:any = await canvas.loadImage('files/'+srcOrig);
        const detections = await faceapi.detectAllFaces(referenceImage);
        const detectedFaces = [];
        for (let i=0; i < detections.length; i++){
            detectedFaces.push({
                x: detections[i].relativeBox.x,
                y: detections[i].relativeBox.y,
                h: detections[i].relativeBox.height,
                w: detections[i].relativeBox.width
            });
        }
        return detectedFaces;
    }


    async createDescriptor(idPeople,idfaceed){
        const referenceImage:any = await canvas.loadImage('files/facedescriptor/'+idfaceed+'.png');
        const descriptor = await faceapi
        .detectSingleFace(referenceImage)
        .withFaceLandmarks()
        .withFaceDescriptor();
        if (!descriptor) {
            console.log(" Face not found in create descriptor! idfaceed:" + idfaceed + " idPeople: " +idPeople);
            return;
        }
        console.log("descriptor created: ");
        console.log(descriptor);
        return descriptor.descriptor;
    }

    async createFaceMatcher(nbFacePerPeople,descriptorsList: Array<any>, maxDescriptorDistance){
        const descriptorList = [];
        for (let i = 0; i < descriptorsList.length; i++){
            const indexDescriptor = descriptorList.findIndex(d => d.id === descriptorsList[i].id);
            if(indexDescriptor === -1){
                descriptorList.push({ id: descriptorsList[i].id, descriptors: [descriptorsList[i].descriptor]})
            }
            else if (descriptorList[indexDescriptor].descriptors.length < nbFacePerPeople){
                descriptorList[indexDescriptor].descriptors.push(descriptorsList[i].descriptor);
            }
        }
        const labeledDescriptors = descriptorList.map( d => {
            return new faceapi.LabeledFaceDescriptors(''+d.id,d.descriptors)
        });
        console.log("labeledDescriptorsCreated..... :");
        console.log(labeledDescriptors);
        const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, maxDescriptorDistance)
        console.log("faceMatcherCreated.......");
        return faceMatcher;
    }
    
    async predictFacesOnImage(srcOrig: string, faceMatcher: faceapi.FaceMatcher){
        const referenceImage:any = await canvas.loadImage('files/'+srcOrig);

        const results = await faceapi
            .detectAllFaces(referenceImage)
            .withFaceLandmarks()
            .withFaceDescriptors();

        results.forEach(fd => {
            const bestMatch = faceMatcher.findBestMatch(fd.descriptor);
            console.log(bestMatch.toString());
        });

    }

    async createface(faceDto: FaceDto){
        const people: People = await this.peopleService.findOne(''+faceDto.idPeople);
        const photo: Photo = await this.photoService.findOne(''+faceDto.idPhoto);
        photo.facesToTag.splice(photo.facesToTag.findIndex(f => f.x === faceDto.x && f.y === faceDto.y),1);
        let face = new Face();
        face.people = people;
        face.photo = photo;
        face.h = faceDto.h;
        face.w = faceDto.w;
        face.x = faceDto.x;
        face.y = faceDto.y;
        face.idPeople = people.id;
        face.idPhoto = photo.idPhoto;
        await this.photoService.save(photo);
        const upFolder = path.join(__dirname, '..', '..', 'files'); 
        face = await this.facesTagedRepository.save(face);
        const image = Sharp(path.join(upFolder,photo.srcOrig));
        const left = parseInt('' + (faceDto.x * photo.width));
        const top = parseInt('' + (faceDto.y * photo.height));
        const width = parseInt('' + (faceDto.w * photo.width));
        const height = parseInt('' + (faceDto.h * photo.height));
        await image.extract({ left: left, top: top, width: width, height: height})
        // .resize(200, 300, {
        //   fit: 'contain',
        // })
        .png()
        .toFile(path.join(upFolder,'facedescriptor','' + face.facesId + '.png'))
        .then(info => { console.log(info) })
        .catch(err => { console.log(err) });
        console.log("Image decoupé, construction du descripteur");
        const descriptor = await this.createDescriptor(people.id,face.facesId);
        face.descriptor = descriptor;
        return await this.facesTagedRepository.save(face);
      }

      async updateface(idFace: string,idPeople: string){
        const people = await this.peopleService.findOne(idPeople);
        const face = await this.facesTagedRepository.findOne(idFace);
        face.people = people;
        return this.facesTagedRepository.save(face);
      }

      async deleteface(idFace: string){
        const face = await this.facesTagedRepository.findOne(idFace);
        const faceToTag = {x:face.x, y:face.y, w:face.w,h:face.h};
        const photo = await this.photoService.findOne(''+face.idPhoto);
        photo.facesToTag.push(faceToTag);
        await this.photoService.save(photo);
        const upFolder = path.join(__dirname, '..', '..', 'files'); 
        try {
            fs.unlinkSync(path.join(upFolder, face.facesId +'.png'));      
        } catch(err) {
            console.error(err);
        }
        return this.facesTagedRepository.delete(idFace);
      }
    

}
