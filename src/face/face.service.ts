import { Injectable } from '@nestjs/common';
// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
import '@tensorflow/tfjs-node';

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';


// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement, additionally an implementation
// of ImageData is required, in case you want to use the MTCNN

const { Canvas, Image, ImageData } = canvas;

@Injectable()
export class FaceService {
    constructor(){
        
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


    async createDescriptor(idPeople,idFaceTaged){
        const referenceImage:any = await canvas.loadImage('files/facedescriptor/'+idFaceTaged+'.png');
        const descriptor = await faceapi
        .detectSingleFace(referenceImage)
        .withFaceLandmarks()
        .withFaceDescriptor();
        if (!descriptor) {
            console.log(" Face not found in create descriptor! idFaceTaged:" + idFaceTaged + " idPeople: " +idPeople);
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
    

}
