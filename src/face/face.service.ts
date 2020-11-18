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
    

}
