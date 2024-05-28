import sharp from 'sharp';
import { Err, Ok } from 'ts-results-es';

export const decodeJpeg = async (
    buffer: | Buffer
        | ArrayBuffer
        | Uint8Array
        | Uint8ClampedArray
        | Int8Array
        | Uint16Array
        | Int16Array
        | Uint32Array
        | Int32Array
        | Float32Array
        | Float64Array
        | string,
    quality: number = 100
) => {
    const bufferData = await sharp(buffer).jpeg({quality: quality}).toBuffer()
    const arrayData = Buffer.from(bufferData).toJSON().data;
    // const Req = new Blob([JSON.stringify(arrayData)]).size / (1024 * 1024);
    // console.log(`Req size: ${Req} MB`);
    return arrayData;
};

export const compressJpeg = async (
    buffer: number[],
    quality: number,
) => {
    const bufferData = await sharp(Buffer.from(buffer)).jpeg({quality: quality}).toBuffer()
    return Buffer.from(bufferData).toJSON().data;
};

export const compressPng = async (
    buffer: number[],
    quality: number,
) => {
    const bufferData = await sharp(Buffer.from(buffer)).png({quality: quality}).toBuffer()
    return Buffer.from(bufferData).toJSON().data;
};

export const compress = async (
    buffer: number[],
    format: string,
    quality: number,
) => {
    if (format === 'jpeg') {
        return Ok(await compressJpeg(buffer, quality))
    } else if (format === 'png') {
        return Ok(await compressPng(buffer, quality))
    } else {
        return Err(`Unsupported format ${format}`)
    }
}