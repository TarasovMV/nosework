import Compressor from 'compressorjs';
import {Observable} from 'rxjs';

export const compressImage$ = (file: File) =>
    new Observable(observer => {
        console.log(file);
        new Compressor(file, {
            quality: 0.6,
            success(compressedFile) {
                (window as any).ngZone.run();
                observer.next(compressedFile as File);
            },
            error(err) {
                observer.error(err);
            },
        });
    }) as Observable<File>;

export const compressImage = (file: File) =>
    new Promise((resolve, reject) => {
        file.arrayBuffer().then(arrayBuffer => {
            const blob = new Blob([new Uint8Array(arrayBuffer)], {type: 'image/*'});
            new Compressor(blob, {
                quality: 0.6,
                maxHeight: 500,
                maxWidth: 500,
                convertTypes: ['image/webp'],
                success(compressedFile) {
                    resolve(compressedFile as File);
                },
                error(err) {
                    reject(err);
                },
            });
        });
    });
